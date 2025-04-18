"use client"

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export function SpendingChart() {
  const data = [
    {
      name: "Jan",
      Groceries: 400,
      Dining: 240,
      Entertainment: 180,
      Utilities: 320,
      Transportation: 280,
    },
    {
      name: "Feb",
      Groceries: 380,
      Dining: 220,
      Entertainment: 220,
      Utilities: 310,
      Transportation: 290,
    },
    {
      name: "Mar",
      Groceries: 420,
      Dining: 280,
      Entertainment: 250,
      Utilities: 330,
      Transportation: 270,
    },
    {
      name: "Apr",
      Groceries: 390,
      Dining: 290,
      Entertainment: 210,
      Utilities: 340,
      Transportation: 260,
    },
    {
      name: "May",
      Groceries: 410,
      Dining: 310,
      Entertainment: 190,
      Utilities: 320,
      Transportation: 250,
    },
    {
      name: "Jun",
      Groceries: 430,
      Dining: 270,
      Entertainment: 230,
      Utilities: 310,
      Transportation: 240,
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Groceries" fill="#8884d8" />
        <Bar dataKey="Dining" fill="#82ca9d" />
        <Bar dataKey="Entertainment" fill="#ffc658" />
        <Bar dataKey="Utilities" fill="#ff8042" />
        <Bar dataKey="Transportation" fill="#0088fe" />
      </BarChart>
    </ResponsiveContainer>
  )
}
