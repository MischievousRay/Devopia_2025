import { GroqAPI } from '../lib/groq-api-client';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Extending the existing types from groq-api.ts
interface SavingTip {
  id: string;
  category: string;
  tip: string;
  potentialSavings?: number;
}

export default function SavingsTips() {
  const [tips, setTips] = useState<SavingTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavingsTips = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Remove the direct API key reference - we'll just call the API endpoint
        // which already has access to the server-side environment variable
        const response = await axios.post('/api/savings/tips', {
          transactionData: {
            // Sample data - in a real app this would come from your state or props
            monthlyCategorySpending: {
              "Dining": 450,
              "Utilities": 230,
              "Entertainment": 180,
              "Groceries": 520,
              "Transportation": 190
            },
            previousMonthSpending: {
              "Dining": 380,
              "Utilities": 210,
              "Entertainment": 150,
              "Groceries": 480,
              "Transportation": 180
            },
            userBudget: {
              "Dining": 400,
              "Utilities": 200,
              "Entertainment": 150,
              "Groceries": 500,
              "Transportation": 200
            }
          }
        });
        
        // Handle the response
        if (response.data && response.data.tips) {
          setTips(response.data.tips);
        } else {
          throw new Error("Invalid response format from API");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching savings tips:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch savings tips");
        setLoading(false);
      }
    };

    fetchSavingsTips();
  }, []);
  return (
    <div className="space-y-4">
      {tips.length > 0 ? (
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
  );
}