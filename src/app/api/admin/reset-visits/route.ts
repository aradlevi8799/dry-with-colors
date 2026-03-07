import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST() {
  try {
    await adminDb.doc("analytics/catalog").set({ visits: 0 }, { merge: true });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reset visits error:", err);
    return NextResponse.json({ error: "שגיאה באיפוס כניסות" }, { status: 500 });
  }
}
