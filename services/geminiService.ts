
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
    .slice(0, 15)
    .map(t => `${t.date}: ${categoriesMap[t.categoryId] || '其他'} - ${t.description} (${t.type === TransactionType.INCOME ? '+' : '-'}${t.amount})`);

  return `
    目前財務數據報告：
    - 總資產：${totalBalance} TWD
    - 本月總收入：${income} TWD
    - 本月總支出：${expense} TWD
    - 帳戶列表：${accounts.map(a => `${a.name}(${a.balance})`).join(', ')}
    - 最近流水紀錄：
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
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") {
    return { status: "！", message: "請設定 API Key 以啟用 AI。" };
  }

  const ai = new GoogleGenAI({ apiKey });
  const data = prepareDataString(accounts, transactions, categories);
  
  const prompt = `你是 FinGemini AI。請根據數據給出一個狀態字（穩、旺、警、虛、危）以及一句 20 字內建議。
    數據：${data}
    請返回 JSON：{"status": "字", "message": "點評"}
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
    return JSON.parse(response.text || '{"status": "平", "message": "歡迎使用。"}');
  } catch (e) {
    console.error("Quick Insight Error:", e);
    return { status: "？", message: "AI 暫時無法回應。" };
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
    return "API Key 未設定。請確保在環境變數或 Github Secrets 中設定 API_KEY。";
  }

  const ai = new GoogleGenAI({ apiKey });
  const data = prepareDataString(accounts, transactions, categories);

  const prompt = `你是資深理財顧問。請分析以下數據並提供繁體中文建議：
    ${data}
    
    1. 現狀分析
    2. 潛在風險
    3. 具體改善目標（至少3點）`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "AI 暫時無法生成分析報告。";
  } catch (error) {
    console.error("Deep Advice Error:", error);
    return "AI 連線失敗，請檢查網路或 API Key 狀態。";
  }
};
