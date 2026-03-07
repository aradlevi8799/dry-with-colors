import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/lib/firebase-admin";

const MAX_NAME_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, outOfStock, images } = body;

    const docRef = adminDb.collection("products").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: "מוצר לא נמצא" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ error: "שם מוצר נדרש" }, { status: 400 });
      }
      if (name.length > MAX_NAME_LENGTH) {
        return NextResponse.json({ error: "שם מוצר ארוך מדי" }, { status: 400 });
      }
      updateData.name = name.trim();
    }

    if (description !== undefined) {
      if (typeof description === "string" && description.length > MAX_DESCRIPTION_LENGTH) {
        return NextResponse.json({ error: "תיאור ארוך מדי" }, { status: 400 });
      }
      updateData.description = typeof description === "string" ? description.trim() : "";
    }

    if (price !== undefined) {
      if (typeof price !== "number" || price < 0) {
        return NextResponse.json({ error: "מחיר לא תקין" }, { status: 400 });
      }
      updateData.price = price;
    }

    if (outOfStock !== undefined) {
      updateData.outOfStock = !!outOfStock;
    }

    if (images !== undefined) {
      if (!Array.isArray(images)) {
        return NextResponse.json({ error: "תמונות לא תקינות" }, { status: 400 });
      }
      updateData.images = images;
    }

    await docRef.update(updateData);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update product error:", err);
    return NextResponse.json({ error: "שגיאה בעדכון מוצר" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docRef = adminDb.collection("products").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: "מוצר לא נמצא" }, { status: 404 });
    }

    // Delete associated images from storage
    const data = doc.data();
    const images = (data?.images as Array<{ path: string }>) || [];
    const bucket = adminStorage.bucket();
    await Promise.all(
      images.map(async (img) => {
        try {
          await bucket.file(img.path).delete();
        } catch {
          // Ignore if file doesn't exist
        }
      })
    );

    await docRef.delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete product error:", err);
    return NextResponse.json({ error: "שגיאה במחיקת מוצר" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const docRef = adminDb.collection("products").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: "מוצר לא נמצא" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if ("outOfStock" in body) {
      updateData.outOfStock = !!body.outOfStock;
    }
    if ("isNew" in body) {
      updateData.isNew = !!body.isNew;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "אין שדות לעדכון" }, { status: 400 });
    }

    await docRef.update(updateData);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Patch product error:", err);
    return NextResponse.json({ error: "שגיאה בעדכון מוצר" }, { status: 500 });
  }
}
