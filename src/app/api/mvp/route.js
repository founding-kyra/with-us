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
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
      ],
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
      requestBody: {
        values,
      },
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error writing to Google Sheets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save application." },
      { status: 500 }
    );
  }
}
