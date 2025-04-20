"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Upload, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGroqTransactionProcessing } from "@/lib/groq-api";
import { useTransactionStore } from "@/lib/stores/transaction-store"; // We'll create this next

export default function SetupPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const { processCSV, isProcessing, progress, error } = useGroqTransactionProcessing();
  const setTransactions = useTransactionStore(state => state.setTransactions);
  const setAnalysis = useTransactionStore(state => state.setAnalysis);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      const result = await processCSV(file);
      
      if (result) {
        // Store processed transactions in global state
        setTransactions(result.transactions);
        setAnalysis(result.analysis);
        
        // Navigate to dashboard after processing completes
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      }
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link href="/" className="flex items-center font-semibold">
          <PiggyBank className="h-6 w-6 mr-2" />
          <span>MyBudgetAI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
            Dashboard
          </Link>
          <Link href="/transactions" className="text-sm font-medium hover:underline underline-offset-4">
            Transactions
          </Link>
          <Link href="/goals" className="text-sm font-medium hover:underline underline-offset-4">
            Goals
          </Link>
          <Link href="/stocks" className="text-sm font-medium hover:underline underline-offset-4">
            Stocks
          </Link>
          <Link href="/chat" className="text-sm font-medium hover:underline underline-offset-4">
            AI Advisor
          </Link>
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Login
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Set Up Your Account</CardTitle>
            <CardDescription>
              Import your transaction data to get started with MyBudgetAI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Upload Transaction CSV</h3>
                <p className="text-sm text-gray-500">
                  Upload your bank transaction CSV file to analyze your spending patterns
                </p>
                <div 
                  className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                  onClick={() => document.getElementById('csv-file')?.click()}
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium">
                    {file ? file.name : "Click to select a CSV file"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports CSV files from most major banks
                  </p>
                  <input 
                    id="csv-file" 
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing your transactions with AI</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-gray-500">
                    Our AI is analyzing your transactions and preparing insights
                  </p>
                </div>
              )}

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-800">
                    Error: {error}
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <Button 
                  onClick={handleUpload} 
                  disabled={!file || isProcessing}
                  className="gap-1.5"
                >
                  {isProcessing ? "Processing..." : "Upload and Continue"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 MyBudgetAI. All rights reserved.</p>
      </footer>
    </div>
  );
}