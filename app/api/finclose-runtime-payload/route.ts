import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_REFS = new Set([
  "finclose-v020-runtime",
  "e0b3b69423d145ba821486d3693545aea1c5c3be",
]);

export async function GET(request: NextRequest) {
  const requestedRef = request.nextUrl.searchParams.get("ref") || "finclose-v020-runtime";
  if (!ALLOWED_REFS.has(requestedRef)) {
    return Response.json({ error: "unsupported ref" }, { status: 400 });
  }

  const base = `https://raw.githubusercontent.com/unikmo/Unikmo/${requestedRef}/finclose_runtime/v0.20.0`;
  const parts: string[] = [];

  for (let i = 0; i < 13; i += 1) {
    const name = `payload_${String(i).padStart(2, "0")}.txt`;
    const response = await fetch(`${base}/${name}`, { cache: "no-store" });
    if (!response.ok) {
      return Response.json(
        { error: "payload fetch failed", file: name, status: response.status },
        { status: 502 },
      );
    }
    parts.push((await response.text()).trim());
  }

  return new Response(parts.join(""), {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=us-ascii",
      "cache-control": "no-store",
      "x-finclose-payload-ref": requestedRef,
      "x-finclose-payload-parts": "13",
    },
  });
}
