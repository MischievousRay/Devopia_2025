// lib/groq-api-client.ts
import axios from 'axios';
import { Transaction, CategoryBreakdown, SpendingSummary, GroqResponse } from './groq-api';

export class GroqAPI {
  private apiKey: string;
  private baseURL: string = 'https://api.groq.com/openai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Analyzes transaction data from a CSV string
   */
  async analyzeTransactions(csvData: string): Promise<GroqResponse> {
    const prompt = `
      Analyze the following CSV data representing financial transactions.
      The CSV has headers and contains bank transactions.
      
      Extract the following information:
      1. Parse each transaction into a structured format with date, description, amount, and categorize each transaction
      2. Determine if each transaction is income or expense
      3. Group transactions by category and calculate the total amount for each category
      4. Calculate the total income, total expenses, and net savings
      
      Return the results in JSON format including:
      - A list of all transactions
      - A breakdown of spending by category
      - A financial summary
      
      CSV data:
      ${csvData}
    `;

    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: "You are a financial analysis assistant that processes CSV transaction data and returns structured JSON results."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.2,
          response_format: { type: "json_object" }
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Process and structure the response
      const jsonResponse = response.data.choices[0].message.content;
      
      // Parse the JSON response
      const parsedResponse = JSON.parse(jsonResponse);
      
      // Structure the response to match our expected format
      return this.processGroqResponse(parsedResponse);
    } catch (error) {
      console.error('Error calling Groq API:', error);
      throw error;
    }
  }

  /**
   * Processes and structures the raw Groq response into our application format
   */
  private processGroqResponse(rawResponse: any): GroqResponse {
    // Structure the response according to our application's expected format
    return {
      transactions: this.processTransactions(rawResponse.transactions || []),
      analysis: {
        categoryBreakdown: this.processCategoryBreakdown(rawResponse.categoryBreakdown || rawResponse.categories || []),
        summary: this.processSummary(rawResponse.summary || rawResponse.financialSummary || {})
      }
    };
  }

  private processTransactions(transactions: any[]): Transaction[] {
    return transactions.map((t, index) => ({
      id: t.id || `tx-${index}-${Date.now()}`,
      date: t.date || new Date().toISOString().split('T')[0],
      description: t.description || t.merchant || t.name || "Unknown transaction",
      amount: typeof t.amount === 'number' ? t.amount : parseFloat(t.amount || '0'),
      category: t.category || "Uncategorized",
      type: (t.type || (parseFloat(t.amount || '0') >= 0 ? 'income' : 'expense')).toLowerCase()
    }));
  }

  private processCategoryBreakdown(categories: any[]): CategoryBreakdown[] {
    // Handle different possible formats from the LLM response
    if (Array.isArray(categories)) {
      return categories.map((category) => ({
        category: category.category || category.name || "Unknown",
        amount: typeof category.amount === 'number' ? Math.abs(category.amount) : Math.abs(parseFloat(category.amount || '0')),
        percentage: category.percentage || 0
      }));
    } else if (typeof categories === 'object' && categories !== null) {
      // If it's an object with category names as keys
      return Object.entries(categories).map(([category, amount]) => ({
        category,
        amount: typeof amount === 'number' ? Math.abs(amount) : Math.abs(parseFloat(amount as string || '0')),
        percentage: 0 // We'll calculate this below
      }));
    }
    
    return [];
  }

  private processSummary(summary: any): SpendingSummary {
    const totalIncome = summary.totalIncome || summary.income || 0;
    const totalExpenses = summary.totalExpenses || summary.expenses || 0;
    const netSavings = summary.netSavings || summary.savings || (totalIncome - totalExpenses);
    
    return {
      totalIncome: typeof totalIncome === 'number' ? totalIncome : parseFloat(totalIncome || '0'),
      totalExpenses: typeof totalExpenses === 'number' ? Math.abs(totalExpenses) : Math.abs(parseFloat(totalExpenses || '0')),
      netSavings: typeof netSavings === 'number' ? netSavings : parseFloat(netSavings || '0')
    };
  }
}