
import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
// Correct modular imports for Auth and Firestore from their respective subpackages.
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

const firebaseConfig = process.env.FIREBASE_CONFIG as any;

try {
  // Initialize Firebase modularly if a valid configuration is provided.
  if (firebaseConfig && firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("在此填入")) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase 啟動成功");
  } else {
    console.warn("未偵測到有效的 Firebase 配置，系統將以離線/展示模式運行。");
  }
} catch (error) {
  console.error("Firebase 初始化出庫:", error);
}

export { auth, db };
