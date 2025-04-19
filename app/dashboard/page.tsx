"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUpRight, Download, PiggyBank, Plus, TrendingDown, TrendingUp, Upload, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionList } from "@/components/transaction-list"
import { SpendingChart } from "@/components/spending-chart"
import VirtualPet from "@/components/virtual-pet"
import { SavingsTips } from "@/components/savings-tips"
import { mockTransactions, mockCategories } from "@/lib/mock-data"

export default function Dashboard() {
  const [transactions, setTransactions] = useState(mockTransactions)
  const [categories, setCategories] = useState(mockCategories)
  const [savingsGoal, setSavingsGoal] = useState(500)
  const [currentSavings, setCurrentSavings] = useState(20)
  const [savingsProgress, setSavingsProgress] = useState(0)

  useEffect(() => {
    // Calculate savings progress percentage
    setSavingsProgress((currentSavings / savingsGoal) * 100)
  }, [currentSavings, savingsGoal])

  // Calculate total income and expenses
  const totalIncome = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)

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
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline-block">Import</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline-block">Export</span>
            </Button>
            <Button size="sm" className="h-9 gap-1">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline-block">Add Transaction</span>
            </Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="pet">Virtual Pet</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${(totalIncome - totalExpenses).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Income</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">+4.3% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">-2.5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Savings Goal</CardTitle>
                  <PiggyBank className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${currentSavings} / ${savingsGoal}
                  </div>
                  <Progress value={savingsProgress} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">{savingsProgress.toFixed(0)}% of monthly goal</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Spending Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <SpendingChart />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest financial activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionList transactions={transactions.slice(0, 5)} />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Link href="/transactions" className="flex items-center justify-center gap-1">
                      View All Transactions
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Savings Tips</CardTitle>
                  <CardDescription>AI-powered recommendations based on your spending habits</CardDescription>
                </CardHeader>
                <CardContent>
                  <SavingsTips />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top Spending Categories</CardTitle>
                  <CardDescription>Where most of your money goes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.slice(0, 4).map((category) => (
                      <div key={category.id} className="flex items-center">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                          style={{ backgroundColor: category.color + "20" }}
                        >
                          {category.icon}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{category.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Progress value={category.percentage} className="h-2 flex-1 mr-2" />
                            <div className="w-12 text-right">{category.percentage}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Monthly Spending Trends</CardTitle>
                  <CardDescription>Track how your spending changes over time</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <SpendingChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                  <CardDescription>Breakdown of your expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                          style={{ backgroundColor: category.color + "20" }}
                        >
                          {category.icon}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{category.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Progress value={category.percentage} className="h-2 flex-1 mr-2" />
                            <div className="w-12 text-right">{category.percentage}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="pet" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Savings Pet</CardTitle>
                  <CardDescription>Meet your virtual pet that grows as you save money</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <VirtualPet savingsProgress={savingsProgress} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Savings Progress</CardTitle>
                  <CardDescription>Track your progress towards your monthly savings goal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Monthly Goal: ${savingsGoal}</span>
                        <span className="text-sm font-medium">Current: ${currentSavings}</span>
                      </div>
                      <Progress value={savingsProgress} className="h-2 mt-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {savingsProgress.toFixed(0)}% of monthly goal
                      </p>
                    </div>
                    <div className="pt-4">
                      <h4 className="text-sm font-medium mb-2">Pet Rewards</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 rounded-full mr-2 ${savingsProgress >= 25 ? "bg-green-500" : "bg-gray-300"}`}
                          ></div>
                          <span className="text-sm">25% - New Hat Accessory</span>
                        </div>
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 rounded-full mr-2 ${savingsProgress >= 50 ? "bg-green-500" : "bg-gray-300"}`}
                          ></div>
                          <span className="text-sm">50% - Pet Grows Bigger</span>
                        </div>
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 rounded-full mr-2 ${savingsProgress >= 75 ? "bg-green-500" : "bg-gray-300"}`}
                          ></div>
                          <span className="text-sm">75% - New Color Variant</span>
                        </div>
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 rounded-full mr-2 ${savingsProgress >= 100 ? "bg-green-500" : "bg-gray-300"}`}
                          ></div>
                          <span className="text-sm">100% - Special Animation & Badge</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Adjust Savings Goal</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
