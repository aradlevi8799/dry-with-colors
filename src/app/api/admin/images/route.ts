import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebase-admin";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { paths } = body;

    if (!Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json({ error: "חסרים נתיבי תמונות" }, { status: 400 });
    }

    const bucket = adminStorage.bucket();
    await Promise.all(
      paths.map(async (path: string) => {
        try {
          await bucket.file(path).delete();
        } catch {
          // Ignore if file doesn't exist
        }
      })
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete images error:", err);
    return NextResponse.json({ error: "שגיאה במחיקת תמונות" }, { status: 500 });
  }
}
