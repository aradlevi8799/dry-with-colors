import { NextRequest, NextResponse } from "next/server";
import { signToken, timingSafeCompare } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
    }

    if (typeof password !== "string" || !timingSafeCompare(password, adminPassword)) {
      return NextResponse.json({ error: "סיסמה שגויה" }, { status: 401 });
    }

    const token = signToken({ ts: Date.now() });

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin_auth");
  return response;
}
