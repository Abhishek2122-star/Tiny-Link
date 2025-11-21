// app/[code]/route.js
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request, { params }) {
  const { code } = params;

  const rows = await query(`SELECT target_url FROM links WHERE code = $1`, [
    code,
  ]);

  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const targetUrl = rows[0].target_url;

  // Increment click count & update last_clicked_at
  await query(
    `UPDATE links
     SET total_clicks = total_clicks + 1,
         last_clicked_at = NOW()
     WHERE code = $1`,
    [code]
  );

  return NextResponse.redirect(targetUrl, 302);
}
