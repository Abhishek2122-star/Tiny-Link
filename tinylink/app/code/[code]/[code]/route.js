// app/api/links/route.js
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { isValidUrl, isValidCode, generateCode } from "@/lib/validation";

export async function POST(request) {
  const body = await request.json().catch(() => null);

  const targetUrl = body?.targetUrl;
  let code = body?.code;

  // Validate target URL
  if (!targetUrl || !isValidUrl(targetUrl)) {
    return NextResponse.json(
      { error: "Invalid or missing targetUrl" },
      { status: 400 }
    );
  }

  // Validate custom code if provided
  if (code && !isValidCode(code)) {
    return NextResponse.json(
      { error: "Code must match [A-Za-z0-9]{6,8}" },
      { status: 400 }
    );
  }

  // If no code given, auto-generate
  if (!code) {
    for (let i = 0; i < 5; i++) {
      const c = generateCode(6);
      const existing = await query("SELECT 1 FROM links WHERE code = $1", [c]);
      if (existing.length === 0) {
        code = c;
        break;
      }
    }
    if (!code) {
      return NextResponse.json(
        { error: "Failed to generate unique code" },
        { status: 500 }
      );
    }
  } else {
    // If custom code provided, ensure unique
    const existing = await query("SELECT 1 FROM links WHERE code = $1", [code]);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Code already exists" },
        { status: 409 } // per spec
      );
    }
  }

  const rows = await query(
    `INSERT INTO links (code, target_url)
     VALUES ($1, $2)
     RETURNING code,
               target_url AS "targetUrl",
               total_clicks AS "totalClicks",
               last_clicked_at AS "lastClickedAt",
               created_at AS "createdAt"`,
    [code, targetUrl]
  );

  const link = rows[0];

  return NextResponse.json(link, { status: 201 });
}

// GET /api/links -> list all links
export async function GET() {
  const rows = await query(
    `SELECT code,
            target_url AS "targetUrl",
            total_clicks AS "totalClicks",
            last_clicked_at AS "lastClickedAt",
            created_at AS "createdAt"
     FROM links
     ORDER BY created_at DESC`
  );

  return NextResponse.json(rows);
}
