import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import { db } from "./firebase";

const ANALYTICS_DOC = "analytics/catalog";

export async function incrementCatalogVisit(): Promise<void> {
  try {
    const ref = doc(db, ANALYTICS_DOC);
    await setDoc(ref, { visits: increment(1) }, { merge: true });
  } catch (err) {
    console.warn("Failed to increment catalog visit:", err);
  }
}

export async function getCatalogVisits(): Promise<number> {
  try {
    const ref = doc(db, ANALYTICS_DOC);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return (snap.data().visits as number) || 0;
    }
    return 0;
  } catch (err) {
    console.warn("Failed to get catalog visits:", err);
    return 0;
  }
}
