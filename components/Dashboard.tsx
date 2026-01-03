
import React, { useEffect, useState } from 'react';
import { BankAccount, Transaction, Category, TransactionType } from '../types';
import { getQuickInsight } from '../services/geminiService';

interface DashboardProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  categories: Category[];
  onNavigateToTips?: () => void;
  onNavigateToAI?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions, categories, onNavigateToTips, onNavigateToAI }) => {
  const [insight, setInsight] = useState<{status: string, message: string} | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      if (accounts.length === 0) return;
      setLoading(true);
      const res = await getQuickInsight(accounts, transactions, categories);
      setInsight(res);
      setLoading(false);
    };
    fetchInsight();
  }, [accounts, transactions]);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const now = new Date();
  const currentMonthTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
  });

  const income = currentMonthTransactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
  const expense = currentMonthTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* AI Quick Insight Banner */}
      <div 
        onClick={onNavigateToAI}
        className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-indigo-900 rounded-[32px] p-1 shadow-xl cursor-pointer hover:scale-[1.01] transition-all"
      >
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-[31px] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-50 animate-pulse"></div>
              <div className="relative w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl border border-indigo-400/30">
                {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <span className="font-black">{insight?.status || 'AI'}</span>}
              </div>
            </div>
            <div>
              <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-[0.2em]">AI 即時見解</p>
              <p className="text-white font-medium text-sm">
                {loading ? '正在讀取您的帳單...' : insight?.message || '點擊查看更深度的財務分析'}
              </p>
            </div>
          </div>
          <i className="fas fa-chevron-right text-indigo-400 text-sm"></i>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">總資產</p>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900">${totalBalance.toLocaleString()}</span>
            <span className="text-xs text-slate-400">TWD</span>
          </div>
        </div>
        <div className="p-6 bg-indigo-600 rounded-3xl shadow-lg shadow-indigo-100">
          <p className="text-indigo-100 text-sm font-medium">本月收入</p>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white">${income.toLocaleString()}</span>
          </div>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">本月支出</p>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900">${expense.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg font-bold text-slate-800">最近交易</h2>
          </div>
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

        {/* Promo Card */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 px-1">財務智慧</h2>
          <div 
            onClick={onNavigateToTips}
            className="group p-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-lg cursor-pointer hover:scale-[1.02] transition-all relative overflow-hidden h-full"
          >
             <div className="relative z-10">
              <h3 className="text-xl font-black text-white mb-2">理財扭蛋機</h3>
              <p className="text-indigo-100 text-sm mb-6">抽出一顆驚喜，提升你的理財商數。</p>
              <button className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white hover:text-indigo-600 transition-all">
                立即前往
              </button>
            </div>
            <i className="fas fa-circle-dot absolute -bottom-10 -right-10 text-9xl text-white/10 group-hover:rotate-12 transition-transform"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
