import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    if (!url) {
      return new Response("Missing url", { status: 400 });
    }

    const range = req.headers.get("range");
    const upstream = await fetch(url, {
      headers: range ? { Range: range } : undefined,
      // Keep it simple: we are proxying a public URL
      cache: "no-store",
    });

    // Pass through status (200 or 206 for range requests)
    const status = upstream.status;

    // Copy selected headers and enforce inline PDF rendering
    const headers = new Headers();
    const passthroughHeaderNames = [
      "content-length",
      "content-range",
      "accept-ranges",
      "etag",
      "last-modified",
      "cache-control",
    ];
    for (const name of passthroughHeaderNames) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }

    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Disposition", "inline; filename=resume.pdf");
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Cross-Origin-Resource-Policy", "cross-origin");

    return new Response(upstream.body, { status, headers });
  } catch (error) {
    console.error("PDF proxy error", error);
    return new Response("Proxy error", { status: 500 });
  }
}
