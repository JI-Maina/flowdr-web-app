import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { fetchInvoiceReceipt } from "@/data/payments/get-pay";
import { useFlowdrStore } from "@/store/store";
import { Invoice } from "@/types/flowdr";
import { useQuery } from "@tanstack/react-query";
import { EyeIcon, FileText, Receipt, ExternalLink } from "lucide-react";
import React, { FC, useState } from "react";

export const ReceiptModal: FC<{ invoice: Invoice }> = ({ invoice }) => {
  const [open, setOpen] = useState(false);
  const branchId = useFlowdrStore((state) => state.store.branchId);

  const { data, isLoading } = useQuery({
    queryKey: ["receipt", invoice.id],
    queryFn: () => fetchInvoiceReceipt(branchId, invoice.id),
    enabled: !!invoice.id && open,
  });

  const receipt = data?.[0];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount));
  };

  const handleViewFullReceipt = () => {
    console.log("View full receipt:", receipt?.receipt_number);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <EyeIcon className="h-4 w-4 mr-2" />
          Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-green-600" />
            <DialogTitle className="text-lg">Receipt Summary</DialogTitle>
          </div>
          <DialogDescription>
            Quick view for invoice #{invoice.invoice_number}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : receipt ? (
          <div className="space-y-4">
            {/* Compact Receipt Header */}
            <Card className="p-0">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Receipt #</p>
                      <p className="font-semibold text-sm">
                        {receipt.receipt_number}
                      </p>
                    </div>
                    <Badge
                      variant={
                        receipt.status === "FINAL" ? "default" : "secondary"
                      }
                    >
                      {receipt.status}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium text-sm">
                        {formatDate(receipt.issued_date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-bold">
                        {formatCurrency(receipt.total_amount)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compact Items Summary */}
            <Card className="p-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4" />
                  <h3 className="font-semibold text-sm">Items Covered</h3>
                </div>
                <div className="space-y-2">
                  {receipt.items.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="truncate max-w-[180px]">
                        Item {item.invoice_item.slice(0, 8)}...
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.amount_covered)}
                      </span>
                    </div>
                  ))}
                  {receipt.items.length > 3 && (
                    <div className="text-center text-sm text-muted-foreground pt-1">
                      +{receipt.items.length - 3} more items
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t font-bold text-sm">
                    <span>Total</span>
                    <span>{formatCurrency(receipt.total_amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* View Full Receipt Button */}
            <Button
              onClick={handleViewFullReceipt}
              variant="outline"
              className="w-full gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View Full Receipt
            </Button>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No receipt data found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
