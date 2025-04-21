"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Edit, PiggyBank, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import VirtualPet from "@/components/virtual-pet"
import { useTransactionStore } from "@/lib/stores/transaction-store"

export default function GoalsPage() {
  const { transactions } = useTransactionStore()
  const [totalSavings, setTotalSavings] = useState(0)
  const [overallProgress, setOverallProgress] = useState(0)
  
  // Calculate total income and expenses from transactions
  const totalIncome = transactions?.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) || 0
  const totalExpenses = transactions?.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0
  const totalBalance = totalIncome - totalExpenses

  // Calculate current savings as 15% of total balance (from dashboard logic)
  useEffect(() => {
    const calculatedSavings = totalBalance * 0.15
    setTotalSavings(parseFloat(Math.max(0, calculatedSavings).toFixed(2)))
  }, [totalBalance])

  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Emergency Fund",
      target: 5000,
      current: 0,
      allocation: 50, // 50% of total savings
      deadline: "2025-12-31",
      description: "Build a 3-month emergency fund for unexpected expenses",
    },
    {
      id: 2,
      name: "New Laptop",
      target: 1200,
      current: 0,
      allocation: 30, // 30% of total savings
      deadline: "2025-06-30",
      description: "Save for a new development laptop",
    },
    {
      id: 3,
      name: "Vacation",
      target: 3000,
      current: 0,
      allocation: 20, // 20% of total savings
      deadline: "2025-08-15",
      description: "Summer vacation fund",
    },
  ])

  // Distribute savings among goals based on allocation percentages
  useEffect(() => {
    if (totalSavings > 0) {
      const updatedGoals = goals.map(goal => {
        const allocated = (totalSavings * goal.allocation) / 100
        return {
          ...goal,
          current: parseFloat(allocated.toFixed(2))
        }
      })
      
      setGoals(updatedGoals)
      
      // Calculate overall progress across all goals
      const totalTarget = updatedGoals.reduce((sum, goal) => sum + goal.target, 0)
      const totalCurrent = updatedGoals.reduce((sum, goal) => sum + goal.current, 0)
      const calculatedProgress = (totalCurrent / totalTarget) * 100
      setOverallProgress(Math.min(100, calculatedProgress))
    }
  }, [totalSavings])

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
          <h2 className="text-3xl font-bold tracking-tight">Savings Goals</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Total Savings: ${totalSavings}
            </Button>
            <Button size="sm" className="h-9 gap-1">
              <Plus className="h-4 w-4" />
              <span>New Goal</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100

            return (
              <Card key={goal.id}>
                <CardHeader>
                  <CardTitle>{goal.name}</CardTitle>
                  <CardDescription>{goal.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        ${goal.current} of ${goal.target}
                      </span>
                      <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Target date: {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                    <span className="font-medium">
                      {goal.allocation}% allocation
                    </span>
                  </div>
                  {progress >= 100 && (
                    <div className="flex items-center text-sm text-green-500 font-medium">
                      Goal achieved! Your pet has earned a reward.
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            )
          })}

          <Card className="flex flex-col items-center justify-center p-6 border-dashed">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 rounded-full bg-primary/10">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Add New Goal</h3>
              <p className="text-sm text-muted-foreground">Create a new savings goal and track your progress</p>
              <Button className="mt-2">
                <Plus className="h-4 w-4 mr-1" />
                Create Goal
              </Button>
            </div>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Savings Pet</CardTitle>
            <CardDescription>Meet your virtual pet that grows as you achieve your savings goals</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <VirtualPet savingsProgress={overallProgress} />
            <div className="mt-6 text-center">
              <h3 className="text-lg font-medium">
                {overallProgress < 25 ? "Level 1 Savings Buddy" : 
                 overallProgress < 50 ? "Level 2 Savings Buddy" :
                 overallProgress < 75 ? "Level 3 Savings Buddy" : "Level 4 Savings Master"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your pet grows with your overall savings progress ({overallProgress.toFixed(0)}%).
                Complete more goals to unlock special accessories.
              </p>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-medium">{overallProgress.toFixed(0)}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <Button variant="outline">View Accessories</Button>
                <Button>
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Set New Goal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}