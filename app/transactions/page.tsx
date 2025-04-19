"use client"

import { useState } from "react"
import { ArrowUpDown, ChevronDown, Download, Filter, PiggyBank, Plus, Search, Upload } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TransactionList } from "@/components/transaction-list"
import { mockTransactions } from "@/lib/mock-data"
import { ImportTransactionsDialog } from "@/components/import-transactions-dialog"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(mockTransactions)
  const [searchQuery, setSearchQuery] = useState("")
  const [showImportDialog, setShowImportDialog] = useState(false)

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-1" onClick={() => setShowImportDialog(true)}>
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

        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>View and manage all your financial transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline-block">Filter</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>All Transactions</DropdownMenuItem>
                    <DropdownMenuItem>Income</DropdownMenuItem>
                    <DropdownMenuItem>Expenses</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Categories</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Groceries</DropdownMenuItem>
                    <DropdownMenuItem>Dining</DropdownMenuItem>
                    <DropdownMenuItem>Entertainment</DropdownMenuItem>
                    <DropdownMenuItem>Utilities</DropdownMenuItem>
                    <DropdownMenuItem>Transportation</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1">
                    <ArrowUpDown className="h-4 w-4" />
                    <span className="hidden sm:inline-block">Sort</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Date (Newest First)</DropdownMenuItem>
                  <DropdownMenuItem>Date (Oldest First)</DropdownMenuItem>
                  <DropdownMenuItem>Amount (High to Low)</DropdownMenuItem>
                  <DropdownMenuItem>Amount (Low to High)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <TransactionList transactions={filteredTransactions} />
          </CardContent>
        </Card>
      </div>

      <ImportTransactionsDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImport={(newTransactions) => {
          setTransactions([...newTransactions, ...transactions])
          setShowImportDialog(false)
        }}
      />
    </div>
  )
}
