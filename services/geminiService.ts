
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Transaction, BankAccount, Category, TransactionType } from "../types";

/**
 * 格式化數據供 AI 讀取
 * 此函數不依賴登入狀態，僅依賴傳入的 accounts 與 transactions
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
    - 帳戶分佈：${accounts.map(a => `${a.name}(餘額:${a.balance})`).join(', ')}
    - 最近 15 筆流水紀錄：
    ${recentTxs.join('\n    ')}
  `;
};

/**
 * 快速見解（用於 Dashboard）
 * 使用免費版模型 gemini-3-flash-preview
 */
export const getQuickInsight = async (
  accounts: BankAccount[],
  transactions: Transaction[],
  categories: Category[]
) => {
  // Directly initialize with process.env.API_KEY as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const data = prepareDataString(accounts, transactions, categories);
  
  const prompt = `你是 FinGemini AI。分析以下財務數據，給出一個狀態字（穩、旺、警、虛、危）以及一句 20 字內建議。
    數據：${data}
    請嚴格返回 JSON：{"status": "字", "message": "點評"}
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        // Using responseSchema for robust JSON output as recommended
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, description: '財務狀態字' },
            message: { type: Type.STRING, description: '理財點評' }
          },
          required: ["status", "message"]
        }
      }
    });
    // Access .text property directly instead of calling it as a method
    return JSON.parse(response.text || '{"status": "平", "message": "歡迎使用 FinGemini。"}');
  } catch (e) {
    console.error("Quick Insight Error:", e);
    return { status: "！", message: "AI 忙碌中。" };
  }
};

/**
 * 深度分析（用於 AIConsultant）
 * 使用 gemini-3-pro-preview 進行複雜理財諮詢
 */
export const getFinancialAdvice = async (
  accounts: BankAccount[],
  transactions: Transaction[],
  categories: Category[]
): Promise<string> => {
  // Directly initialize with process.env.API_KEY as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const data = prepareDataString(accounts, transactions, categories);

  const prompt = `你是首席財務分析師。針對以下數據提供深度診斷：
    ${data}
    
    內容包含：
    1. 現況分析：評估目前的收支比與資金流向。
    2. 風險提示：指出不合理的支出或資產配置風險。
    3. 行動指南：3 個可執行的具體目標。
    
    使用繁體中文，語氣權威且專業。`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      // Upgraded to gemini-3-pro-preview for complex reasoning tasks
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    // Access .text property directly
    return response.text || "報告生成失敗，請稍後再試。";
  } catch (error) {
    console.error("Deep Advice Error:", error);
    return "AI 顧問暫時無法服務，請確認您的 API Key 是否有效。";
  }
};
