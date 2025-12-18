
import React, { useState } from 'react';
import { Transaction, BankAccount, Category, TransactionType } from '../types';

interface TransactionsProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  accounts: BankAccount[];
  categories: Category[];
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, setTransactions, accounts, categories }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState({ accountId: '', type: '' });
  const [newTx, setNewTx] = useState({
    accountId: accounts[0]?.id || '',
    categoryId: categories[0]?.id || '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
    type: TransactionType.EXPENSE
  });

  const addTransaction = () => {
    if (!newTx.accountId || !newTx.amount) return;
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      ...newTx
    };
    setTransactions([tx, ...transactions]);
    setIsAdding(false);
    setNewTx({ ...newTx, amount: 0, description: '' });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter.accountId && t.accountId !== filter.accountId) return false;
    if (filter.type && t.type !== filter.type) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900">收支紀錄</h2>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={filter.accountId}
            onChange={e => setFilter({...filter, accountId: e.target.value})}
          >
            <option value="">全部帳戶</option>
            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
          </select>
          <select 
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={filter.type}
            onChange={e => setFilter({...filter, type: e.target.value})}
          >
            <option value="">所有類型</option>
            <option value={TransactionType.INCOME}>收入</option>
            <option value={TransactionType.EXPENSE}>支出</option>
          </select>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center space-x-2"
          >
            <i className="fas fa-plus"></i>
            <span>新增紀錄</span>
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="p-8 bg-white rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-50/50">
          <h3 className="text-lg font-bold text-slate-800 mb-6">新增交易</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">類型</label>
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button 
                  onClick={() => setNewTx({...newTx, type: TransactionType.EXPENSE})}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${newTx.type === TransactionType.EXPENSE ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
                >
                  支出
                </button>
                <button 
                  onClick={() => setNewTx({...newTx, type: TransactionType.INCOME})}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${newTx.type === TransactionType.INCOME ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                >
                  收入
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">日期</label>
              <input 
                type="date" 
                value={newTx.date}
                onChange={e => setNewTx({...newTx, date: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">金額</label>
              <input 
                type="number" 
                value={newTx.amount}
                onChange={e => setNewTx({...newTx, amount: Number(e.target.value)})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">支付帳戶</label>
              <select 
                value={newTx.accountId}
                onChange={e => setNewTx({...newTx, accountId: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">分類</label>
              <select 
                value={newTx.categoryId}
                onChange={e => setNewTx({...newTx, categoryId: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">描述</label>
              <input 
                type="text" 
                value={newTx.description}
                onChange={e => setNewTx({...newTx, description: e.target.value})}
                placeholder="輸入說明..."
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3">
            <button onClick={() => setIsAdding(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50">取消</button>
            <button onClick={addTransaction} className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-md">儲存交易</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">日期</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">分類</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">描述</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">帳戶</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">金額</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredTransactions.map(t => {
              const cat = categories.find(c => c.id === t.categoryId);
              const acc = accounts.find(a => a.id === t.accountId);
              return (
                <tr key={t.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-500">{t.date}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
                      <i className={`fas ${cat?.icon} mr-2`}></i>
                      {cat?.name || '其他'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{t.description}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{acc?.name || '未知'}</td>
                  <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => deleteTransaction(t.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors p-2 opacity-0 group-hover:opacity-100"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredTransactions.length === 0 && (
          <div className="p-16 text-center text-slate-400 bg-white">沒有符合條件的紀錄</div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
