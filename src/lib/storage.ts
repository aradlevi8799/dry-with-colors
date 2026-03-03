import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";
import { ProductImage } from "@/types/product";

export async function uploadProductImage(
  productId: string,
  file: File,
  index: number
): Promise<ProductImage> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `products/${productId}/${index}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { url, path };
}

export async function deleteProductImage(imagePath: string): Promise<void> {
  try {
    const storageRef = ref(storage, imagePath);
    await deleteObject(storageRef);
  } catch (error: unknown) {
    const firebaseError = error as { code?: string };
    if (firebaseError.code === "storage/object-not-found") {
      return;
    }
    throw error;
  }
}

export async function deleteAllProductImages(
  images: ProductImage[]
): Promise<void> {
  await Promise.all(images.map((img) => deleteProductImage(img.path)));
}
