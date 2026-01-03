
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
  if (!process.env.API_KEY || process.env.API_KEY === "undefined" || process.env.API_KEY === "") {
    return { status: "未授權", message: "AI 功能需要 API Key。請在專案設定中配置。" };
  }

  try {
    // Correctly initialize GoogleGenAI with named parameter
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const data = prepareDataString(accounts, transactions, categories);
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `你是 FinGemini AI 理財助手。請分析以下數據，給出一個狀態字（穩、旺、警、虛、危）以及一句 20 字內建議。
        數據：${data}
        請嚴格返回 JSON：{"status": "字", "message": "點評"}`,
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
    
    // Directly access .text property from GenerateContentResponse
    const text = response.text;
    return JSON.parse(text || '{"status": "平", "message": "資料讀取中。"}');
  } catch (e: any) {
    console.error("AI Insight Error:", e);
    return { status: "故障", message: "AI 服務暫時無法連線。" };
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
  if (!process.env.API_KEY || process.env.API_KEY === "undefined") {
    return "❌ 系統未偵測到 API Key，請檢查環境變數配置。";
  }

  try {
    // Correctly initialize GoogleGenAI with named parameter
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const data = prepareDataString(accounts, transactions, categories);

    // Using gemini-3-pro-preview for complex text task (financial advice)
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `你是專業理財顧問。請針對以下數據提供深度診斷（繁體中文）：
        ${data}
        
        請包含：
        1. 目前財務現況總結
        2. 潛在風險提示
        3. 三個可執行的理財目標與建議`,
    });
    
    // Directly access .text property from GenerateContentResponse
    return response.text || "AI 暫時無法生成建議內容。";
  } catch (error: any) {
    console.error("AI Advice Error:", error);
    return `❌ 分析中斷：${error.message || "網路連線異常"}`;
  }
};
