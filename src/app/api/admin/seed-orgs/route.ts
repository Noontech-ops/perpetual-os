import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }

  try {
    const sqlPath = join(
      process.cwd(),
      "supabase",
      "migrations",
      "004_more_orgs.sql"
    );
    const sql = readFileSync(sqlPath, "utf-8");

    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        { error: "SQL execution failed", details: body },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "5 organizations seeded" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
