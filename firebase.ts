
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Using inferred or any types for internal state variables to avoid issues with missing named type exports in strict build environments
let auth: any = null;
let db: any = null;

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
    // Initialize via compat layer to fix "no exported member" errors
    const app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    console.log("Firebase 服務已連線：目前使用正式資料庫。");
  } else {
    console.warn("偵測到未配置的 Firebase，系統自動切換至『離線/展示模式』。");
  }
} catch (error) {
  console.error("Firebase 初始化過程中發生錯誤:", error);
}

export { auth, db };
