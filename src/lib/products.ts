import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import { Product, ProductFormData, ProductImage } from "@/types/product";

const COLLECTION = "products";

function toProduct(id: string, data: Record<string, unknown>): Product {
  const ts = data.createdAt as Timestamp | null;
  return {
    id,
    name: (data.name as string) || "",
    description: (data.description as string) || "",
    price: (data.price as number) || 0,
    images: (data.images as ProductImage[]) || [],
    displayOrder: (data.displayOrder as number) || 0,
    createdAt: ts ? ts.toDate() : new Date(),
    viewCount: (data.viewCount as number) || 0,
    outOfStock: !!data.outOfStock,
    isNew: !!data.isNew,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy("displayOrder", "asc"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) =>
      toProduct(doc.id, doc.data() as Record<string, unknown>)
    );
  } catch (err) {
    // Fallback: if composite index doesn't exist yet, query without ordering
    console.warn("Composite index query failed, using fallback:", err);
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map((doc) =>
      toProduct(doc.id, doc.data() as Record<string, unknown>)
    );
  }
}

export async function addProduct(
  data: ProductFormData & { outOfStock?: boolean },
  images: ProductImage[]
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    images,
    displayOrder: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(
  id: string,
  data: Partial<ProductFormData> & { outOfStock?: boolean },
  images?: ProductImage[]
): Promise<void> {
  const updateData: Record<string, unknown> = { ...data };
  if (images !== undefined) {
    updateData.images = images;
  }
  await updateDoc(doc(db, COLLECTION, id), updateData);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function toggleOutOfStock(
  id: string,
  outOfStock: boolean
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { outOfStock });
}

export async function toggleIsNew(
  id: string,
  isNew: boolean
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { isNew });
}

export async function resetAllViewCounts(): Promise<void> {
  const snapshot = await getDocs(collection(db, COLLECTION));
  await Promise.all(
    snapshot.docs.map((d) => updateDoc(doc(db, COLLECTION, d.id), { viewCount: 0 }))
  );
}

export async function incrementViewCount(productId: string): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTION, productId), {
      viewCount: increment(1),
    });
  } catch (err) {
    console.warn("Failed to increment view count:", err);
  }
}
