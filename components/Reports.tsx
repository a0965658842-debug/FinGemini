
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BankAccount, Transaction, Category, TransactionType } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

interface ReportsProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  categories: Category[];
}

const Reports: React.FC<ReportsProps> = ({ accounts, transactions, categories }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState<boolean>(false);

  // Data for Category Pie Chart
  const expenseData = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => {
      const cat = categories.find(c => c.id === t.categoryId)?.name || '其他';
      const existing = acc.find(item => item.name === cat);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: cat, value: t.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  // Data for Monthly Income vs Expense
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const barData = months.map(m => {
    const monthTxs = transactions.filter(t => t.date.includes(`-2023-${m}`));
    return {
      name: `${m}月`,
      收入: monthTxs.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0),
      支出: monthTxs.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0),
    };
  }).filter(d => d.收入 > 0 || d.支出 > 0);

  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#0ea5e9', '#8b5cf6', '#64748b', '#ec4899'];

  const fetchAdvice = async () => {
    setLoadingAdvice(true);
    const result = await getFinancialAdvice(accounts, transactions, categories);
    setAdvice(result);
    setLoadingAdvice(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">財務報表分析</h2>
        <button 
          onClick={fetchAdvice}
          disabled={loadingAdvice}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all flex items-center space-x-2 disabled:opacity-50 shadow-lg shadow-indigo-100"
        >
          {loadingAdvice ? (
            <i className="fas fa-circle-notch fa-spin"></i>
          ) : (
            <i className="fas fa-robot"></i>
          )}
          <span>{loadingAdvice ? 'AI 分析中...' : '獲取 AI 理財建議'}</span>
        </button>
      </div>

      {advice && (
        <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 -mr-8 -mt-8 rounded-full"></div>
          <div className="flex items-start space-x-4 relative">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 shrink-0">
              <i className="fas fa-lightbulb text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-indigo-900 mb-2">AI 財務顧問建議</h3>
              <p className="text-indigo-800/80 text-sm leading-relaxed whitespace-pre-wrap">{advice}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">支出分類比例</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">收支趨勢 (月度)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend verticalAlign="top" align="right" />
                <Bar dataKey="收入" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="支出" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
