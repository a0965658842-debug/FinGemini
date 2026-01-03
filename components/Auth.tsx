
import React, { useState } from 'react';
import { auth } from '../firebase';
// Fix: Ensure the modular functions are correctly imported from the firebase/auth subpath.
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { User } from '../types';

interface AuthProps {
  onLogin: (u: User, isDemo: boolean) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (useDemo: boolean) => {
    if (useDemo) {
      onLogin({
        uid: 'demo-user',
        email: 'demo@fingemini.com',
        displayName: '體驗帳戶'
      }, true);
      return;
    }

    if (!auth) {
      setError('Firebase 未正確配置，請使用展示模式。');
      return;
    }

    if (!email || !password) {
      setError('請填寫電子郵件與密碼');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        // Using createUserWithEmailAndPassword modular function which takes the auth instance.
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Using updateProfile modular function which takes the user object.
        await updateProfile(userCredential.user, { displayName: email.split('@')[0] });
        onLogin({
          uid: userCredential.user.uid,
          email: userCredential.user.email!,
          displayName: userCredential.user.displayName!
        }, false);
      } else {
        // Using signInWithEmailAndPassword modular function which takes the auth instance.
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onLogin({
          uid: userCredential.user.uid,
          email: userCredential.user.email!,
          displayName: userCredential.user.displayName!
        }, false);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('郵件或密碼錯誤');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('此電子郵件已註冊');
      } else {
        setError('認證失敗：' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="hidden md:flex flex-col justify-center items-center md:w-1/2 bg-indigo-600 p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white"></path>
          </svg>
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-8 mx-auto rotate-3">
            <i className="fas fa-gem text-indigo-600 text-4xl"></i>
          </div>
          <h1 className="text-4xl font-black mb-6 tracking-tight">AI 驅動的財務自由</h1>
          <p className="text-indigo-100 text-lg opacity-90 leading-relaxed">
            FinGemini 使用最新的 Gemini 3 Pro 模型，為您的每筆支出提供專業級的理財分析。
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-24 bg-slate-50">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">{isRegistering ? '建立帳戶' : '歡迎回來'}</h2>
            <p className="text-slate-500 mt-2">請登入以開始您的個人理財分析</p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 text-rose-500 text-sm rounded-xl border border-rose-100 flex items-center">
                <i className="fas fa-exclamation-circle mr-3"></i>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">電子郵件</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  placeholder="name@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">密碼</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              onClick={() => handleAuth(false)}
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading && <i className="fas fa-circle-notch fa-spin"></i>}
              <span>{isRegistering ? '註冊帳戶' : '登入正式系統'}</span>
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-slate-400">或</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            <button 
              onClick={() => handleAuth(true)}
              className="w-full bg-indigo-50 text-indigo-600 py-4 rounded-xl font-bold hover:bg-indigo-100 transition-all border border-indigo-100"
            >
              試用展示模式 (無須帳號)
            </button>

            <div className="text-center">
              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-sm font-semibold text-slate-500 hover:text-indigo-600"
              >
                {isRegistering ? '已有帳戶？點此登入' : '還沒有帳戶？點此註冊'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
