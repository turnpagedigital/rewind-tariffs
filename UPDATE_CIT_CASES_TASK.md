# CIT IEEPA Case Tracker — Scheduled Task Setup

## To set up, tell Claude in a new Cowork session:

> Create a scheduled task called "update-cit-cases" that runs weekdays at 9am ET with the following prompt:

Then paste the prompt below.

---

## Prompt

```
You are updating the CIT (Court of International Trade) IEEPA tariff case tracker for the Rewind Tariffs website.

## Objective
Fetch newly filed IEEPA tariff refund cases from PACER, merge them into the existing JSON tracker, and deploy the updated site.

## File Location
- JSON tracker is at public/cit-cases.json in the rewind-tariffs workspace folder
- If no workspace folder is mounted, use the request_cowork_directory tool to request access

## Steps

### Step 1: Read current data
Read public/cit-cases.json to find the lastUpdated date and the highest existing case number.

### Step 2: Notify user to log into PACER
Tell the user: "To update the case tracker, I need you to log into PACER in Chrome at https://ecf.cit.uscourts.gov/. Let me know when you're logged in."
Wait for confirmation. Do NOT attempt to log in on their behalf.

### Step 3: Navigate to Civil Cases Report
Once user confirms, use Chrome browser tools to:
1. Navigate to https://ecf.cit.uscourts.gov/cgi-bin/CaseFiled-Rpt.pl
2. Set "Filed Date" from to day after lastUpdated (format M/D/YYYY, no leading zeros)
3. Set "Filed Date" to to today
4. Set "Nature of Suit" to "891 - 28 USC § 1581(i) Residual Jurisdiction"
5. Select "Data Only" format
6. Submit (use JS: document.querySelector('form').submit() if button is greyed out)

### Step 4: Parse cases
Run JavaScript to extract case data. Use innerHTML parsing (not innerText) because PACER uses non-breaking spaces in labels like "Case flags:".

Parse code:
const rows = document.querySelectorAll('table tr');
const cases = [];
rows.forEach(row => {
  const cells = row.querySelectorAll('td');
  if (cells.length < 4) return;
  const link = cells[0].querySelector('a');
  if (!link) return;
  const caseNum = link.textContent.trim().replace('-N/A','');
  if (!caseNum.match(/^\d:\d\d-cv-/)) return;
  const titleLines = cells[0].innerText.trim().split('\n').map(s=>s.trim()).filter(Boolean);
  const title = titleLines.slice(1).join(' ').trim() || titleLines[0];
  const dateMatch = cells[1].innerText.match(/(\d\d)\/(\d\d)\/(\d{4})/);
  const filedDate = dateMatch ? dateMatch[3]+'-'+dateMatch[1]+'-'+dateMatch[2] : '';
  const html = cells[3].innerHTML;
  const getField = (label) => {
    const re = new RegExp('<i>[^<]*' + label + '[^<]*</i>\\s*([^<]+)', 'i');
    const m = html.match(re);
    return m ? m[1].trim() : '';
  };
  const category = (getField('Category').replace(/\s*28USC.*/, '').trim()) || 'Tariffs, Duties, Fees, Other Taxes';
  const presider = getField('Presider') || 'Unassigned';
  const product = getField('Product.Description');
  const flags = getField('Case.flags') || getField('flags') || 'IEEPA';
  const status = flags.includes('STAYED') ? 'Stayed' : 'Filed';
  cases.push({caseNum, title, filedDate, category, presider, product, flags, status});
});
window._parsedCases = cases;

Then create compact format:
window._compact = window._parsedCases.map(c => {
  const flagCode = c.status === 'Stayed' ? 'S' : 'F';
  return c.caseNum+'|'+c.title+'|'+c.filedDate+'|'+c.product+'|'+(c.category.startsWith('Tariffs')?'T':'R')+'|'+flagCode;
});

### Step 5: Transfer data (batches of 10)
Browser MCP truncates at ~1200 chars. Use window._compact.slice(N, N+10).join('\n') per batch.
Write each batch to /tmp/cases.txt with: cat >> /tmp/cases.txt << 'EOF' ... EOF
Pipeline: write previous batch while fetching next in parallel.

### Step 6: Merge into JSON
Python script to:
1. Parse /tmp/cases.txt (pipe-delimited: caseNum|title|filedDate|product|catCode|statusCode)
2. T → "Tariffs, Duties, Fees, Other Taxes", R → "Residual Jurisdiction"
3. S → status "Stayed" + flags "IEEPA, STAYED", F → status "Filed" + flags "IEEPA"
4. Load existing JSON, deduplicate on caseNumber
5. Sort by filedDate desc, caseNumber desc
6. Update lastUpdated and totalCases
7. Write back

### Step 7: Deploy
Run: cd "/Users/waquoitcapital/Library/CloudStorage/Dropbox/Career/Current Roles/Turnpage/Development/rewind-tariffs" && npm run build && npx wrangler pages deploy "./dist" --project-name=rewind-tariffs
If path fails from VM, tell user to run it manually.

### Step 8: Report
- New cases added, total count, status breakdown, date range, deploy status
```

## Cron Expression
`0 9 * * 1-5` (weekdays at 9:00 AM local time)
