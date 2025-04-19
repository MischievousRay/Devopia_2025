"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"

interface StockChartProps {
  symbol: string
}

export function StockChart({ symbol }: StockChartProps) {
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "3M" | "1Y">("1M")

  // Generate mock data based on symbol and timeframe
  const generateMockData = () => {
    const data = []
    const date = new Date()
    let price = 100 + Math.random() * 100 // Random starting price

    const points =
      timeframe === "1D" ? 24 : timeframe === "1W" ? 7 : timeframe === "1M" ? 30 : timeframe === "3M" ? 90 : 365

    const interval = timeframe === "1D" ? "hour" : "day"

    for (let i = points; i >= 0; i--) {
      const change = (Math.random() - 0.48) * 2 // Slightly biased upward
      price = Math.max(price + change, 1) // Ensure price doesn't go below 1

      let dateStr
      if (interval === "hour") {
        dateStr = new Date(date.getTime() - i * 60 * 60 * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      } else {
        dateStr = new Date(date.getTime() - i * 24 * 60 * 60 * 1000).toLocaleDateString([], {
          month: "short",
          day: "numeric",
        })
      }

      data.push({
        date: dateStr,
        price: Number.parseFloat(price.toFixed(2)),
      })
    }

    return data
  }

  const [chartData, setChartData] = useState(generateMockData())

  useEffect(() => {
    setChartData(generateMockData())
  }, [timeframe, symbol])

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <Button variant={timeframe === "1D" ? "default" : "outline"} size="sm" onClick={() => setTimeframe("1D")}>
          1D
        </Button>
        <Button variant={timeframe === "1W" ? "default" : "outline"} size="sm" onClick={() => setTimeframe("1W")}>
          1W
        </Button>
        <Button variant={timeframe === "1M" ? "default" : "outline"} size="sm" onClick={() => setTimeframe("1M")}>
          1M
        </Button>
        <Button variant={timeframe === "3M" ? "default" : "outline"} size="sm" onClick={() => setTimeframe("3M")}>
          3M
        </Button>
        <Button variant={timeframe === "1Y" ? "default" : "outline"} size="sm" onClick={() => setTimeframe("1Y")}>
          1Y
        </Button>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickCount={5} />
            <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
            <Tooltip formatter={(value) => [`$${value}`, "Price"]} labelFormatter={(label) => `Date: ${label}`} />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} name={`${symbol} Price`} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
