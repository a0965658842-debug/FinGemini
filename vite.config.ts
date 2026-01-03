import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 確保使用相對路徑，防止 GitHub Pages 部署後路徑錯誤導致白畫面
  base: './',
  define: {
    // 透過 define 注入 API KEY，Build 階段會從 GitHub Action 的 env.API_KEY 取得
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    // Firebase 配置直接寫在代碼中，方便遷移帳號後快速修改
    'process.env.FIREBASE_CONFIG': JSON.stringify({
      apiKey: "在此填入您的_FIREBASE_API_KEY",
      authDomain: "您的專案ID.firebaseapp.com",
      projectId: "您的專案ID",
      storageBucket: "您的專案ID.appspot.com",
      messagingSenderId: "您的發送者ID",
      appId: "您的應用程式ID"
    })
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    rollupOptions: {
      output: {
        // 切分套件以優化載入速度
        manualChunks: {
          'vendor-core': ['react', 'react-dom'],
          'vendor-utils': ['recharts', 'firebase/app', 'firebase/auth', 'firebase/firestore', '@google/genai'],
        },
      },
    },
  },
});
