
import React, { useState } from 'react';
import { BankAccount } from '../types';

interface AccountsProps {
  accounts: BankAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
}

const Accounts: React.FC<AccountsProps> = ({ accounts, setAccounts }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: '', balance: 0, type: 'Savings', color: 'bg-indigo-600' });

  const addAccount = () => {
    if (!newAccount.name) return;
    const account: BankAccount = {
      id: `acc-${Date.now()}`,
      ...newAccount,
    };
    setAccounts([...accounts, account]);
    setNewAccount({ name: '', balance: 0, type: 'Savings', color: 'bg-indigo-600' });
    setIsAdding(false);
  };

  const deleteAccount = (id: string) => {
    if (confirm('確定要刪除此帳戶嗎？這將不會刪除相關交易記錄，但會造成顯示異常。')) {
      setAccounts(accounts.filter(a => a.id !== id));
    }
  };

  const colors = [
    'bg-indigo-600', 'bg-emerald-600', 'bg-rose-500', 
    'bg-amber-500', 'bg-sky-500', 'bg-slate-700', 'bg-violet-600'
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900">銀行帳戶管理</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 flex items-center space-x-2"
        >
          <i className="fas fa-plus"></i>
          <span>新增帳戶</span>
        </button>
      </div>

      {isAdding && (
        <div className="mb-10 p-8 bg-white rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-50/50">
          <h3 className="text-lg font-bold text-slate-800 mb-6">新增帳戶</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">帳戶名稱</label>
              <input 
                type="text" 
                value={newAccount.name}
                onChange={e => setNewAccount({...newAccount, name: e.target.value})}
                placeholder="例如：國泰世華 儲蓄"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">初始餘額</label>
              <input 
                type="number" 
                value={newAccount.balance}
                onChange={e => setNewAccount({...newAccount, balance: Number(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">類型</label>
              <select 
                value={newAccount.type}
                onChange={e => setNewAccount({...newAccount, type: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="Savings">儲蓄帳戶</option>
                <option value="Checking">支票帳戶</option>
                <option value="Cash">現金</option>
                <option value="Credit">信用卡</option>
                <option value="Investment">投資</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">代表顏色</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setNewAccount({...newAccount, color: c})}
                    className={`w-8 h-8 rounded-full ${c} ${newAccount.color === c ? 'ring-4 ring-indigo-200' : ''} transition-all`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3">
            <button onClick={() => setIsAdding(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50">取消</button>
            <button onClick={addAccount} className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-md">儲存帳戶</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="group p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 ${acc.color} opacity-5 -mr-16 -mt-16 rounded-full group-hover:scale-125 transition-transform duration-500`}></div>
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl ${acc.color} flex items-center justify-center text-white shadow-lg`}>
                <i className={`fas ${acc.type === 'Cash' ? 'fa-wallet' : 'fa-building-columns'} text-xl`}></i>
              </div>
              <button 
                onClick={() => deleteAccount(acc.id)}
                className="w-8 h-8 rounded-full hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
              >
                <i className="fas fa-trash-alt text-xs"></i>
              </button>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">{acc.name}</h4>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-4">{acc.type}</p>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-slate-900">${acc.balance.toLocaleString()}</span>
              <span className="text-xs text-slate-400 font-bold">TWD</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accounts;
