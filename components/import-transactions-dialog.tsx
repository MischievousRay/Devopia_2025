"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { v4 as uuidv4 } from "uuid"

interface ImportTransactionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (transactions: any[]) => void
}

export function ImportTransactionsDialog({ open, onOpenChange, onImport }: ImportTransactionsDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleImport = () => {
    // In a real app, we would parse the CSV/file data
    // For demo purposes, we'll create some mock transactions
    const mockImportedTransactions = [
      {
        id: uuidv4(),
        date: new Date().toISOString(),
        description: "Imported Transaction 1",
        amount: -45.99,
        category: "Groceries",
      },
      {
        id: uuidv4(),
        date: new Date().toISOString(),
        description: "Imported Transaction 2",
        amount: -32.5,
        category: "Dining",
      },
      {
        id: uuidv4(),
        date: new Date().toISOString(),
        description: "Imported Transaction 3",
        amount: 1200.0,
        category: "Income",
      },
    ]

    onImport(mockImportedTransactions)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Import Transactions</DialogTitle>
          <DialogDescription>Import your transactions from a CSV file or paste data directly.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">Upload File</TabsTrigger>
            <TabsTrigger value="paste">Paste Data</TabsTrigger>
          </TabsList>
          <TabsContent value="file" className="space-y-4 py-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="file">CSV File</Label>
              <Input id="file" type="file" accept=".csv" onChange={handleFileChange} />
              <p className="text-sm text-muted-foreground mt-1">
                Upload a CSV file from your bank or financial institution.
              </p>
            </div>
            <div className="grid w-full gap-1.5">
              <Label>Supported Banks</Label>
              <div className="flex flex-wrap gap-2">
                <div className="rounded-md bg-muted px-2 py-1 text-xs">Chase</div>
                <div className="rounded-md bg-muted px-2 py-1 text-xs">Bank of America</div>
                <div className="rounded-md bg-muted px-2 py-1 text-xs">Wells Fargo</div>
                <div className="rounded-md bg-muted px-2 py-1 text-xs">Citi</div>
                <div className="rounded-md bg-muted px-2 py-1 text-xs">Capital One</div>
                <div className="rounded-md bg-muted px-2 py-1 text-xs">+ More</div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="paste" className="space-y-4 py-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="csv">CSV Data</Label>
              <Textarea
                id="csv"
                placeholder="Paste your CSV data here..."
                className="min-h-[200px]"
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">Format: Date,Description,Amount,Category</p>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport}>Import Transactions</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
