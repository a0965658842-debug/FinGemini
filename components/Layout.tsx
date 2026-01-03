
import React from 'react';
import { User, ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  view: ViewType;
  setView: (v: ViewType) => void;
  onLogout: () => void;
  user: User;
  isDemo: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, view, setView, onLogout, user, isDemo }) => {
  const menuItems = [
    { id: 'dashboard' as ViewType, label: '總覽', icon: 'fa-chart-pie' },
    { id: 'ai' as ViewType, label: 'AI 諮詢', icon: 'fa-brain' },
    { id: 'accounts' as ViewType, label: '帳戶', icon: 'fa-building-columns' },
    { id: 'transactions' as ViewType, label: '紀錄', icon: 'fa-list-ul' },
    { id: 'reports' as ViewType, label: '報表', icon: 'fa-chart-line' },
    { id: 'profile' as ViewType, label: '設定', icon: 'fa-user-gear' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 hidden md:flex flex-col bg-white border-r border-slate-200 shadow-sm z-20">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <i className="fas fa-gem text-white text-xl"></i>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            FinGemini
          </span>
        </div>

        <nav className="flex-1 mt-4 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                view === item.id 
                  ? 'bg-indigo-50 text-indigo-600 font-semibold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <i className={`fas ${item.icon} w-5`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => setView('profile')}
            className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-4 hover:border-indigo-200 transition-all text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <i className="fas fa-user text-xs"></i>
              </div>
              <div className="flex-1 truncate">
                <p className="text-sm font-bold text-slate-900 truncate">{user.displayName}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          </button>
          <div className="flex items-center justify-between px-2">
            <div className={`px-2 py-0.5 text-[9px] font-black tracking-widest uppercase rounded-full ${isDemo ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {isDemo ? 'DEMO' : 'PRO'}
            </div>
            <button onClick={onLogout} className="text-[10px] font-bold text-rose-400 hover:text-rose-600 transition-colors uppercase tracking-widest">
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative pb-20 md:pb-0">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-10 z-10 shrink-0">
          <h1 className="text-lg font-bold text-slate-800">
            {menuItems.find(m => m.id === view)?.label || '設定'}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="md:hidden text-indigo-600 font-black text-sm tracking-tighter">FinGemini</div>
            <button 
              onClick={() => setView('profile')}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <i className="fas fa-gear text-sm"></i>
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </section>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 px-2 py-3 flex justify-around items-center z-50">
          {menuItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center space-y-1 px-3 transition-all ${
                view === item.id ? 'text-indigo-600 scale-110' : 'text-slate-400'
              }`}
            >
              <i className={`fas ${item.icon} text-lg`}></i>
              <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
          <button 
            onClick={() => setView('profile')}
            className={`flex flex-col items-center space-y-1 px-3 transition-all ${
                view === 'profile' ? 'text-indigo-600 scale-110' : 'text-slate-400'
              }`}
          >
            <i className="fas fa-user-circle text-lg"></i>
            <span className="text-[9px] font-black uppercase tracking-tighter">帳戶</span>
          </button>
        </nav>
      </main>
    </div>
  );
};

export default Layout;
