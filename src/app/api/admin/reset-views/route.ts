import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST() {
  try {
    const snapshot = await adminDb.collection("products").get();
    const batch = adminDb.batch();
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { viewCount: 0 });
    });
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reset views error:", err);
    return NextResponse.json({ error: "שגיאה באיפוס צפיות" }, { status: 500 });
  }
}
