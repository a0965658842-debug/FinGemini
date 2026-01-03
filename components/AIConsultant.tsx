
import React, { useState } from 'react';
import { BankAccount, Transaction, Category } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

interface AIConsultantProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  categories: Category[];
}

const AIConsultant: React.FC<AIConsultantProps> = ({ accounts, transactions, categories }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const startAnalysis = async () => {
    if (accounts.length === 0) {
      alert("請先在『帳戶』頁面新增資產數據，AI 才能為您進行分析喔！");
      return;
    }
    setLoading(true);
    setAdvice('');
    try {
      const result = await getFinancialAdvice(accounts, transactions, categories);
      setAdvice(result);
    } catch (err) {
      setAdvice("分析失敗，請檢查 API Key 設定。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white p-8 md:p-12 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center text-white text-4xl mb-6 shadow-xl shadow-indigo-200 rotate-3">
              <i className="fas fa-robot"></i>
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">AI 全方位財務診斷</h2>
            <p className="text-slate-500 max-w-xl leading-relaxed text-lg">
              我們將分析您的 {accounts.length} 個帳戶與近期交易紀錄，透過 Gemini 3 Pro 產出專屬您的個人化理財報告。
            </p>
          </div>

          {!advice && !loading && (
            <div className="flex justify-center">
              <button 
                onClick={startAnalysis}
                className="group relative px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-xl shadow-2xl hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  啟動 AI 深度分析 <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          )}

          {loading && (
            <div className="py-20 flex flex-col items-center">
              <div className="relative w-32 h-32 mb-10">
                <div className="absolute inset-0 bg-indigo-600 rounded-full animate-ping opacity-10"></div>
                <div className="absolute inset-2 bg-indigo-600 rounded-full animate-pulse opacity-20"></div>
                <div className="relative w-32 h-32 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center text-indigo-600 shadow-inner">
                  <i className="fas fa-brain text-4xl animate-bounce"></i>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Gemini 正在精算中...</h3>
              <p className="text-slate-400 font-medium">我們正在閱讀您的帳本數據並尋找優化空間</p>
            </div>
          )}

          {advice && (
            <div className="animate-in fade-in zoom-in-95 duration-700">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">診斷報告已生成</span>
                </div>
                <button onClick={startAnalysis} className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                  <i className="fas fa-redo-alt mr-2"></i>重新獲取建議
                </button>
              </div>
              
              <div className="bg-slate-50/50 rounded-[32px] p-8 md:p-10 border border-slate-100">
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                    {advice}
                  </p>
                </div>
              </div>
              
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">精準度</p>
                  <p className="text-lg font-black text-slate-800">最高級</p>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">資料安全</p>
                  <p className="text-lg font-black text-slate-800">本地處理</p>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-bolt"></i>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">模型</p>
                  <p className="text-lg font-black text-slate-800">Pro 3.0</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIConsultant;
