// lib/groq-api.ts
import axios from 'axios';
import { useState } from 'react';

// Define Groq API interface
export interface GroqResponse {
  transactions: Transaction[];
  analysis: {
    categoryBreakdown: CategoryBreakdown[];
    summary: SpendingSummary;
  }
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface SpendingSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
}

// Hook to use Groq API
export function useGroqTransactionProcessing() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<GroqResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processCSV = async (file: File): Promise<GroqResponse | null> => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 100);

      // Read file as text
      const text = await readFileAsText(file);
      
      // Process with our API endpoint
      const response = await axios.post('/api/transactions/analyze', { csvData: text });
      const data = response.data;
      
      // Complete progress
      clearInterval(progressInterval);
      setProgress(100);
      setResult(data);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processCSV,
    isProcessing,
    progress,
    result,
    error
  };
}

// Helper function to read file
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}