
import React from 'react';
import { BankAccount, Transaction, Category, TransactionType } from '../types';

interface DashboardProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  categories: Category[];
  onNavigateToTips?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions, categories, onNavigateToTips }) => {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  const now = new Date();
  const currentMonthTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
  });

  const income = currentMonthTransactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expense = currentMonthTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-slate-500 text-sm font-medium">總資產</p>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900">${totalBalance.toLocaleString()}</span>
            <span className="text-xs text-slate-400">TWD</span>
          </div>
          <div className="mt-4 flex items-center text-emerald-500 text-xs font-semibold">
            <i className="fas fa-arrow-up mr-1"></i>
            <span>+2.4% vs 上月</span>
          </div>
        </div>

        <div className="p-6 bg-indigo-600 rounded-3xl shadow-lg shadow-indigo-100 flex flex-col justify-between">
          <p className="text-indigo-100 text-sm font-medium">本月收入</p>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white">${income.toLocaleString()}</span>
          </div>
          <div className="mt-4 p-1.5 bg-indigo-500/30 rounded-full">
            <div className="bg-indigo-400 h-1 rounded-full w-[65%]"></div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-slate-500 text-sm font-medium">本月支出</p>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900">${expense.toLocaleString()}</span>
          </div>
          <div className="mt-4 flex items-center text-rose-500 text-xs font-semibold">
            <i className="fas fa-arrow-down mr-1"></i>
            <span>比預算低 12%</span>
          </div>
        </div>
      </div>

      {/* Promo Card for Gashapon */}
      <div 
        onClick={onNavigateToTips}
        className="group p-8 bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded-[40px] shadow-2xl shadow-indigo-100 flex flex-col md:flex-row items-center justify-between cursor-pointer hover:scale-[1.01] transition-all relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -mr-20 -mt-20 rounded-full blur-3xl"></div>
        <div className="flex items-center space-x-8 mb-6 md:mb-0 text-center md:text-left z-10">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-white text-4xl shrink-0 group-hover:rotate-12 transition-transform shadow-xl border border-white/30">
            <i className="fas fa-circle-dot"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white mb-1">理財知識扭蛋機</h3>
            <p className="text-indigo-100 opacity-90 font-medium">每天扭一次，積累你的財務智慧。完全免費！</p>
          </div>
        </div>
        <button className="bg-white text-indigo-600 px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-50 transition-all hover:px-10 z-10">
          我要扭蛋！
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 px-1">最近交易</h2>
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            {recentTransactions.length === 0 ? (
              <div className="p-10 text-center text-slate-400">尚無交易紀錄</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentTransactions.map((t) => {
                  const category = categories.find(c => c.id === t.categoryId);
                  const account = accounts.find(a => a.id === t.accountId);
                  return (
                    <div key={t.id} className="p-4 flex items-center hover:bg-slate-50 transition-colors">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${t.type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        <i className={`fas ${category?.icon || 'fa-tag'}`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{t.description}</p>
                        <p className="text-xs text-slate-500">{account?.name || '未知帳戶'} • {t.date}</p>
                      </div>
                      <div className={`text-sm font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Account Quick List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 px-1">我的帳戶</h2>
          <div className="space-y-3">
            {accounts.map((acc) => (
              <div key={acc.id} className="p-5 bg-white rounded-2xl border border-slate-100 flex items-center shadow-sm">
                <div className={`w-3 h-10 rounded-full mr-4 ${acc.color}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{acc.name}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{acc.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">${acc.balance.toLocaleString()}</p>
                  <p className="text-xs text-emerald-500 font-medium">活躍中</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
