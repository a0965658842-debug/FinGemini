
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
    e.stopPropagation(); // 防止冒泡
    setFormAccount({ name: acc.name, balance: acc.balance, type: acc.type, color: acc.color });
    setEditingId(acc.id);
    setIsFormOpen(true);
    // 捲動到頂部表單
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveAccount = () => {
    if (!formAccount.name) {
      alert("請輸入帳戶名稱");
      return;
    }

    if (editingId) {
      // 編輯現有帳戶
      setAccounts(prev => prev.map(a => a.id === editingId ? { ...a, ...formAccount } : a));
    } else {
      // 新增帳戶
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
    if (confirm('確定要刪除此帳戶嗎？這將無法復原。')) {
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
          <h2 className="text-2xl font-bold text-slate-900">銀行帳戶管理</h2>
          <p className="text-slate-500 text-sm mt-1">管理您的資產分配與目前餘額</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsFormOpen(true); }}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center space-x-2"
        >
          <i className="fas fa-plus"></i>
          <span>新增資產</span>
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-10 p-8 bg-white rounded-[32px] border-2 border-indigo-50 shadow-2xl shadow-indigo-100/20 animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center">
              <span className={`w-2 h-6 ${editingId ? 'bg-amber-400' : 'bg-indigo-600'} rounded-full mr-3`}></span>
              {editingId ? '編輯帳戶內容' : '建立全新帳戶'}
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">帳戶名稱</label>
              <input 
                type="text" 
                value={formAccount.name}
                onChange={e => setFormAccount({...formAccount, name: e.target.value})}
                placeholder="例如：台新 Richart"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">帳戶餘額 (TWD)</label>
              <input 
                type="number" 
                value={formAccount.balance}
                onChange={e => setFormAccount({...formAccount, balance: Number(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">帳戶類型</label>
              <select 
                value={formAccount.type}
                onChange={e => setFormAccount({...formAccount, type: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none bg-white"
              >
                <option value="Savings">儲蓄帳戶</option>
                <option value="Checking">支票帳戶</option>
                <option value="Cash">現金/錢包</option>
                <option value="Credit">信用卡 (負債)</option>
                <option value="Investment">投資帳戶</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">標籤顏色</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {colors.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormAccount({...formAccount, color: c})}
                    className={`w-9 h-9 rounded-full ${c} ${formAccount.color === c ? 'ring-4 ring-slate-200 scale-110 shadow-lg' : 'opacity-60 hover:opacity-100'} transition-all`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-slate-50 flex justify-end space-x-4">
            <button onClick={resetForm} className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">取消</button>
            <button 
              onClick={saveAccount} 
              className={`${editingId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'} text-white px-10 py-3 rounded-xl text-sm font-bold shadow-xl transition-all active:scale-95`}
            >
              {editingId ? '儲存變更' : '確定新增'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-[32px] border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
            <i className="fas fa-folder-open text-4xl mb-4 opacity-20"></i>
            <p className="font-medium">尚無帳戶資料，點擊上方按鈕新增</p>
          </div>
        ) : (
          accounts.map(acc => (
            <div 
              key={acc.id} 
              className="group relative p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${acc.color} opacity-[0.03] -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-1000`}></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl ${acc.color} flex items-center justify-center text-white shadow-xl shadow-current/20`}>
                  <i className={`fas ${acc.type === 'Cash' ? 'fa-wallet' : acc.type === 'Investment' ? 'fa-chart-line' : 'fa-building-columns'} text-2xl`}></i>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => handleEdit(acc, e)}
                    className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-all flex items-center justify-center"
                    title="編輯帳戶"
                  >
                    <i className="fas fa-pen-to-square text-sm"></i>
                  </button>
                  <button 
                    onClick={(e) => deleteAccount(acc.id, e)}
                    className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center"
                    title="刪除帳戶"
                  >
                    <i className="fas fa-trash-can text-sm"></i>
                  </button>
                </div>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900 truncate">{acc.name}</h4>
                <div className="flex items-center text-slate-400">
                  <span className="text-[10px] font-black uppercase tracking-widest">{acc.type}</span>
                </div>
              </div>
              
              <div className="mt-6 flex items-baseline space-x-1 border-t border-slate-50 pt-4">
                <span className="text-2xl font-black text-slate-900">${acc.balance.toLocaleString()}</span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">TWD</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Accounts;
