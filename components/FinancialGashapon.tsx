
import React, { useState } from 'react';

interface Tip {
  title: string;
  content: string;
  category: '儲蓄' | '投資' | '消費' | '心態';
  color: string;
}

const TIPS: Tip[] = [
  { title: "72 法則", content: "想知道資產翻倍要多久？用 72 除以年化報酬率。例如報酬率 6%，大約 12 年資產翻倍。", category: '投資', color: 'bg-blue-500' },
  { title: "先支付給自己", content: "發薪水的第一件事不是付帳單，而是先撥出固定金額到儲蓄帳戶。", category: '儲蓄', color: 'bg-emerald-500' },
  { title: "拿鐵因子", content: "每天一杯 150 元的咖啡，一年下來就是 5 萬多元。這就是微小但致命的隱形成本。", category: '消費', color: 'bg-amber-500' },
  { title: "緊急預備金", content: "理想的預備金應維持 3-6 個月的「必要支出」，以應對突發狀況。", category: '儲蓄', color: 'bg-rose-500' },
  { title: "複利的威力", content: "愛因斯坦稱複利為世界第八大奇蹟。及早開始投資，時間就是你最大的朋友。", category: '心態', color: 'bg-indigo-500' },
  { title: "資產與負債", content: "資產是把錢放進你口袋的東西；負債是把錢從你口袋拿走的東西。多買資產，少買負債。", category: '投資', color: 'bg-violet-500' },
  { title: "333 理財法", content: "將收入分成三等份：1/3 生活開銷、1/3 儲蓄理財、1/3 投資自己或保險。", category: '儲蓄', color: 'bg-teal-500' },
  { title: "別跟風投資", content: "如果你不明白一個產品怎麼賺錢，那就不要投資它。不懂不碰是最高準則。", category: '心態', color: 'bg-orange-500' },
  { title: "延遲享樂", content: "忍住現在想買奢侈品的衝動，將這筆錢投入增值資產，未來的你可以買更多。", category: '消費', color: 'bg-pink-500' },
  { title: "通膨是隱形小偷", content: "如果現金放在銀行不動，每年的通膨會讓你的購買力縮水。適度投資才能抗通膨。", category: '投資', color: 'bg-sky-500' },
];

const FinancialGashapon: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showCapsule, setShowCapsule] = useState(false);
  const [currentTip, setCurrentTip] = useState<Tip | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsOpen(false);
    setShowCapsule(false);
    setIsSpinning(true);

    // Machine shaking duration
    setTimeout(() => {
      setIsSpinning(false);
      setShowCapsule(true);
      const randomIndex = Math.floor(Math.random() * TIPS.length);
      setCurrentTip(TIPS[randomIndex]);
    }, 1200);
  };

  const openCapsule = () => {
    setIsOpen(true);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 flex flex-col items-center">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-900 mb-2">理財扭蛋機</h2>
        <p className="text-slate-500">扭出一顆驚喜，收穫一點財富智慧！</p>
      </div>

      {/* Gashapon Machine UI */}
      <div className="relative w-72 h-96 bg-slate-100 rounded-t-[100px] rounded-b-3xl border-8 border-slate-800 shadow-2xl flex flex-col items-center overflow-visible">
        {/* Transparent Window */}
        <div className="absolute top-8 w-56 h-48 bg-white/40 border-4 border-slate-800 rounded-full overflow-hidden flex flex-wrap justify-center content-center gap-2 p-4">
          <div className={`w-8 h-8 rounded-full bg-rose-400 border-2 border-slate-800 ${isSpinning ? 'animate-bounce' : ''}`}></div>
          <div className={`w-8 h-8 rounded-full bg-blue-400 border-2 border-slate-800 ${isSpinning ? 'animate-pulse' : ''}`}></div>
          <div className={`w-8 h-8 rounded-full bg-amber-400 border-2 border-slate-800 ${isSpinning ? 'animate-bounce' : ''}`}></div>
          <div className={`w-8 h-8 rounded-full bg-emerald-400 border-2 border-slate-800 ${isSpinning ? 'animate-pulse' : ''}`}></div>
          <div className={`w-8 h-8 rounded-full bg-indigo-400 border-2 border-slate-800 ${isSpinning ? 'animate-bounce' : ''}`}></div>
        </div>

        {/* Machine Body Decoration */}
        <div className="mt-60 flex flex-col items-center w-full">
          {/* Knob */}
          <button 
            onClick={handleSpin}
            disabled={isSpinning}
            className={`w-20 h-20 rounded-full bg-indigo-600 border-4 border-slate-800 flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:rotate-180 duration-500 ${isSpinning ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <i className={`fas fa-sync-alt text-2xl ${isSpinning ? 'animate-spin' : ''}`}></i>
          </button>
          
          {/* Exit Slot */}
          <div className="mt-8 w-24 h-16 bg-slate-800 rounded-lg flex items-center justify-center relative overflow-visible">
            {showCapsule && !isOpen && (
              <div 
                onClick={openCapsule}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-slate-900 absolute -bottom-2 cursor-pointer animate-bounce shadow-lg flex items-center justify-center text-white text-xs font-bold"
              >
                OPEN
              </div>
            )}
          </div>
        </div>

        {/* Shaking effect class applied to machine */}
        {isSpinning && <style>{`
          .gashapon-shake { animation: shake 0.2s infinite; }
          @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            50% { transform: translate(-1px, 1px) rotate(1deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
          }
        `}</style>}
      </div>

      <div className="mt-12">
        {!showCapsule && !isSpinning && (
          <button 
            onClick={handleSpin}
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1"
          >
            扭一下！(消耗 0 元)
          </button>
        )}
      </div>

      {/* Result Modal */}
      {isOpen && currentTip && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-10 text-center max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-2 ${currentTip.color}`}></div>
            <div className="mb-6">
              <span className={`px-4 py-1 rounded-full text-white text-xs font-bold uppercase tracking-widest ${currentTip.color}`}>
                {currentTip.category}
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">{currentTip.title}</h3>
            <div className="p-6 bg-slate-50 rounded-3xl mb-8">
              <p className="text-slate-600 leading-relaxed font-medium">
                {currentTip.content}
              </p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
            >
              收下智慧
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialGashapon;
