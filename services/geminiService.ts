
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Transaction, BankAccount, Category, TransactionType } from "../types";

// Using the Gemini API to get financial advice based on user transactions and accounts.
export const getFinancialAdvice = async (
  accounts: BankAccount[],
  transactions: Transaction[],
  categories: Category[]
): Promise<string> => {
  // Always initialize GoogleGenAI with the API key from process.env.API_KEY directly as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Use 'gemini-3-pro-preview' for complex financial reasoning and analysis as per task type guidelines.
  const model = "gemini-3-pro-preview";

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const monthlyIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseByCategory = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => {
      const cat = categories.find(c => c.id === t.categoryId)?.name || '未知';
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const prompt = `
    你是一位擁有 20 年經驗的頂級私人財務顧問。
    請根據以下精確數據進行深度邏輯分析：
    
    【當前資產概況】
    - 總資產: $${totalBalance.toLocaleString()} TWD
    - 本月總收入: $${monthlyIncome.toLocaleString()} TWD
    - 本月總支出: $${monthlyExpense.toLocaleString()} TWD
    
    【支出結構分析】
    ${JSON.stringify(expenseByCategory, null, 2)}
    
    請提供包含以下三個維度的專業建議：
    1. 數據洞察：找出潛在的財務風險或異常支出（例如支出佔收入比例過高）。
    2. 策略佈局：根據當前資產狀況，提供具體的資產配置建議。
    3. 行動指南：針對下個月提出三個具體的理財改進動作。
    
    語言要求：專業、誠懇且富有啟發性。請使用繁體中文，總長度約 300 字。
  `;

  try {
    // Generate content using the model name and prompt directly in the call.
    // The response is explicitly typed as GenerateContentResponse.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    // Accessing the .text property directly from the GenerateContentResponse object.
    return response.text || "分析結果生成失敗，請稍後再試。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 顧問目前無法連線，請檢查網路設定或 API Key 配置。";
  }
};
