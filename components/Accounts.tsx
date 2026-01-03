
import React, { useState } from 'react';
import { BankAccount } from '../types';

interface AccountsProps {
  accounts: BankAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
}

const Accounts: React.FC<AccountsProps> = ({ accounts, setAccounts }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formAccount, setFormAccount] = useState({ name: '', balance: 0, type: 'Savings', color: 'bg-indigo-600' });

  const resetForm = () => {
    setFormAccount({ name: '', balance: 0, type: 'Savings', color: 'bg-indigo-600' });
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleEdit = (acc: BankAccount, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormAccount({ name: acc.name, balance: acc.balance, type: acc.type, color: acc.color });
    setEditingId(acc.id);
    setIsFormOpen(true);
    // 平滑捲動至頂部編輯區
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveAccount = () => {
    if (!formAccount.name) {
      alert("請填寫帳戶名稱");
      return;
    }

    if (editingId) {
      // 執行更新
      setAccounts(prev => prev.map(a => a.id === editingId ? { ...a, ...formAccount } : a));
    } else {
      // 執行新增
      const newAccount: BankAccount = {
        id: `acc-${Date.now()}`,
        ...formAccount,
      };
      setAccounts(prev => [...prev, newAccount]);
    }
    resetForm();
  };

  const deleteAccount = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('確定要刪除這個帳戶嗎？對應的資產數據將會消失。')) {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  const colors = [
    'bg-indigo-600', 'bg-emerald-600', 'bg-rose-500', 
    'bg-amber-500', 'bg-sky-500', 'bg-slate-700', 'bg-violet-600'
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">資產帳戶管理</h2>
          <p className="text-slate-500 text-sm mt-1">追蹤您的存款、現金與投資分佈</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={() => { resetForm(); setIsFormOpen(true); }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center space-x-2"
          >
            <i className="fas fa-plus"></i>
            <span>新增資產</span>
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className={`mb-10 p-8 bg-white rounded-[40px] border-2 ${editingId ? 'border-amber-200 shadow-amber-50' : 'border-indigo-50 shadow-indigo-50'} shadow-2xl animate-in zoom-in-95 duration-300`}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900 flex items-center">
              <span className={`w-3 h-8 ${editingId ? 'bg-amber-400' : 'bg-indigo-600'} rounded-full mr-4`}></span>
              {editingId ? '正在編輯帳戶資料' : '建立一個理財帳戶'}
            </h3>
            <button onClick={resetForm} className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">帳戶名稱</label>
              <input 
                type="text" 
                value={formAccount.name}
                onChange={e => setFormAccount({...formAccount, name: e.target.value})}
                placeholder="例如：中信 薪轉帳戶"
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-800 font-medium"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">目前金額 (TWD)</label>
              <input 
                type="number" 
                value={formAccount.balance}
                onChange={e => setFormAccount({...formAccount, balance: Number(e.target.value)})}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-800 font-bold"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">資產類別</label>
              <select 
                value={formAccount.type}
                onChange={e => setFormAccount({...formAccount, type: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-800 font-medium bg-white"
              >
                <option value="Savings">儲蓄 / 活存</option>
                <option value="Checking">薪轉 / 支票</option>
                <option value="Cash">現金錢包</option>
                <option value="Credit">信用卡 (負資產)</option>
                <option value="Investment">投資 / 股票</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">主題顏色</label>
              <div className="flex flex-wrap gap-3 pt-1">
                {colors.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormAccount({...formAccount, color: c})}
                    className={`w-10 h-10 rounded-2xl ${c} ${formAccount.color === c ? 'ring-4 ring-slate-200 scale-110 shadow-lg' : 'opacity-40 hover:opacity-100'} transition-all`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-50 flex justify-end space-x-4">
            <button onClick={resetForm} className="px-8 py-4 rounded-2xl text-sm font-bold text-slate-400 hover:bg-slate-50 transition-colors">捨棄更改</button>
            <button 
              onClick={saveAccount} 
              className={`px-12 py-4 rounded-2xl text-sm font-bold text-white shadow-2xl transition-all active:scale-95 ${editingId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'}`}
            >
              {editingId ? '儲存帳戶修改' : '確認建立帳戶'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {accounts.length === 0 ? (
          <div className="col-span-full py-24 bg-white rounded-[40px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
              <i className="fas fa-plus text-2xl opacity-30"></i>
            </div>
            <p className="font-bold text-lg">目前沒有任何資產帳戶</p>
            <p className="text-sm opacity-60">點擊右上方按鈕開始您的理財第一步</p>
          </div>
        ) : (
          accounts.map(acc => (
            <div 
              key={acc.id} 
              className={`group relative p-8 bg-white rounded-[40px] border-2 transition-all duration-500 ${editingId === acc.id ? 'border-amber-400 shadow-2xl shadow-amber-50 -translate-y-2' : 'border-slate-50 shadow-sm hover:shadow-2xl hover:-translate-y-2'}`}
            >
              <div className={`absolute top-0 right-0 w-40 h-40 ${acc.color} opacity-[0.04] -mr-20 -mt-20 rounded-full group-hover:scale-150 transition-transform duration-1000`}></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={`w-16 h-16 rounded-[24px] ${acc.color} flex items-center justify-center text-white shadow-2xl shadow-current/30`}>
                  <i className={`fas ${acc.type === 'Cash' ? 'fa-wallet' : acc.type === 'Investment' ? 'fa-chart-line' : 'fa-building-columns'} text-2xl`}></i>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => handleEdit(acc, e)}
                    className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-400 hover:bg-amber-100 hover:text-amber-600 transition-all flex items-center justify-center"
                    title="編輯此帳戶"
                  >
                    <i className="fas fa-pen-to-square text-sm"></i>
                  </button>
                  <button 
                    onClick={(e) => deleteAccount(acc.id, e)}
                    className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-100 hover:text-rose-500 transition-all flex items-center justify-center"
                    title="刪除此帳戶"
                  >
                    <i className="fas fa-trash-can text-sm"></i>
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 relative z-10">
                <h4 className="text-2xl font-black text-slate-900 truncate">{acc.name}</h4>
                <span className="inline-block px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {acc.type}
                </span>
              </div>
              
              <div className="mt-8 flex items-baseline space-x-2 border-t border-slate-50 pt-6 relative z-10">
                <span className="text-3xl font-black text-slate-900">${acc.balance.toLocaleString()}</span>
                <span className="text-sm font-bold text-slate-300">TWD</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Accounts;
