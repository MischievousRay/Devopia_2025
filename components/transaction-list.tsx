import { ArrowDownLeft, ArrowUpRight, Coffee, CreditCard, Home, ShoppingCart, Utensils, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  category: string
}

interface TransactionListProps {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "groceries":
        return <ShoppingCart className="h-4 w-4" />
      case "dining":
        return <Utensils className="h-4 w-4" />
      case "coffee":
        return <Coffee className="h-4 w-4" />
      case "utilities":
        return <Zap className="h-4 w-4" />
      case "rent":
        return <Home className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              transaction.amount > 0 ? "bg-green-100" : "bg-red-100",
            )}
          >
            {transaction.amount > 0 ? (
              <ArrowDownLeft className="h-5 w-5 text-green-600" />
            ) : (
              <ArrowUpRight className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div className="ml-4 flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.description}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{new Date(transaction.date).toLocaleDateString()}</span>
              <Badge variant="outline" className="ml-2 flex items-center gap-1">
                {getCategoryIcon(transaction.category)}
                {transaction.category}
              </Badge>
            </div>
          </div>
          <div className={cn("font-medium", transaction.amount > 0 ? "text-green-600" : "text-red-600")}>
            {transaction.amount > 0 ? "+" : ""}
            {transaction.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}
