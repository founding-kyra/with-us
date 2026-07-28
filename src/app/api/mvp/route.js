import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // Replace escaped newline characters from env vars to get actual newlines
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
        body.first || "",
        body.last || "",
        body.email || "",
        body.phone || "",
        body.city || "",
        body.region || "",
        body.ig || "",
        body.tt || "",
        body.other || "",
        body.reach || "",
        body.niche || "",
        body.idea || "",
        body.pick1 || "",
        body.pick2 || "",
        body.size || "",
        body.ship_name || "",
        body.addr1 || "",
        body.addr2 || "",
        body.ship_city || "",
        body.ship_state || "",
        body.zip || "",
        body.country || "",
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
      valueInputOption: "USER_ENTERED",
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
