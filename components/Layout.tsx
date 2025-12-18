
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  view: string;
  setView: (v: any) => void;
  onLogout: () => void;
  user: User;
  isDemo: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, view, setView, onLogout, user, isDemo }) => {
  const menuItems = [
    { id: 'dashboard', label: '總覽', icon: 'fa-chart-pie' },
    { id: 'accounts', label: '帳戶', icon: 'fa-building-columns' },
    { id: 'transactions', label: '紀錄', icon: 'fa-list-ul' },
    { id: 'reports', label: '報表', icon: 'fa-chart-line' },
    { id: 'tips', label: '扭蛋機', icon: 'fa-circle-dot' },
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
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                <i className="fas fa-user text-slate-400"></i>
              </div>
              <div className="flex-1 truncate">
                <p className="text-sm font-medium text-slate-900 truncate">{user.displayName}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full text-xs font-semibold py-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            >
              登出
            </button>
          </div>
          <div className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full inline-block ${isDemo ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
            {isDemo ? 'DEMO MODE' : 'PRO MODE'}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative pb-20 md:pb-0">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-10 z-10 shrink-0">
          <h1 className="text-lg font-semibold text-slate-800">
            {menuItems.find(m => m.id === view)?.label}
          </h1>
          <div className="flex items-center space-x-4">
             <div className="md:hidden text-indigo-600 font-bold text-sm">FinGemini</div>
            <button className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400">
              <i className="fas fa-bell"></i>
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </section>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-3 flex justify-around items-center z-50">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center space-y-1 px-3 transition-all ${
                view === item.id ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              <i className={`fas ${item.icon} text-lg`}></i>
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
          <button onClick={onLogout} className="flex flex-col items-center space-y-1 px-3 text-rose-400">
            <i className="fas fa-sign-out-alt text-lg"></i>
            <span className="text-[10px] font-bold uppercase tracking-tighter">登出</span>
          </button>
        </nav>
      </main>
    </div>
  );
};

export default Layout;
