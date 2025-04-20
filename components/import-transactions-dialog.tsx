// components/import-transactions-dialog.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload } from "lucide-react";
import { useGroqTransactionProcessing } from "@/lib/groq-api";

interface ImportTransactionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (file: File) => void;
}

export function ImportTransactionsDialog({ open, onOpenChange, onImport }: ImportTransactionsDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const { isProcessing, progress, error } = useGroqTransactionProcessing();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    onImport(file);
  };

  const handleClose = () => {
    setFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Transactions</DialogTitle>
          <DialogDescription>
            Upload a CSV file with your financial transactions to import into MyBudgetAI
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div 
            className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
            onClick={() => document.getElementById('import-csv-file')?.click()}
          >
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm font-medium">
              {file ? file.name : "Click to select a CSV file"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports CSV files from most major banks
            </p>
            <input 
              id="import-csv-file" 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing with AI</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">
                Error: {error}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!file || isProcessing}>
              {isProcessing ? "Processing..." : "Import"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}