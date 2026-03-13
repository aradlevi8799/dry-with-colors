import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebase-admin";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const productId = formData.get("productId") as string | null;
    const index = formData.get("index") as string | null;

    if (!file || !productId || index === null) {
      return NextResponse.json({ error: "משהו השתבש בשליחת התמונה. נסי לרענן את הדף ולהעלות שוב." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `סוג הקובץ "${file.type || "לא ידוע"}" לא נתמך. יש להעלות תמונה מסוג JPEG, PNG, WebP או GIF.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "התמונה גדולה מדי (מעל 10MB). נסי לשמור אותה בגודל קטן יותר לפני ההעלאה." },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() || "jpg";
    const path = `products/${productId}/${index}.${ext}`;
    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(path);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fileRef.save(buffer, {
      metadata: { contentType: file.type },
    });

    await fileRef.makePublic();
    const url = `https://storage.googleapis.com/${bucket.name}/${path}`;

    return NextResponse.json({ url, path });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "שגיאה בשמירת התמונה בשרת. נסי שוב עוד כמה דקות." }, { status: 500 });
  }
}
