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
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy("displayOrder", "asc"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) =>
    toProduct(doc.id, doc.data() as Record<string, unknown>)
  );
}

export async function addProduct(
  data: ProductFormData,
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
  data: Partial<ProductFormData>,
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
