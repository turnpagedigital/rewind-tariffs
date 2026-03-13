/**
 * Google Apps Script — Rewind Tariffs Sheet Webhook
 *
 * Paste this into your Google Apps Script project (Extensions > Apps Script)
 * and re-deploy as a web app.
 *
 * Handles two actions:
 *   "create" — Appends a new row (fired on initial form submit)
 *   "update" — Finds the row by refCode and merges new data (fired after each onboarding step)
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads")
           || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Invalid JSON" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var action = data.action || "create";
  var refCode = data.refCode || "";

  // Column mapping — add/reorder as needed
  var COLS = [
    "refCode", "timestamp", "onboardingStep", "company", "firstName", "lastName",
    "email", "phone", "industry", "importRange", "tariffPrograms", "entryStatus",
    "ior", "entryCount", "countriesOfOrigin", "hasAceAccess", "registrantType",
    "estDuties", "bondImpact", "bondAmount", "collateral", "surety",
    "dateRange", "notes"
  ];

  // Ensure header row exists
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLS);
  }

  if (action === "create") {
    // --- CREATE: append a new row ---
    var row = COLS.map(function(col) {
      if (col === "timestamp") return new Date().toISOString();
      return data[col] || "";
    });
    sheet.appendRow(row);

    // --- Sync lead to Supabase email system ---
    try {
      syncLeadToSupabase(data);
    } catch (syncErr) {
      Logger.log("Supabase sync error: " + syncErr.message);
      // Don't fail the main webhook — Sheet row is already saved
    }

  } else if (action === "update" && refCode) {
    // --- UPDATE: find existing row by refCode and merge non-empty fields ---
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    var headers = values[0];
    var refColIndex = headers.indexOf("refCode");
    if (refColIndex === -1) {
      return ContentService.createTextOutput(JSON.stringify({ error: "refCode column not found" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var targetRow = -1;
    for (var i = values.length - 1; i >= 1; i--) {
      if (values[i][refColIndex] === refCode) {
        targetRow = i + 1; // 1-indexed
        break;
      }
    }

    if (targetRow === -1) {
      // If row not found (edge case), create it instead
      var row = COLS.map(function(col) {
        if (col === "timestamp") return new Date().toISOString();
        return data[col] || "";
      });
      sheet.appendRow(row);
    } else {
      // Merge: only overwrite cells where new data is non-empty
      for (var c = 0; c < headers.length; c++) {
        var colName = headers[c];
        if (colName === "refCode" || colName === "timestamp") continue; // don't overwrite these
        if (data[colName] !== undefined && data[colName] !== "") {
          sheet.getRange(targetRow, c + 1).setValue(data[colName]);
        }
      }
      // Always update the step tracker
      var stepCol = headers.indexOf("onboardingStep");
      if (stepCol !== -1 && data.onboardingStep) {
        sheet.getRange(targetRow, stepCol + 1).setValue(data.onboardingStep);
      }
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ status: "ok", refCode: refCode }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Sync a new lead to Supabase email_leads table and enroll in drip sequence.
 *
 * Script Properties required (set in Project Settings > Script Properties):
 *   SUPABASE_URL           — e.g. https://xyz.supabase.co
 *   SUPABASE_SERVICE_KEY   — service_role key (not the anon key)
 */
function syncLeadToSupabase(data) {
  var props = PropertiesService.getScriptProperties();
  var supabaseUrl = props.getProperty("SUPABASE_URL");
  var supabaseKey = props.getProperty("SUPABASE_SERVICE_KEY");

  if (!supabaseUrl || !supabaseKey) {
    Logger.log("Supabase not configured — skipping email sync");
    return;
  }

  var email = (data.email || "").trim().toLowerCase();
  if (!email) return;

  // 1. Upsert the lead into email_leads
  var lead = {
    email: email,
    ref_code: data.refCode || null,
    first_name: data.firstName || null,
    last_name: data.lastName || null,
    company: data.company || null,
    phone: data.phone || null,
    industry: data.industry || null,
    import_range: data.importRange || null,
  };

  var upsertResponse = UrlFetchApp.fetch(supabaseUrl + "/rest/v1/email_leads", {
    method: "post",
    headers: {
      "apikey": supabaseKey,
      "Authorization": "Bearer " + supabaseKey,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates",
    },
    payload: JSON.stringify(lead),
    muteHttpExceptions: true,
  });

  var upsertCode = upsertResponse.getResponseCode();
  if (upsertCode >= 400) {
    Logger.log("Supabase upsert failed (" + upsertCode + "): " + upsertResponse.getContentText());
    return;
  }

  // 2. Enroll in the default "Welcome" drip sequence via RPC
  var rpcResponse = UrlFetchApp.fetch(supabaseUrl + "/rest/v1/rpc/enroll_lead_in_sequence", {
    method: "post",
    headers: {
      "apikey": supabaseKey,
      "Authorization": "Bearer " + supabaseKey,
      "Content-Type": "application/json",
    },
    payload: JSON.stringify({
      p_lead_email: email,
      p_sequence_name: "Welcome",
    }),
    muteHttpExceptions: true,
  });

  var rpcCode = rpcResponse.getResponseCode();
  if (rpcCode >= 400) {
    Logger.log("Supabase enroll RPC failed (" + rpcCode + "): " + rpcResponse.getContentText());
  } else {
    Logger.log("Lead enrolled: " + email + " → " + rpcResponse.getContentText());
  }
}
