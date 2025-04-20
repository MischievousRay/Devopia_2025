// pages/api/savings/tips.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { transactionData } = req.body;
    
    if (!transactionData) {
      return res.status(400).json({ message: 'Transaction data is required' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      console.error('GROQ_API_KEY is not defined in environment variables');
      return res.status(500).json({ message: 'API key configuration error' });
    }
    
    // Create a prompt for the Groq API
    const prompt = `
      Based on the following financial data, provide personalized savings tips:
      
      Current month spending by category:
      ${JSON.stringify(transactionData.monthlyCategorySpending, null, 2)}
      
      Previous month spending by category:
      ${JSON.stringify(transactionData.previousMonthSpending, null, 2)}
      
      User's budget by category:
      ${JSON.stringify(transactionData.userBudget, null, 2)}
      
      Analyze this data and provide 4-5 specific, actionable savings tips.
      Each tip should include:
      1. The category it applies to
      2. A specific observation about spending in that category (increase/decrease, over budget, etc.)
      3. A concrete recommendation to save money
      4. An estimated potential monthly savings amount when applicable
      
      Return the results in JSON format with an array of tips objects, each containing:
      - id: A unique string identifier (use simple sequencing like "tip-1", "tip-2", etc.)
      - category: The spending category
      - tip: The savings recommendation
      - potentialSavings: Estimated dollar amount that could be saved (optional)
    `;

    console.log('Sending request to Groq API...');

    // Call to Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are a financial advisor assistant that analyzes spending patterns and provides personalized savings tips."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      return res.status(response.status).json({ 
        message: 'Error from Groq API', 
        error: errorText 
      });
    }

    const data = await response.json();
    console.log('Groq API response:', JSON.stringify(data));
    
    // Extract the content from the Groq response
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      return res.status(500).json({ message: 'Invalid response from Groq API' });
    }
    
    const jsonResponse = data.choices[0].message.content;
    
    try {
      const parsedResponse = JSON.parse(jsonResponse);
      
      // Return the processed tips
      return res.status(200).json({ 
        tips: parsedResponse.tips || []
      });
    } catch (parseError) {
      console.error('Failed to parse JSON response from Groq:', parseError);
      return res.status(500).json({ 
        message: 'Failed to parse response from Groq API',
        error: parseError instanceof Error ? parseError.message : 'Unknown error',
        rawResponse: jsonResponse
      });
    }
  } catch (error) {
    console.error('Error processing savings tips:', error);
    return res.status(500).json({ 
      message: 'Failed to generate savings tips',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}