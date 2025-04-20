// app/api/transactions/analyze/route.ts
import { NextResponse } from 'next/server';
import { GroqAPI } from '@/lib/groq-api-client';

// Initialize the Groq client
const groqAPI = new GroqAPI(process.env.GROQ_API_KEY as string);

export async function POST(request: Request) {
  try {
    const { csvData } = await request.json();
    
    if (!csvData) {
      return NextResponse.json(
        { error: 'CSV data is required' },
        { status: 400 }
      );
    }

    // Process the CSV data using Groq
    const result = await groqAPI.analyzeTransactions(csvData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing CSV with Groq:', error);
    return NextResponse.json(
      { error: 'Failed to process transaction data' },
      { status: 500 }
    );
  }
}