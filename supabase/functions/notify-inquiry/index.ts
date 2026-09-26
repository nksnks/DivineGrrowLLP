type InquiryRecord = {
  id?: string;
  created_at?: string;
  inquiry_type?: "contact" | "quote";
  name?: string;
  company?: string | null;
  country?: string | null;
  business_type?: string | null;
  email?: string;
  phone?: string | null;
  product?: string | null;
  quantity?: string | null;
  message?: string | null;
};

type InsertPayload = {
  type?: string;
  table?: string;
  schema?: string;
  record?: InquiryRecord | null;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-divinegrow-webhook-secret",
  "Content-Type": "application/json",
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

function required(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing Supabase Function secret: ${name}`);
  return value;
}

function escapeHtml(value: unknown) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function encodeMime(value: string) {
  return base64Url(new TextEncoder().encode(value));
}

async function getGmailAccessToken() {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: required("GMAIL_CLIENT_ID"),
      client_secret: required("GMAIL_CLIENT_SECRET"),
      refresh_token: required("GMAIL_REFRESH_TOKEN"),
      grant_type: "refresh_token",
    }),
  });
  const body = await response.json();
  if (!response.ok || !body.access_token) {
    throw new Error(`Gmail OAuth token request failed: ${body.error_description ?? body.error ?? response.status}`);
  }
  return body.access_token as string;
}

function formatLabel(value: unknown) {
  return escapeHtml(value || "—");
}

function headerSafe(value: unknown) {
  return String(value ?? "").replace(/[\r\n]/g, " ").trim();
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "POST required" }, 405);

  const expectedSecret = required("DIVINEGROW_WEBHOOK_SECRET");
  if (request.headers.get("x-divinegrow-webhook-secret") !== expectedSecret) {
    return json({ error: "Unauthorized webhook" }, 401);
  }

  let payload: InsertPayload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const record = payload.record;
  if (payload.type !== "INSERT" || payload.table !== "inquiries" || payload.schema !== "public" || !record) {
    return json({ ignored: true });
  }

  try {
    const to = required("NOTIFY_TO_EMAIL");
    const from = required("GMAIL_FROM_EMAIL");
    const kind = record.inquiry_type === "contact" ? "Contact message" : "Request a Quote";
    const subject = `[DivineGrow] New ${kind} from ${headerSafe(record.name || "website visitor")}`;
    const text = [
      "A new DivineGrow LLP enquiry was submitted.",
      "",
      `Type: ${kind}`,
      `Name: ${record.name ?? ""}`,
      `Company: ${record.company ?? ""}`,
      `Country: ${record.country ?? ""}`,
      `Business type: ${record.business_type ?? ""}`,
      `Email: ${record.email ?? ""}`,
      `Phone: ${record.phone ?? ""}`,
      `Product: ${record.product ?? ""}`,
      `Quantity: ${record.quantity ?? ""}`,
      "",
      `Message: ${record.message ?? ""}`,
      "",
      `Record ID: ${record.id ?? ""}`,
    ].join("\n");
    const html = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1d3327"><h2>New ${escapeHtml(kind)}</h2><p>A new enquiry was submitted on the DivineGrow LLP website.</p><table cellpadding="8" cellspacing="0" style="border-collapse:collapse"><tbody>${[
      ["Type", kind], ["Name", record.name], ["Company", record.company], ["Country", record.country], ["Business type", record.business_type], ["Email", record.email], ["Phone", record.phone], ["Product", record.product], ["Quantity", record.quantity], ["Message", record.message], ["Record ID", record.id],
    ].map(([label, value]) => `<tr><td style="font-weight:bold;border-bottom:1px solid #ddd">${escapeHtml(label)}</td><td style="border-bottom:1px solid #ddd">${formatLabel(value)}</td></tr>`).join("")}</tbody></table></div>`;
    const mime = [
      `From: DivineGrow LLP <${from}>`,
      `To: ${to}`,
      `Reply-To: ${headerSafe(record.email || from)}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      "Content-Type: multipart/alternative; boundary=divinegrow-boundary",
      "",
      "--divinegrow-boundary",
      "Content-Type: text/plain; charset=UTF-8",
      "",
      text,
      "--divinegrow-boundary",
      "Content-Type: text/html; charset=UTF-8",
      "",
      html,
      "--divinegrow-boundary--",
    ].join("\r\n");

    const accessToken = await getGmailAccessToken();
    const gmailResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ raw: encodeMime(mime) }),
    });
    if (!gmailResponse.ok) {
      const errorBody = await gmailResponse.text();
      throw new Error(`Gmail send failed: ${gmailResponse.status} ${errorBody}`);
    }

    return json({ sent: true, inquiry_id: record.id ?? null });
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : "Notification failed" }, 500);
  }
});
