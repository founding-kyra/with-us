import { google } from "googleapis";
import { NextResponse } from "next/server";

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 5;
const ipRequests = new Map();

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    // In-memory rate limiting (Note: not reliable in serverless, but better than nothing)
    const now = Date.now();
    const requestData = ipRequests.get(ip) || { count: 0, startTime: now };

    if (now - requestData.startTime > RATE_LIMIT_WINDOW) {
      requestData.count = 1;
      requestData.startTime = now;
    } else {
      requestData.count++;
    }

    ipRequests.set(ip, requestData);

    if (requestData.count > MAX_REQUESTS) {
      return NextResponse.json({ success: false, error: "Too many requests." }, { status: 429 });
    }

    const bodyText = await req.text();
    if (bodyText.length > 5000) {
      return NextResponse.json({ success: false, error: "Payload too large." }, { status: 413 });
    }

    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (e) {
      return NextResponse.json({ success: false, error: "Invalid JSON." }, { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const timestamp = new Date().toISOString();

    const values = [
      [
        timestamp,
        String(body.first || "").slice(0, 100),
        String(body.last || "").slice(0, 100),
        String(body.email || "").slice(0, 100),
        String(body.phone || "").slice(0, 50),
        String(body.city || "").slice(0, 100),
        String(body.region || "").slice(0, 100),
        String(body.ig || "").slice(0, 100),
        String(body.tt || "").slice(0, 100),
        String(body.other || "").slice(0, 100),
        String(body.reach || "").slice(0, 50),
        String(body.niche || "").slice(0, 100),
        String(body.idea || "").slice(0, 1000),
        String(body.pick1 || "").slice(0, 50),
        String(body.pick2 || "").slice(0, 50),
        String(body.size || "").slice(0, 50),
        String(body.ship_name || "").slice(0, 100),
        String(body.addr1 || "").slice(0, 100),
        String(body.addr2 || "").slice(0, 100),
        String(body.ship_city || "").slice(0, 100),
        String(body.ship_state || "").slice(0, 100),
        String(body.zip || "").slice(0, 50),
        String(body.country || "").slice(0, 100),
        body.a1 ? "Yes" : "No",
        body.a2 ? "Yes" : "No",
        body.a3 ? "Yes" : "No",
        body.a4 ? "Yes" : "No",
        body.a5 ? "Yes" : "No",
      ],
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "MVP Applications!A1",
      valueInputOption: "RAW",
      requestBody: { values },
    });

    // ── Resend email notification ──────────────────────────────────────────────
    // Only fires after a confirmed Google Sheets write.
    // Any failure here is caught and logged silently — the user response is unaffected.
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        // Sanitize all user-supplied values before embedding in HTML
        // Prevents XSS and HTML/header injection
        const esc = (str) =>
          String(str || "")
            .slice(0, 1000)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

        const check = (val) => (val ? "&#10003;" : "&#10007;");
        const green = "#166534";
        const red = "#991b1b";

        const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>New MVP Application — With Us</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#111111;padding:28px 36px;">
              <p style="margin:0;color:#ffffff;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-family:monospace;">WITH US &mdash; LOS ANGELES</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">New MVP Application</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 36px;">

              <!-- Applicant -->
              <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#888;font-family:monospace;">Applicant</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#111;border-bottom:1px solid #f0f0f0;width:40%;font-weight:600;">Name</td>
                  <td style="padding:6px 0;font-size:14px;color:#333;border-bottom:1px solid #f0f0f0;">${esc(body.first)} ${esc(body.last)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#111;border-bottom:1px solid #f0f0f0;font-weight:600;">Email</td>
                  <td style="padding:6px 0;font-size:14px;color:#333;border-bottom:1px solid #f0f0f0;">${esc(body.email)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#111;border-bottom:1px solid #f0f0f0;font-weight:600;">Phone</td>
                  <td style="padding:6px 0;font-size:14px;color:#333;border-bottom:1px solid #f0f0f0;">${esc(body.phone)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#111;font-weight:600;">Location</td>
                  <td style="padding:6px 0;font-size:14px;color:#333;">${esc(body.city)}, ${esc(body.region)}</td>
                </tr>
              </table>

              <!-- Social -->
              <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#888;font-family:monospace;">Social Presence</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#111;border-bottom:1px solid #f0f0f0;width:40%;font-weight:600;">Instagram</td>
                  <td style="padding:6px 0;font-size:14px;color:#333;border-bottom:1px solid #f0f0f0;">${esc(body.ig) || "&mdash;"}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#111;border-bottom:1px solid #f0f0f0;font-weight:600;">TikTok</td>
                  <td style="padding:6px 0;font-size:14px;color:#333;border-bottom:1px solid #f0f0f0;">${esc(body.tt) || "&mdash;"}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#111;border-bottom:1px solid #f0f0f0;font-weight:600;">Other</td>
                  <td style="padding:6px 0;font-size:14px;color:#333;border-bottom:1px solid #f0f0f0;">${esc(body.other) || "&mdash;"}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#111;border-bottom:1px solid #f0f0f0;font-weight:600;">Combined Following</td>
                  <td style="padding:6px 0;font-size:14px;color:#333;border-bottom:1px solid #f0f0f0;">${esc(body.reach)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#111;border-bottom:1px solid #f0f0f0;font-weight:600;">Content / Niche</td>
                  <td style="padding:6px 0;font-size:14px;color:#333;border-bottom:1px solid #f0f0f0;">${esc(body.niche)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#111;font-weight:600;">Creative Idea</td>
                  <td style="padding:6px 0;font-size:14px;color:#333;">${esc(body.idea)}</td>
                </tr>
              </table>

              <!-- Kit & Shipping -->
              <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#888;font-family:monospace;">Kit &amp; Shipping</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#111;border-bottom:1px solid #f0f0f0;width:40%;font-weight:600;">Bottom Size</td>
                  <td style="padding:6px 0;font-size:14px;color:#333;border-bottom:1px solid #f0f0f0;">${esc(body.pick1)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#111;border-bottom:1px solid #f0f0f0;font-weight:600;">Top Size</td>
                  <td style="padding:6px 0;font-size:14px;color:#333;border-bottom:1px solid #f0f0f0;">${esc(body.pick2)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#111;border-bottom:1px solid #f0f0f0;font-weight:600;">Ship To</td>
                  <td style="padding:6px 0;font-size:14px;color:#333;border-bottom:1px solid #f0f0f0;">${esc(body.ship_name)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#111;font-weight:600;">Address</td>
                  <td style="padding:6px 0;font-size:14px;color:#333;line-height:1.6;">
                    ${esc(body.addr1)}${body.addr2 ? `, ${esc(body.addr2)}` : ""}<br/>
                    ${esc(body.ship_city)}, ${esc(body.ship_state)} ${esc(body.zip)}<br/>
                    ${esc(body.country)}
                  </td>
                </tr>
              </table>

              <!-- Agreements -->
              <p style="margin:0 0 8px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#888;font-family:monospace;">Agreements</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                <tr><td style="padding:5px 0;font-size:13px;color:${body.a1 ? green : red};">${check(body.a1)} Post kit at least 3&times; in first 30 days</td></tr>
                <tr><td style="padding:5px 0;font-size:13px;color:${body.a2 ? green : red};">${check(body.a2)} Tag @withus_la in every post and story</td></tr>
                <tr><td style="padding:5px 0;font-size:13px;color:${body.a3 ? green : red};">${check(body.a3)} Content reuse rights granted</td></tr>
                <tr><td style="padding:5px 0;font-size:13px;color:${body.a4 ? green : red};">${check(body.a4)} One free fit per person &mdash; not for resale</td></tr>
                <tr><td style="padding:5px 0;font-size:13px;color:#555;">${body.a5 ? "&#9679;" : "&#9675;"} Marketing opt-in (optional)</td></tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f9f9;padding:20px 36px;border-top:1px solid #e5e5e5;">
              <p style="margin:0;font-size:11px;color:#999;font-family:monospace;">Submitted: ${timestamp} &nbsp;&middot;&nbsp; withusla.com</p>
              <p style="margin:6px 0 0;font-size:11px;color:#bbb;font-family:monospace;">Automated notification. Application saved in Google Sheets.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // API key stays server-side — never returned to the client
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "With Us Notifications <notifications@withusla.com>",
            // Recipient is hardcoded — not derived from client input
            to: ["hello@withusla.com"],
            subject: "New Affiliate Collaboration Request",
            html: htmlBody,
          }),
        });

        if (!emailRes.ok) {
          // Log HTTP status only — no key or user data exposed
          console.error("[Resend] Email notification failed. Status:", emailRes.status);
        }
      }
    } catch (emailErr) {
      // Catch-all: email errors must never propagate to the user
      console.error(
        "[Resend] Unexpected error sending email notification:",
        emailErr?.message ?? "unknown error"
      );
    }
    // ── End Resend block ───────────────────────────────────────────────────────

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error writing to Google Sheets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save application." },
      { status: 500 }
    );
  }
}
