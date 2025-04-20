// lib/stores/transaction-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, CategoryBreakdown, SpendingSummary } from '@/lib/groq-api';

interface TransactionState {
  transactions: Transaction[];
  analysis: {
    categoryBreakdown: CategoryBreakdown[];
    summary: SpendingSummary;
  };
  setTransactions: (transactions: Transaction[]) => void;
  setAnalysis: (analysis: { categoryBreakdown: CategoryBreakdown[], summary: SpendingSummary }) => void;
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (id: string, updatedTransaction: Partial<Transaction>) => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: [],
      analysis: {
        categoryBreakdown: [],
        summary: {
          totalIncome: 0,
          totalExpenses: 0,
          netSavings: 0
        }
      },
      setTransactions: (transactions) => set({ transactions }),
      setAnalysis: (analysis) => set({ analysis }),
      addTransaction: (transaction) => 
        set((state) => ({ 
          transactions: [...state.transactions, transaction] 
        })),
      removeTransaction: (id) => 
        set((state) => ({ 
          transactions: state.transactions.filter((t) => t.id !== id) 
        })),
      updateTransaction: (id, updatedTransaction) => 
        set((state) => ({ 
          transactions: state.transactions.map((t) => 
            t.id === id ? { ...t, ...updatedTransaction } : t
          ) 
        })),
    }),
    {
      name: 'transaction-store',
    }
  )
);