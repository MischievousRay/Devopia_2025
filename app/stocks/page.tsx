"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PiggyBank, Search, Plus, Trash2, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { StockChart } from "@/components/stock-chart"

interface Stock {
  symbol: string
  companyName: string
  price: number
  change: number
  changePercent: number
  prediction: {
    nextDay: number
    nextWeek: number
    nextMonth: number
  }
}

export default function StocksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [watchlist, setWatchlist] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)

  // Mock data for demonstration
  const mockStocks: Stock[] = [
    {
      symbol: "AAPL",
      companyName: "Apple Inc.",
      price: 182.63,
      change: 1.25,
      changePercent: 0.69,
      prediction: {
        nextDay: 184.12,
        nextWeek: 187.45,
        nextMonth: 195.2,
      },
    },
    {
      symbol: "MSFT",
      companyName: "Microsoft Corporation",
      price: 415.32,
      change: -2.18,
      changePercent: -0.52,
      prediction: {
        nextDay: 413.75,
        nextWeek: 420.1,
        nextMonth: 430.5,
      },
    },
    {
      symbol: "GOOGL",
      companyName: "Alphabet Inc.",
      price: 175.98,
      change: 3.42,
      changePercent: 1.98,
      prediction: {
        nextDay: 178.25,
        nextWeek: 180.5,
        nextMonth: 185.75,
      },
    },
    {
      symbol: "AMZN",
      companyName: "Amazon.com, Inc.",
      price: 185.07,
      change: 0.87,
      changePercent: 0.47,
      prediction: {
        nextDay: 186.2,
        nextWeek: 188.75,
        nextMonth: 195.3,
      },
    },
  ]

  useEffect(() => {
    // In a real app, fetch watchlist from Supabase
    // For now, use mock data
    setWatchlist(mockStocks)
    setLoading(false)
    if (mockStocks.length > 0) {
      setSelectedStock(mockStocks[0])
    }
  }, [])

  const handleSearch = () => {
    if (!searchQuery) return

    // In a real app, search for stocks via API
    // For demo, just check if it's in our mock data
    const found = mockStocks.find(
      (stock) =>
        stock.symbol.toLowerCase() === searchQuery.toLowerCase() ||
        stock.companyName.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    if (found && !watchlist.some((stock) => stock.symbol === found.symbol)) {
      setWatchlist([...watchlist, found])
    }
  }

  const handleRemoveStock = (symbol: string) => {
    const updatedWatchlist = watchlist.filter((stock) => stock.symbol !== symbol)
    setWatchlist(updatedWatchlist)

    if (selectedStock?.symbol === symbol) {
      setSelectedStock(updatedWatchlist.length > 0 ? updatedWatchlist[0] : null)
    }
  }

  const handleRefreshPrices = () => {
    // In a real app, this would fetch fresh data
    // For demo, just add small random changes
    setWatchlist(
      watchlist.map((stock) => ({
        ...stock,
        price: stock.price + (Math.random() * 2 - 1),
        change: Math.random() * 2 - 1,
        changePercent: (Math.random() * 2 - 1) / 2,
      })),
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <PiggyBank className="h-6 w-6" />
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
          <Link href="/profile" className="text-sm font-medium hover:underline underline-offset-4">
            Profile
          </Link>
        </nav>
      </header>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Stock Predictions</h2>
          <Button size="sm" className="h-9 gap-1" onClick={handleRefreshPrices}>
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Watchlist</CardTitle>
                <CardDescription>Track and analyze stocks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search stocks..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button size="sm" onClick={handleSearch}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {watchlist.map((stock) => (
                    <div
                      key={stock.symbol}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                        selectedStock?.symbol === stock.symbol ? "bg-muted" : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedStock(stock)}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-xs text-muted-foreground">{stock.companyName}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${stock.price.toFixed(2)}</div>
                        <div
                          className={`text-xs flex items-center ${
                            stock.change >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {stock.change >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {stock.change >= 0 ? "+" : ""}
                          {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveStock(stock.symbol)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                  {watchlist.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No stocks in watchlist. Search and add stocks above.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-4">
            {selectedStock ? (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{selectedStock.symbol}</CardTitle>
                        <CardDescription>{selectedStock.companyName}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${selectedStock.price.toFixed(2)}</div>
                        <div
                          className={`text-sm flex items-center justify-end ${
                            selectedStock.change >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {selectedStock.change >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          {selectedStock.change >= 0 ? "+" : ""}
                          {selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <StockChart symbol={selectedStock.symbol} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>AI Price Predictions</CardTitle>
                    <CardDescription>Forecasted prices based on historical data and market trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-sm font-medium text-muted-foreground">Next Day</div>
                        <div className="text-2xl font-bold">${selectedStock.prediction.nextDay.toFixed(2)}</div>
                        <div
                          className={`text-sm ${
                            selectedStock.prediction.nextDay > selectedStock.price ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {selectedStock.prediction.nextDay > selectedStock.price ? "+" : ""}
                          {(
                            ((selectedStock.prediction.nextDay - selectedStock.price) / selectedStock.price) *
                            100
                          ).toFixed(2)}
                          %
                        </div>
                      </div>
                      <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-sm font-medium text-muted-foreground">Next Week</div>
                        <div className="text-2xl font-bold">${selectedStock.prediction.nextWeek.toFixed(2)}</div>
                        <div
                          className={`text-sm ${
                            selectedStock.prediction.nextWeek > selectedStock.price ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {selectedStock.prediction.nextWeek > selectedStock.price ? "+" : ""}
                          {(
                            ((selectedStock.prediction.nextWeek - selectedStock.price) / selectedStock.price) *
                            100
                          ).toFixed(2)}
                          %
                        </div>
                      </div>
                      <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-sm font-medium text-muted-foreground">Next Month</div>
                        <div className="text-2xl font-bold">${selectedStock.prediction.nextMonth.toFixed(2)}</div>
                        <div
                          className={`text-sm ${
                            selectedStock.prediction.nextMonth > selectedStock.price ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {selectedStock.prediction.nextMonth > selectedStock.price ? "+" : ""}
                          {(
                            ((selectedStock.prediction.nextMonth - selectedStock.price) / selectedStock.price) *
                            100
                          ).toFixed(2)}
                          %
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 text-sm text-muted-foreground">
                      <p>
                        <strong>Disclaimer:</strong> These predictions are based on historical data and AI analysis.
                        They should not be considered as financial advice. Always do your own research before making
                        investment decisions.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant="outline">
                      View Detailed Analysis
                    </Button>
                  </CardFooter>
                </Card>
              </>
            ) : (
              <Card className="h-[500px] flex items-center justify-center">
                <CardContent>
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Stock Selected</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Select a stock from your watchlist or search for a new one to view details and predictions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
