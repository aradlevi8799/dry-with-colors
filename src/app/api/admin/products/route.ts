import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const MAX_NAME_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, outOfStock } = body;

    // Validate
    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "שם מוצר נדרש" }, { status: 400 });
    }
    if (name.length > MAX_NAME_LENGTH) {
      return NextResponse.json({ error: "שם מוצר ארוך מדי" }, { status: 400 });
    }
    if (description && typeof description === "string" && description.length > MAX_DESCRIPTION_LENGTH) {
      return NextResponse.json({ error: "תיאור ארוך מדי" }, { status: 400 });
    }
    if (price !== undefined && (typeof price !== "number" || price < 0)) {
      return NextResponse.json({ error: "מחיר לא תקין" }, { status: 400 });
    }

    const docRef = await adminDb.collection("products").add({
      name: name.trim(),
      description: typeof description === "string" ? description.trim() : "",
      price: typeof price === "number" ? price : 0,
      outOfStock: !!outOfStock,
      images: [],
      displayOrder: 0,
      viewCount: 0,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id });
  } catch (err) {
    console.error("Add product error:", err);
    return NextResponse.json({ error: "שגיאה בהוספת מוצר", debug: String(err) }, { status: 500 });
  }
}
