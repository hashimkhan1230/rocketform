import { getStorage } from "firebase/storage";
import { app } from "./firebase";

// ✅ Reuse SAME Firebase app (NO duplicate)
export const storage = getStorage(app);
