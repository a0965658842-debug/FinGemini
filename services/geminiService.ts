
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Transaction, BankAccount, Category, TransactionType } from "../types";

/**
 * 格式化數據供 AI 讀取
 */
const prepareDataString = (accounts: BankAccount[], transactions: Transaction[], categories: Category[]) => {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthTxs = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  
  const income = currentMonthTxs.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
  const expense = currentMonthTxs.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
  
  const categoriesMap = categories.reduce((acc, c) => ({ ...acc, [c.id]: c.name }), {} as Record<string, string>);
  const recentTxs = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)
    .map(t => `${t.date}: ${categoriesMap[t.categoryId] || '其他'} - ${t.description} (${t.type === TransactionType.INCOME ? '+' : '-'}${t.amount})`);

  return `
    目前財務數據報告：
    - 總資產：${totalBalance} TWD
    - 本月總收入：${income} TWD
    - 本月總支出：${expense} TWD
    - 帳戶：${accounts.map(a => `${a.name}(${a.balance})`).join(', ')}
    - 最近流水：
    ${recentTxs.join('\n    ')}
  `;
};

/**
 * 快速見解（用於 Dashboard）
 */
export const getQuickInsight = async (
  accounts: BankAccount[],
  transactions: Transaction[],
  categories: Category[]
) => {
  // 檢查環境變數
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") {
    return { status: "金鑰缺失", message: "請在系統環境中設定有效的 API_KEY。" };
  }

  const ai = new GoogleGenAI({ apiKey });
  const data = prepareDataString(accounts, transactions, categories);
  
  const prompt = `你是 FinGemini AI。請分析以下數據，給出一個狀態字（穩、旺、警、虛、危）以及一句 20 字內建議。
    數據：${data}
    請嚴格返回 JSON：{"status": "字", "message": "點評"}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            message: { type: Type.STRING }
          },
          required: ["status", "message"]
        }
      }
    });
    
    const text = response.text;
    if (!text) throw new Error("AI 回傳內容為空");
    return JSON.parse(text);
  } catch (e: any) {
    console.error("AI Insight Error:", e);
    return { status: "錯誤", message: `AI 連線失敗: ${e.message || "未知原因"}` };
  }
};

/**
 * 深度分析（用於 AIConsultant）
 */
export const getFinancialAdvice = async (
  accounts: BankAccount[],
  transactions: Transaction[],
  categories: Category[]
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") {
    return "❌ 找不到 API Key。請確認您的環境變數設定。";
  }

  const ai = new GoogleGenAI({ apiKey });
  const data = prepareDataString(accounts, transactions, categories);

  const prompt = `你是專業理財顧問。請針對以下數據提供深度診斷（繁體中文）：
    ${data}
    
    請包含：
    1. 收支現況點評
    2. 資金風險警告
    3. 具體的三個理財行動方案
    
    語氣要親切但專業。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "AI 暫時無法生成建議，請稍後再試。";
  } catch (error: any) {
    console.error("AI Advice Error:", error);
    return `❌ 分析中斷：${error.message || "連線逾時"}`;
  }
};
