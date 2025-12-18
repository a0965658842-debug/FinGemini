import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 必須使用相對路徑以防止資源加載失敗（白色畫面）
  base: './', 
  define: {
    // Gemini API Key 透過環境變數注入（GitHub Secrets）
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    // Firebase 配置直接寫在程式碼中，方便開發且不具機密性風險（客戶端 Key 本身即公開）
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
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'firebase', 'recharts'],
        },
      },
    },
  },
});