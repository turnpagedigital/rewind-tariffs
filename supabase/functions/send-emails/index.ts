/**
 * Supabase Edge Function: send-emails
 *
 * Processes the email_send_queue table, sending pending emails via Resend API.
 * Runs on a schedule (hourly via pg_cron or external trigger).
 *
 * Environment variables (set in Supabase dashboard):
 *   RESEND_API_KEY     — Resend API key
 *   SUPABASE_URL       — auto-provided
 *   SUPABASE_SERVICE_ROLE_KEY — auto-provided
 *   FROM_EMAIL         — sender address (default: noreply@rewindtariffs.com)
 *   BATCH_SIZE         — max emails per invocation (default: 50)
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QueueItem {
  id: string;
  lead_id: string;
  template_id: string;
  scheduled_for: string;
  email_leads: {
    email: string;
    first_name: string | null;
    last_name: string | null;
    company: string | null;
    ref_code: string | null;
    unsubscribed_at: string | null;
  };
  email_templates: {
    subject: string;
    html_body: string;
    text_body: string;
  };
}

function renderTemplate(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, value || "");
  }
  return result;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("FROM_EMAIL") || "Rewind Tariffs <noreply@rewindtariffs.com>";
    const batchSize = parseInt(Deno.env.get("BATCH_SIZE") || "50", 10);

    if (!resendKey) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch pending queue items that are due
    const { data: queueItems, error: fetchError } = await supabase
      .from("email_send_queue")
      .select(`
        id, lead_id, template_id, scheduled_for,
        email_leads(email, first_name, last_name, company, ref_code, unsubscribed_at),
        email_templates(subject, html_body, text_body)
      `)
      .eq("status", "pending")
      .lte("scheduled_for", new Date().toISOString())
      .order("scheduled_for", { ascending: true })
      .limit(batchSize);

    if (fetchError) {
      throw new Error(`Failed to fetch queue: ${fetchError.message}`);
    }

    const items = (queueItems || []) as unknown as QueueItem[];
    let sent = 0;
    let failed = 0;
    let skipped = 0;

    for (const item of items) {
      const lead = item.email_leads;
      const template = item.email_templates;

      // Skip if lead is unsubscribed
      if (lead?.unsubscribed_at) {
        await supabase
          .from("email_send_queue")
          .update({ status: "skipped", error_message: "Lead unsubscribed" })
          .eq("id", item.id);
        skipped++;
        continue;
      }

      if (!lead?.email || !template?.subject) {
        await supabase
          .from("email_send_queue")
          .update({ status: "failed", error_message: "Missing lead email or template" })
          .eq("id", item.id);
        failed++;
        continue;
      }

      // Build template variables
      const unsubscribeLink = `https://rewindtariffs.com/#unsubscribe?token=${btoa(lead.email)}`;
      const vars: Record<string, string> = {
        first_name: lead.first_name || "",
        last_name: lead.last_name || "",
        company: lead.company || "",
        email: lead.email,
        unsubscribe_link: unsubscribeLink,
      };

      const subject = renderTemplate(template.subject, vars);
      const htmlBody = renderTemplate(template.html_body, vars);
      const textBody = renderTemplate(template.text_body, vars);

      // Append unsubscribe footer if not already present
      const footer = `<br><hr style="border:none;border-top:1px solid #e5e5e5;margin:32px 0 16px"><p style="font-size:12px;color:#999;text-align:center"><a href="${unsubscribeLink}" style="color:#999">Unsubscribe</a> from future emails.</p>`;
      const finalHtml = htmlBody.includes("{{unsubscribe_link}}") || htmlBody.includes(unsubscribeLink)
        ? htmlBody
        : htmlBody + footer;

      try {
        // Send via Resend API
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [lead.email],
            subject,
            html: finalHtml,
            text: textBody || undefined,
            headers: {
              "List-Unsubscribe": `<${unsubscribeLink}>`,
            },
          }),
        });

        if (!resendResponse.ok) {
          const errBody = await resendResponse.text();
          throw new Error(`Resend API ${resendResponse.status}: ${errBody.substring(0, 200)}`);
        }

        // Mark as sent
        await supabase
          .from("email_send_queue")
          .update({ status: "sent", sent_at: new Date().toISOString() })
          .eq("id", item.id);
        sent++;
      } catch (sendError: unknown) {
        const errorMessage = sendError instanceof Error ? sendError.message : String(sendError);
        await supabase
          .from("email_send_queue")
          .update({ status: "failed", error_message: errorMessage.substring(0, 500) })
          .eq("id", item.id);
        failed++;
      }

      // Small delay between sends to be nice to Resend
      if (items.indexOf(item) < items.length - 1) {
        await new Promise((r) => setTimeout(r, 200));
      }
    }

    const result = {
      processed: items.length,
      sent,
      failed,
      skipped,
      timestamp: new Date().toISOString(),
    };

    console.log("Send-emails result:", JSON.stringify(result));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("send-emails error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
