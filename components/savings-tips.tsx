import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { useGroqTransactionProcessing } from '../lib/groq-api';

// Extending the existing types from groq-api.ts
interface SavingTip {
  id: string;
  category: string;
  tip: string;
  potentialSavings?: number;
}

interface TransactionData {
  monthlyCategorySpending: Record<string, number>;
  previousMonthSpending: Record<string, number>;
  userBudget: Record<string, number>;
}

export default function SavingsTips() {
  const [tips, setTips] = useState<SavingTip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Files for processing
  const [currentMonthFile, setCurrentMonthFile] = useState<File | null>(null);
  const [previousMonthFile, setPreviousMonthFile] = useState<File | null>(null);
  const [budgetFile, setBudgetFile] = useState<File | null>(null);
  
  // Transaction data after processing
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  
  // Use our existing Groq processing hook
  const {
    processCSV,
    isProcessing: isProcessingCurrentMonth,
    progress: progressCurrentMonth,
    result: resultCurrentMonth,
    error: errorCurrentMonth
  } = useGroqTransactionProcessing();
  
  const {
    processCSV: processCSVPrevious,
    isProcessing: isProcessingPreviousMonth,
    progress: progressPreviousMonth,
    result: resultPreviousMonth,
    error: errorPreviousMonth
  } = useGroqTransactionProcessing();
  
  const {
    processCSV: processCSVBudget,
    isProcessing: isProcessingBudget,
    progress: progressBudget,
    result: resultBudget,
    error: errorBudget
  } = useGroqTransactionProcessing();

  // Handle file uploads
  const handleCurrentMonthUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentMonthFile(e.target.files[0]);
    }
  };

  const handlePreviousMonthUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPreviousMonthFile(e.target.files[0]);
    }
  };

  const handleBudgetUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBudgetFile(e.target.files[0]);
    }
  };

  // Process CSV files when uploaded
  useEffect(() => {
    if (currentMonthFile) {
      processCSV(currentMonthFile);
    }
  }, [currentMonthFile]);

  useEffect(() => {
    if (previousMonthFile) {
      processCSVPrevious(previousMonthFile);
    }
  }, [previousMonthFile]);

  useEffect(() => {
    if (budgetFile) {
      processCSVBudget(budgetFile);
    }
  }, [budgetFile]);

  // Update transaction data when results are available
  useEffect(() => {
    const updateTransactionData = () => {
      if (resultCurrentMonth && resultPreviousMonth && resultBudget) {
        // Extract spending data from Groq analysis results
        const monthlyCategorySpending = extractCategorySpending(resultCurrentMonth);
        const previousMonthSpending = extractCategorySpending(resultPreviousMonth);
        const userBudget = extractBudgetData(resultBudget);

        setTransactionData({
          monthlyCategorySpending,
          previousMonthSpending,
          userBudget
        });
      }
    };

    updateTransactionData();
  }, [resultCurrentMonth, resultPreviousMonth, resultBudget]);

  // Extract category spending from Groq results
  const extractCategorySpending = (result: any): Record<string, number> => {
    if (!result || !result.analysis || !result.analysis.categoryBreakdown) {
      return {};
    }

    return result.analysis.categoryBreakdown.reduce((acc: Record<string, number>, item: any) => {
      if (item.category && typeof item.amount === 'number') {
        acc[item.category] = Math.abs(item.amount);
      }
      return acc;
    }, {});
  };

  // Extract budget data from Groq results
  const extractBudgetData = (result: any): Record<string, number> => {
    // Assuming budget CSV has similar structure to transactions
    // But you might need to adjust this based on your actual budget CSV format
    return extractCategorySpending(result);
  };

  // Generate tips from transaction data
  const generateTips = async () => {
    if (!transactionData) {
      setError("Please upload and process all CSV files first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/savings/tips', {
        transactionData
      });

      if (response.data && response.data.tips) {
        setTips(response.data.tips);
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (err) {
      console.error("Error fetching savings tips:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch savings tips");
    } finally {
      setLoading(false);
    }
  };

  // Check if all files are processed and data is ready
  const isDataReady = !!(
    resultCurrentMonth && 
    resultPreviousMonth && 
    resultBudget && 
    transactionData
  );

  // Check if any processing is happening
  const isAnyProcessing = isProcessingCurrentMonth || isProcessingPreviousMonth || isProcessingBudget;

  return (
    <div className="space-y-6">
      <div className="space-y-4 bg-white p-4 rounded-lg border">
        <h2 className="text-lg font-medium">Upload Your CSV Files</h2>
        
        <div>
          <label className="block text-sm mb-1 font-medium">Current Month Transactions</label>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleCurrentMonthUpload}
            className="block w-full text-sm border border-gray-300 rounded p-1"
            disabled={isProcessingCurrentMonth}
          />
          {isProcessingCurrentMonth && (
            <div className="mt-1">
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-1 bg-blue-500 rounded-full" 
                  style={{ width: `${progressCurrentMonth}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Processing: {progressCurrentMonth}%</p>
            </div>
          )}
          {resultCurrentMonth && (
            <p className="text-xs text-green-600 mt-1">✓ Processed {resultCurrentMonth.transactions?.length || 0} transactions</p>
          )}
          {errorCurrentMonth && (
            <p className="text-xs text-red-600 mt-1">Error: {errorCurrentMonth}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm mb-1 font-medium">Previous Month Transactions</label>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handlePreviousMonthUpload}
            className="block w-full text-sm border border-gray-300 rounded p-1"
            disabled={isProcessingPreviousMonth}
          />
          {isProcessingPreviousMonth && (
            <div className="mt-1">
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-1 bg-blue-500 rounded-full" 
                  style={{ width: `${progressPreviousMonth}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Processing: {progressPreviousMonth}%</p>
            </div>
          )}
          {resultPreviousMonth && (
            <p className="text-xs text-green-600 mt-1">✓ Processed {resultPreviousMonth.transactions?.length || 0} transactions</p>
          )}
          {errorPreviousMonth && (
            <p className="text-xs text-red-600 mt-1">Error: {errorPreviousMonth}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm mb-1 font-medium">Budget</label>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleBudgetUpload}
            className="block w-full text-sm border border-gray-300 rounded p-1"
            disabled={isProcessingBudget}
          />
          {isProcessingBudget && (
            <div className="mt-1">
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-1 bg-blue-500 rounded-full" 
                  style={{ width: `${progressBudget}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Processing: {progressBudget}%</p>
            </div>
          )}
          {resultBudget && (
            <p className="text-xs text-green-600 mt-1">✓ Processed budget data</p>
          )}
          {errorBudget && (
            <p className="text-xs text-red-600 mt-1">Error: {errorBudget}</p>
          )}
        </div>
        
        <button
          onClick={generateTips}
          disabled={!isDataReady || isAnyProcessing || loading}
          className={`mt-2 py-2 px-4 rounded-md ${
            isDataReady && !isAnyProcessing && !loading
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? 'Generating Tips...' : 'Generate Savings Tips'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {loading ? (
          <div className="text-center p-4">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-600">Analyzing spending patterns...</p>
          </div>
        ) : tips.length > 0 ? (
          tips.map((tip) => (
            <div key={tip.id} className="rounded-lg border p-3">
              <div className="font-medium text-sm">{tip.category}</div>
              <p className="text-sm mt-1">{tip.tip}</p>
              {tip.potentialSavings && (
                <div className="mt-2 text-green-600 text-xs font-medium">
                  Potential savings: ${tip.potentialSavings.toFixed(2)}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="rounded-lg border p-3">
            <p className="text-sm">No savings tips available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}