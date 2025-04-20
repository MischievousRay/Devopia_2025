// components/spending-chart.tsx
"use client";

import { useTransactionStore } from "@/lib/stores/transaction-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const colors = [
  "#2563eb", // Blue
  "#16a34a", // Green
  "#d97706", // Amber
  "#dc2626", // Red
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#db2777", // Pink
  "#65a30d", // Lime
  "#f59e0b", // Yellow
  "#64748b", // Slate
];

export function SpendingChart() {
  const { analysis } = useTransactionStore();
  const { categoryBreakdown } = analysis;

  const chartData = categoryBreakdown.map((item, index) => ({
    ...item,
    color: colors[index % colors.length],
  }));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>Your spending distribution across different categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Bar dataKey="amount" name="Amount">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}