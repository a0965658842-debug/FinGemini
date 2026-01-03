import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// 從 vite.config.ts 的 define 中取得配置
const firebaseConfig = process.env.FIREBASE_CONFIG as any;

const isValidConfig = (config: any) => {
  return (
    config && 
    config.apiKey && 
    config.apiKey !== "" && 
    !config.apiKey.includes("在此填入")
  );
};

try {
  if (isValidConfig(firebaseConfig)) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase 服務已連線：目前使用正式資料庫。");
  } else {
    console.warn("偵測到未配置的 Firebase，系統自動切換至『離線/展示模式』。");
  }
} catch (error) {
  console.error("Firebase 初始化過程中發生錯誤:", error);
}

export { auth, db };
