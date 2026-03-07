import { NextRequest, NextResponse } from "next/server";

// Lightweight HMAC verification for Edge runtime (no Node crypto module)
async function verifyTokenEdge(token: string, secret: string): Promise<boolean> {
  try {
    const [encoded, sig] = token.split(".");
    if (!encoded || !sig) return false;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const expectedSig = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(encoded)
    );

    // Convert expected signature to base64url
    const expectedB64 = btoa(String.fromCharCode(...new Uint8Array(expectedSig)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    if (sig !== expectedB64) return false;

    // Check token age (24 hours)
    const data = JSON.parse(atob(encoded.replace(/-/g, "+").replace(/_/g, "/")));
    const age = Date.now() - data.ts;
    if (age < 0 || age > 24 * 60 * 60 * 1000) return false;

    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const token = request.cookies.get("admin_auth")?.value;
  if (!token || !(await verifyTokenEdge(token, secret))) {
    return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
