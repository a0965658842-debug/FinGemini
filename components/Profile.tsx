
import React, { useState } from 'react';
import { User } from '../types';
import { auth } from '../firebase';

interface ProfileProps {
  user: User;
  isDemo: boolean;
  onUpdateUser: (u: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, isDemo, onUpdateUser }) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleUpdate = async () => {
    if (isDemo) {
      setMessage({ text: '展示模式下無法修改正式資料，但已模擬更新。', type: 'success' });
      onUpdateUser({ ...user, displayName });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      // Using compat instance updateProfile method to resolve missing export error
      if (auth && auth.currentUser) {
        await auth.currentUser.updateProfile({ displayName });
        onUpdateUser({ ...user, displayName });
        setMessage({ text: '帳戶資料更新成功！', type: 'success' });
      }
    } catch (err: any) {
      setMessage({ text: '更新失敗：' + err.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-violet-600 relative">
           <div className="absolute -bottom-12 left-10">
              <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-xl">
                 <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 text-3xl">
                    <i className="fas fa-user"></i>
                 </div>
              </div>
           </div>
        </div>

        <div className="pt-16 px-10 pb-10">
          <div className="mb-10">
            <h2 className="text-2xl font-black text-slate-900">帳戶設定</h2>
            <p className="text-slate-500 text-sm">管理您的個人資訊與系統偏好</p>
          </div>

          {message && (
            <div className={`mb-8 p-4 rounded-2xl flex items-center space-x-3 text-sm font-medium animate-in zoom-in-95 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
              <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
              <span>{message.text}</span>
            </div>
          )}

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">顯示名稱</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                />
              </div>
              <div className="space-y-2 opacity-60">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">電子郵件 (不可修改)</label>
                <input 
                  type="email" 
                  value={user.email}
                  disabled
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-50 bg-slate-50 text-slate-400 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">系統資訊</h4>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">使用者 UID</span>
                <code className="bg-white px-2 py-1 rounded-lg text-xs text-indigo-600 border border-slate-100">{user.uid}</code>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">當前模式</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black text-white ${isDemo ? 'bg-orange-400' : 'bg-emerald-500'}`}>
                  {isDemo ? '展示模式' : '正式模式'}
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={handleUpdate}
                disabled={isSaving}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-2"
              >
                {isSaving && <i className="fas fa-circle-notch fa-spin"></i>}
                <span>儲存修改</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
