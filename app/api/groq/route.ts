import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    
    // Your Groq API key should be stored in an environment variable
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not set in environment variables' },
        { status: 500 }
      );
    }

    // Add system message as the first message
    const systemMessage = {
      role: "system",
      content: "You are a helpful AI financial advisor. Provide concise, accurate financial advice based on best practices. Avoid making specific investment recommendations for individual stocks. Focus on educational content and general financial principles. Be friendly and empathetic while maintaining professionalism."
    };
    
    const messageHistory = [systemMessage, ...messages];

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192', // You can change this to the model you prefer
        messages: messageHistory,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch from Groq API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ message: data.choices[0].message });
  } catch (error) {
    console.error('Error in Groq API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}