#!/usr/bin/env node
/**
 * fetch-cit-cases.cjs — Daily CIT IEEPA case tracker
 *
 * Fetches new Court of International Trade dockets from the CourtListener
 * RECAP API, filters to IEEPA-related tariff cases, and merges into:
 *   public/cit-cases.json
 *
 * Usage:  node scripts/fetch-cit-cases.cjs
 * Env:    COURTLISTENER_TOKEN  — free API token from courtlistener.com
 *
 * To get a token: sign up at https://www.courtlistener.com/sign-in/
 * then go to https://www.courtlistener.com/help/api/rest/ → "Get API Key"
 *
 * Schedule: run daily via cron, GitHub Actions, or scheduled task
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

/* ─── CONFIG ─── */

const PUBLIC_DIR = path.resolve(__dirname, "..", "public");
const CASES_FILE = path.join(PUBLIC_DIR, "cit-cases.json");

// CourtListener API
const CL_BASE = "https://www.courtlistener.com/api/rest/v4";
const CL_TOKEN = process.env.COURTLISTENER_TOKEN || "";

// CIT court ID in CourtListener
const COURT_ID = "cit";

// Keywords that indicate IEEPA tariff cases
const IEEPA_KEYWORDS = [
  "ieepa",
  "tariff",
  "duties",
  "customs",
  "import",
  "cbp",
  "border protection",
  "international emergency economic powers",
  "hts",
  "harmonized tariff",
];

// How many days back to look for new filings (on each run)
const LOOKBACK_DAYS = 7;

/* ─── HELPERS ─── */

function fetchJson(url, token) {
  return new Promise((resolve, reject) => {
    const headers = {
      "User-Agent": "RewindTariffs-CaseTracker/1.0",
      Accept: "application/json",
    };
    if (token) headers["Authorization"] = `Token ${token}`;

    https
      .get(url, { headers }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchJson(res.headers.location, token).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          let body = "";
          res.on("data", (d) => (body += d));
          res.on("end", () => reject(new Error(`HTTP ${res.statusCode}: ${body.substring(0, 200)}`)));
          return;
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error("Invalid JSON: " + e.message));
          }
        });
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return dateStr.substring(0, 10); // YYYY-MM-DD
}

function isIeepaRelated(title, natureOfSuit) {
  const text = ((title || "") + " " + (natureOfSuit || "")).toLowerCase();
  // CIT cases categorized as "Tariffs, Duties, Fees" are almost certainly IEEPA-related
  // post-Supreme Court ruling (Feb 20, 2026)
  if (text.includes("tariff") || text.includes("duties") || text.includes("fees")) return true;
  return IEEPA_KEYWORDS.some((kw) => text.includes(kw));
}

function extractCaseNumber(docketNumber) {
  // CourtListener format: "1:26-cv-01259" or similar
  if (!docketNumber) return "";
  return docketNumber.replace(/\s+/g, "");
}

function guessStatus(docket) {
  // Based on flags or date
  const flags = (docket.flags || "").toLowerCase();
  if (flags.includes("stayed")) return "Stayed";
  if (flags.includes("remand")) return "Remand";
  // Cases filed after the Supreme Court ruling (Feb 20, 2026) are likely "Filed"
  // Cases filed before are likely "Remand" (the original test cases)
  const filed = docket.date_filed || "";
  if (filed >= "2026-02-20") return "Filed";
  return "Filed";
}

/* ─── MAIN ─── */

