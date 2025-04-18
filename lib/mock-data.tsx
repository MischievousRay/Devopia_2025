
import React from 'react';
import { Coffee, CreditCard, Home, ShoppingCart, Utensils, Zap } from 'lucide-react';
import { v4 as uuidv4 } from "uuid";

export const mockTransactions = [
  {
    id: uuidv4(),
    date: "2025-04-15",
    description: "Grocery Store",
    amount: -85.42,
    category: "Groceries",
  },
  {
    id: uuidv4(),
    date: "2025-04-14",
    description: "Restaurant Payment",
    amount: -45.8,
    category: "Dining",
  },
  {
    id: uuidv4(),
    date: "2025-04-13",
    description: "Coffee Shop",
    amount: -4.5,
    category: "Coffee",
  },
  {
    id: uuidv4(),
    date: "2025-04-12",
    description: "Electric Bill",
    amount: -110.25,
    category: "Utilities",
  },
  {
    id: uuidv4(),
    date: "2025-04-10",
    description: "Paycheck",
    amount: 2450.0,
    category: "Income",
  },
  {
    id: uuidv4(),
    date: "2025-04-08",
    description: "Gas Station",
    amount: -45.3,
    category: "Transportation",
  },
  {
    id: uuidv4(),
    date: "2025-04-05",
    description: "Rent Payment",
    amount: -1200.0,
    category: "Rent",
  },
  {
    id: uuidv4(),
    date: "2025-04-03",
    description: "Online Shopping",
    amount: -65.99,
    category: "Shopping",
  },
  {
    id: uuidv4(),
    date: "2025-04-01",
    description: "Streaming Service",
    amount: -14.99,
    category: "Entertainment",
  },
  {
    id: uuidv4(),
    date: "2025-03-30",
    description: "Bonus Payment",
    amount: 500.0,
    category: "Income",
  },
]

export const mockCategories = [
  {
    id: 1,
    name: "Groceries",
    percentage: 25,
    color: "#8884d8",
    icon: <ShoppingCart className="h-5 w-5 text-purple-500" />,
  },
  {
    id: 2,
    name: "Dining",
    percentage: 18,
    color: "#82ca9d",
    icon: <Utensils className="h-5 w-5 text-green-500" />,
  },
  {
    id: 3,
    name: "Utilities",
    percentage: 15,
    color: "#ffc658",
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
  },
  {
    id: 4,
    name: "Rent",
    percentage: 30,
    color: "#ff8042",
    icon: <Home className="h-5 w-5 text-orange-500" />,
  },
  {
    id: 5,
    name: "Coffee",
    percentage: 5,
    color: "#0088fe",
    icon: <Coffee className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 6,
    name: "Other",
    percentage: 7,
    color: "#00C49F",
    icon: <CreditCard className="h-5 w-5 text-teal-500" />,
  },
]
