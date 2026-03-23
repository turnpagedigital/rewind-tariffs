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

  // Map from JSON field names (sent by the form) to actual sheet header names
  // Ordered to match the actual sheet columns exactly
  var COL_MAP = [
    { header: "Timestamp",          field: "timestamp" },
    { header: "Action",             field: "action" },
    { header: "Ref Code",           field: "refCode" },
    { header: "Company",            field: "company" },
    { header: "Contact Name",       field: "firstName" },
    { header: "Email",              field: "email" },
    { header: "Phone",              field: "phone" },
    { header: "Industry",           field: "industry" },
    { header: "Annual Import Value",field: "importRange" },
    { header: "Tariff Programs",    field: "tariffPrograms" },
    { header: "Entry Status",       field: "entryStatus" },
    { header: "IOR Number",         field: "ior" },
    { header: "Countries of Origin",field: "countriesOfOrigin" },
    { header: "ACE Access",         field: "hasAceAccess" },
    { header: "Registrant Type",    field: "registrantType" },
    { header: "Est. Duties Paid",   field: "estDuties" },
    { header: "CIT Filed",           field: "citFiled" },
    { header: "CIT Case Number",    field: "citCase" },
    { header: "Date Range",         field: "dateRange" },
    { header: "Notes",              field: "notes" },
    { header: "Onboarding Step",    field: "onboardingStep" },
    { header: "Referrals Sent",     field: "referralsSent" }
  ];

  var HEADERS = COL_MAP.map(function(c) { return c.header; });
  var FIELD_TO_HEADER = {};
  COL_MAP.forEach(function(c) { FIELD_TO_HEADER[c.field] = c.header; });

  // Ensure header row exists
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  if (action === "create") {
    // --- CREATE: append a new row ---
    var row = COL_MAP.map(function(c) {
      if (c.field === "timestamp") return new Date().toISOString();
      if (c.field === "action") return action;
      return data[c.field] || "";
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
    var refColIndex = headers.indexOf("Ref Code");
    if (refColIndex === -1) {
      return ContentService.createTextOutput(JSON.stringify({ error: "Ref Code column not found" }))
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
      var row = COL_MAP.map(function(c) {
        if (c.field === "timestamp") return new Date().toISOString();
        if (c.field === "action") return action;
        return data[c.field] || "";
      });
      sheet.appendRow(row);
    } else {
      // Build reverse map: header name → JSON field name
      var HEADER_TO_FIELD = {};
      for (var key in FIELD_TO_HEADER) { HEADER_TO_FIELD[FIELD_TO_HEADER[key]] = key; }
      // Merge: only overwrite cells where new data is non-empty
      for (var c = 0; c < headers.length; c++) {
        var headerName = headers[c];
        var fieldName = HEADER_TO_FIELD[headerName];
        if (!fieldName) continue;
        if (fieldName === "refCode" || fieldName === "timestamp") continue;
        if (data[fieldName] !== undefined && data[fieldName] !== "") {
          sheet.getRange(targetRow, c + 1).setValue(data[fieldName]);
        }
      }
      // Always update the step tracker
      var stepCol = headers.indexOf("Onboarding Step");
      if (stepCol !== -1 && data.onboardingStep) {
        sheet.getRange(targetRow, stepCol + 1).setValue(data.onboardingStep);
      }
    }

    // Debug: log every update call to a Debug sheet
    var debugSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Debug") || SpreadsheetApp.getActiveSpreadsheet().insertSheet("Debug");
    debugSheet.appendRow([new Date(), "onboardingStep=" + (data.onboardingStep || ""), "email=" + (data.email || "")]);

    // If this is the final submission, send confirmation email
    if (data.onboardingStep === "final" && data.email) {
      try {
        sendConfirmationEmail(data);
        debugSheet.appendRow([new Date(), "sendConfirmationEmail completed OK"]);
      } catch (confirmErr) {
        debugSheet.appendRow([new Date(), "sendConfirmationEmail ERROR: " + confirmErr.message]);
      }
    } else {
      debugSheet.appendRow([new Date(), "SKIPPED: step not final or no email"]);
    }
  }

  // --- REFERRAL INVITE: send invitation emails to referred addresses ---
  if (action === "referral_invite") {
    var debugSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Debug") || SpreadsheetApp.getActiveSpreadsheet().insertSheet("Debug");
    debugSheet.appendRow([new Date(), "referral_invite", "emails=" + JSON.stringify(data.emails || [])]);

    // Log referred emails in the referrer's row
    var referredEmails = (data.emails || []).join(", ");
    if (refCode && referredEmails) {
      var dataRange = sheet.getDataRange();
      var values = dataRange.getValues();
      var headers = values[0];
      var refColIndex = headers.indexOf("Ref Code");
      var referralsColIndex = headers.indexOf("Referrals Sent");
      if (refColIndex !== -1 && referralsColIndex !== -1) {
        for (var i = values.length - 1; i >= 1; i--) {
          if (values[i][refColIndex] === refCode) {
            var existing = values[i][referralsColIndex] || "";
            var updated = existing ? existing + ", " + referredEmails : referredEmails;
            sheet.getRange(i + 1, referralsColIndex + 1).setValue(updated);
            break;
          }
        }
      }
    }

    try {
      sendReferralInvites(data);
      debugSheet.appendRow([new Date(), "sendReferralInvites completed OK"]);
    } catch (refErr) {
      debugSheet.appendRow([new Date(), "sendReferralInvites ERROR: " + refErr.message]);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "ok", action: "referral_invite" }))
      .setMimeType(ContentService.MimeType.JSON);
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
    company: data.company || null,
    phone: data.phone || null,
    industry: data.industry || null,
    import_range: data.importRange || null,
  };

  var upsertResponse = UrlFetchApp.fetch(supabaseUrl + "/rest/v1/email_leads?on_conflict=email", {
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

/**
 * Send a one-off confirmation email when the user completes their final submission.
 * Queues the "Submission Confirmation" template in email_send_queue for immediate delivery.
 */
function sendConfirmationEmail(data) {
  var props = PropertiesService.getScriptProperties();
  var supabaseUrl = props.getProperty("SUPABASE_URL");
  var supabaseKey = props.getProperty("SUPABASE_SERVICE_KEY");

  if (!supabaseUrl || !supabaseKey) {
    Logger.log("Supabase not configured — skipping confirmation email");
    return;
  }

  var email = (data.email || "").trim().toLowerCase();
  if (!email) return;

  // Look up the lead ID
  var leadResp = UrlFetchApp.fetch(
    supabaseUrl + "/rest/v1/email_leads?email=eq." + encodeURIComponent(email) + "&select=id",
    {
      method: "get",
      headers: {
        "apikey": supabaseKey,
        "Authorization": "Bearer " + supabaseKey,
      },
      muteHttpExceptions: true,
    }
  );

  if (leadResp.getResponseCode() >= 400) {
    Logger.log("Lead lookup failed: " + leadResp.getContentText());
    return;
  }

  var leads = JSON.parse(leadResp.getContentText());
  if (!leads || leads.length === 0) {
    Logger.log("Lead not found for confirmation email: " + email);
    return;
  }
  var leadId = leads[0].id;

  // Look up the "Submission Confirmation" template ID
  var tmplResp = UrlFetchApp.fetch(
    supabaseUrl + "/rest/v1/email_templates?name=eq.Submission%20Confirmation&select=id",
    {
      method: "get",
      headers: {
        "apikey": supabaseKey,
        "Authorization": "Bearer " + supabaseKey,
      },
      muteHttpExceptions: true,
    }
  );

  if (tmplResp.getResponseCode() >= 400) {
    Logger.log("Template lookup failed: " + tmplResp.getContentText());
    return;
  }

  var templates = JSON.parse(tmplResp.getContentText());
  if (!templates || templates.length === 0) {
    Logger.log("Submission Confirmation template not found — run seed-email-templates.sql");
    return;
  }
  var templateId = templates[0].id;

  // Queue the email for immediate send
  var queueResp = UrlFetchApp.fetch(supabaseUrl + "/rest/v1/email_send_queue", {
    method: "post",
    headers: {
      "apikey": supabaseKey,
      "Authorization": "Bearer " + supabaseKey,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    },
    payload: JSON.stringify({
      lead_id: leadId,
      template_id: templateId,
      scheduled_for: new Date().toISOString(),
      status: "pending",
    }),
    muteHttpExceptions: true,
  });

  var queueCode = queueResp.getResponseCode();
  if (queueCode >= 400) {
    Logger.log("Queue insert failed (" + queueCode + "): " + queueResp.getContentText());
  } else {
    Logger.log("Confirmation email queued for: " + email);
    // Trigger the send-emails edge function immediately so it doesn't wait for the next cron run
    try {
      var sendResp = UrlFetchApp.fetch(supabaseUrl + "/functions/v1/send-emails", {
        method: "post",
        headers: {
          "Authorization": "Bearer " + supabaseKey,
          "Content-Type": "application/json",
        },
        payload: "{}",
        muteHttpExceptions: true,
      });
      Logger.log("send-emails invoked (" + sendResp.getResponseCode() + "): " + sendResp.getContentText().substring(0, 200));
    } catch (triggerErr) {
      Logger.log("send-emails trigger error: " + triggerErr.message);
    }
  }
}

/**
 * Send referral invitation emails to a list of addresses.
 * Uses the "Referral Invitation" email template from Supabase.
 * Each recipient gets their own queue entry so the edge function sends them individually.
 */
function sendReferralInvites(data) {
  var props = PropertiesService.getScriptProperties();
  var supabaseUrl = props.getProperty("SUPABASE_URL");
  var supabaseKey = props.getProperty("SUPABASE_SERVICE_KEY");

  if (!supabaseUrl || !supabaseKey) {
    Logger.log("Supabase not configured — skipping referral invites");
    return;
  }

  var emails = data.emails || [];
  if (!emails.length) return;

  var referrerName = data.referrerName || "";
  var referrerEmail = data.referrerEmail || "";
  var refCode = data.refCode || "";

  // Look up the "Referral Invitation" template
  var tmplResp = UrlFetchApp.fetch(
    supabaseUrl + "/rest/v1/email_templates?name=eq.Referral%20Invitation&select=id",
    {
      method: "get",
      headers: {
        "apikey": supabaseKey,
        "Authorization": "Bearer " + supabaseKey,
      },
      muteHttpExceptions: true,
    }
  );

  if (tmplResp.getResponseCode() >= 400) {
    Logger.log("Referral template lookup failed: " + tmplResp.getContentText());
    return;
  }

  var templates = JSON.parse(tmplResp.getContentText());
  if (!templates || templates.length === 0) {
    Logger.log("Referral Invitation template not found — run insert-referral-invitation.sql");
    return;
  }
  var templateId = templates[0].id;

  // For each email: upsert into email_leads (so we have a lead_id), then queue the email
  for (var i = 0; i < emails.length; i++) {
    var recipientEmail = emails[i].trim().toLowerCase();
    if (!recipientEmail || recipientEmail.indexOf("@") === -1) continue;

    // Upsert lead (minimal — just email; don't set ref_code since that's UNIQUE per lead)
    // Use on_conflict=email to handle existing leads gracefully
    var upsertResp = UrlFetchApp.fetch(supabaseUrl + "/rest/v1/email_leads?on_conflict=email", {
      method: "post",
      headers: {
        "apikey": supabaseKey,
        "Authorization": "Bearer " + supabaseKey,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=representation",
      },
      payload: JSON.stringify({
        email: recipientEmail,
      }),
      muteHttpExceptions: true,
    });

    if (upsertResp.getResponseCode() >= 400) {
      Logger.log("Referral upsert failed for " + recipientEmail + ": " + upsertResp.getContentText());
      continue;
    }

    // Get the lead ID from the response
    var upsertData = JSON.parse(upsertResp.getContentText());
    var leadId = upsertData && upsertData.length ? upsertData[0].id : null;

    if (!leadId) {
      // Fallback: look up by email
      var lookupResp = UrlFetchApp.fetch(
        supabaseUrl + "/rest/v1/email_leads?email=eq." + encodeURIComponent(recipientEmail) + "&select=id",
        {
          method: "get",
          headers: {
            "apikey": supabaseKey,
            "Authorization": "Bearer " + supabaseKey,
          },
          muteHttpExceptions: true,
        }
      );
      var lookupData = JSON.parse(lookupResp.getContentText());
      leadId = lookupData && lookupData.length ? lookupData[0].id : null;
    }

    if (!leadId) {
      Logger.log("Could not get lead_id for " + recipientEmail);
      continue;
    }

    // Queue the referral email
    var queueResp = UrlFetchApp.fetch(supabaseUrl + "/rest/v1/email_send_queue", {
      method: "post",
      headers: {
        "apikey": supabaseKey,
        "Authorization": "Bearer " + supabaseKey,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      payload: JSON.stringify({
        lead_id: leadId,
        template_id: templateId,
        scheduled_for: new Date().toISOString(),
        status: "pending",
      }),
      muteHttpExceptions: true,
    });

    if (queueResp.getResponseCode() >= 400) {
      Logger.log("Referral queue failed for " + recipientEmail + ": " + queueResp.getContentText());
    } else {
      Logger.log("Referral invite queued for: " + recipientEmail);
    }
  }

  // Trigger the send-emails edge function to send immediately
  try {
    UrlFetchApp.fetch(supabaseUrl + "/functions/v1/send-emails", {
      method: "post",
      headers: {
        "Authorization": "Bearer " + supabaseKey,
        "Content-Type": "application/json",
      },
      payload: "{}",
      muteHttpExceptions: true,
    });
    Logger.log("send-emails triggered for referral batch");
  } catch (trigErr) {
    Logger.log("send-emails trigger error: " + trigErr.message);
  }
}
