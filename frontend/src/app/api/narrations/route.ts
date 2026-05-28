import { NextRequest, NextResponse } from "next/server";

/**
 * Narrations are stored in Vercel KV as a simple map:
 *   key: "narration:{sentenceIndex}"
 *   value: the narration string
 *
 * GET /api/narrations  → returns all stored narrations as { [index]: string }
 * POST /api/narrations → saves { index, narration }
 *
 * Falls back gracefully if KV is not configured (local dev).
 */

async function getKV() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return null;
  }
  const { kv } = await import("@vercel/kv");
  return kv;
}

export async function GET() {
  try {
    const kv = await getKV();
    if (!kv) {
      // KV not configured — return empty (works fine locally)
      return NextResponse.json({ narrations: {} });
    }

    // Get all narration keys
    const keys = await kv.keys("narration:*");
    if (!keys || keys.length === 0) {
      return NextResponse.json({ narrations: {} });
    }

    const narrations: Record<number, string> = {};
    for (const key of keys) {
      const index = parseInt(key.replace("narration:", ""), 10);
      const value = await kv.get<string>(key);
      if (value && !isNaN(index)) {
        narrations[index] = value;
      }
    }

    return NextResponse.json({ narrations });
  } catch (err) {
    console.error("GET /api/narrations error:", err);
    return NextResponse.json({ narrations: {} });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { index, narration } = await req.json();

    if (typeof index !== "number" || !narration) {
      return NextResponse.json({ error: "Missing index or narration" }, { status: 400 });
    }

    const kv = await getKV();
    if (!kv) {
      // KV not configured — just return success (narration shown live anyway)
      return NextResponse.json({ ok: true, stored: false });
    }

    await kv.set(`narration:${index}`, narration);
    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    console.error("POST /api/narrations error:", err);
    return NextResponse.json({ error: "Failed to save narration" }, { status: 500 });
  }
}