async function main() {
  console.log("⚖️  Fetching CIT IEEPA cases from CourtListener...\n");

  if (!CL_TOKEN) {
    console.warn("  ⚠ No COURTLISTENER_TOKEN set. API calls may be rate-limited.");
    console.warn("    Get a free token at https://www.courtlistener.com/sign-in/\n");
  }

  // Load existing cases
  let existing = { lastUpdated: "", source: "PACER - U.S. Court of International Trade", totalCases: 0, cases: [] };
  try {
    if (fs.existsSync(CASES_FILE)) {
      existing = JSON.parse(fs.readFileSync(CASES_FILE, "utf-8"));
      console.log(`  Loaded ${existing.cases.length} existing cases (last updated: ${existing.lastUpdated})`);
    }
  } catch (e) {
    console.warn("  Could not load existing cases:", e.message);
  }

  const existingNumbers = new Set(existing.cases.map((c) => c.caseNumber));

  // Calculate date range
  const now = new Date();
  const lookback = new Date(now);
  lookback.setDate(lookback.getDate() - LOOKBACK_DAYS);
  const dateFrom = lookback.toISOString().substring(0, 10);
  const dateTo = now.toISOString().substring(0, 10);

  console.log(`  Searching for cases filed ${dateFrom} to ${dateTo}\n`);

  let newCount = 0;
  let nextUrl = `${CL_BASE}/dockets/?court=${COURT_ID}&date_filed__gte=${dateFrom}&date_filed__lte=${dateTo}&order_by=-date_filed&page_size=100`;

  while (nextUrl) {
    try {
      console.log(`  Fetching: ${nextUrl.substring(0, 100)}...`);
      const data = await fetchJson(nextUrl, CL_TOKEN);
      const results = data.results || [];
      console.log(`    Got ${results.length} dockets`);

      for (const docket of results) {
        const caseNum = extractCaseNumber(docket.docket_number_core ? `1:${docket.docket_number}` : docket.docket_number);
        const normalizedNum = caseNum || `1:26-cv-${String(docket.docket_number_core || "").padStart(5, "0")}`;

        // Skip if already have this case
        if (existingNumbers.has(normalizedNum)) continue;

        // Check if IEEPA-related
        const title = docket.case_name || "";
        const nos = docket.nature_of_suit || "";
        if (!isIeepaRelated(title, nos)) continue;

        const newCase = {
          caseNumber: normalizedNum,
          judge: docket.assigned_to_str || "",
          title: title,
          filedDate: formatDate(docket.date_filed),
          category: nos || "Tariffs, Duties, Fees, Other Taxes",
          presider: docket.assigned_to_str || "Unassigned",
          product: "",
          flags: "IEEPA",
          status: "Filed",
        };

        existing.cases.push(newCase);
        existingNumbers.add(normalizedNum);
        newCount++;
        console.log(`    ✓ ${normalizedNum} - ${title.substring(0, 50)}...`);
      }

      // Pagination
      nextUrl = data.next || null;
      if (nextUrl) {
        await new Promise((r) => setTimeout(r, 1000)); // rate limit courtesy
      }
    } catch (e) {
      console.warn(`    ⚠ API error: ${e.message}`);
      // If we get a 429 or auth error, stop pagination
      if (e.message.includes("429") || e.message.includes("401") || e.message.includes("403")) {
        console.warn("    Stopping due to rate limit or auth issue.");
        break;
      }
      nextUrl = null;
    }
  }

  // Also try Justia as a fallback source for very recent filings
  // (CourtListener can have a 1-2 day delay on PACER data)
  console.log("\n  Checking Justia for latest filings...");
  try {
    await fetchJustiaRecent(existing, existingNumbers, (count) => (newCount += count));
  } catch (e) {
    console.warn(`    ⚠ Justia fallback failed: ${e.message}`);
  }

  // Sort cases by filed date (newest first), then by case number
  existing.cases.sort((a, b) => {
    const dateCompare = (b.filedDate || "").localeCompare(a.filedDate || "");
    if (dateCompare !== 0) return dateCompare;
    return (b.caseNumber || "").localeCompare(a.caseNumber || "");
  });

  // Update metadata
  existing.lastUpdated = dateTo;
  existing.totalCases = existing.cases.length;

  // Write updated file
  fs.writeFileSync(CASES_FILE, JSON.stringify(existing, null, 2));
  console.log(`\n📋 Found ${newCount} new cases (${existing.cases.length} total)`);
  console.log(`  ✓ Wrote ${path.relative(process.cwd(), CASES_FILE)}`);
  console.log("\n✅ Done!");
}

/**
 * Justia fallback — scrape their browse page for very recent CIT filings.
 * CourtListener can have 1-2 day lag; Justia is often same-day.
 */
async function fetchJustiaRecent(existing, existingNumbers, onNew) {
  // We can't reliably scrape Justia from Node without a browser,
  // but we can try their docket RSS/listing endpoint
  // This is a best-effort fallback
  const url = "https://dockets.justia.com/browse/circuit-13/court-cit/nosRange-870/sortby-filed";
  console.log(`    Justia endpoint: ${url.substring(0, 80)}...`);
  console.log("    (Justia scraping requires manual update or browser — skipping auto-fetch)");
  // In practice, Justia doesn't offer a clean API.
  // For fully automated daily runs, CourtListener is the primary source.
  // If CourtListener data lags, manual additions can supplement.
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
