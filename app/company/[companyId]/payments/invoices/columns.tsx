"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Invoice } from "@/types/flowdr";
import { Badge } from "@/components/ui/badge";
import { useFlowdrStore } from "@/store/store";
import { PaymentModal } from "@/components/orders/modals/payment-modal";
import { ReceiptModal } from "@/components/orders/modals/receipt-modal";

export const invoiceColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoice_number",
    header: "Invoice #",
    cell: ({ row }) => {
      return (
        <div className="font-medium text-blue-600">
          {row.getValue("invoice_number")}
        </div>
      );
    },
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => {
      const dueDate = new Date(row.getValue("due_date"));
      return (
        <div className="font-medium">
          {dueDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const getStatusVariant = (status: string) => {
        switch (status) {
          case "ISSUED":
            return "secondary";
          case "PAID":
            return "default";
          case "OVERDUE":
            return "destructive";
          case "PENDING":
            return "outline";
          default:
            return "secondary";
        }
      };

      return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
    },
  },
  {
    accessorKey: "total_amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const invoice = row.original;
      const balance = invoice.balance;
      const isPaid = balance <= 0;
      const hasPartialPayment = (invoice.total_paid || 0) > 0 && balance > 0;

      return (
        <div
          className={`font-semibold ${
            isPaid
              ? "text-green-600"
              : hasPartialPayment
              ? "text-orange-600"
              : "text-red-600"
          }`}
        >
          ${balance.toFixed(2)}
          {isPaid && (
            <div className="text-xs text-green-500 font-normal">
              Paid in full
            </div>
          )}
          {hasPartialPayment && (
            <div className="text-xs text-orange-500 font-normal">
              Partial payment
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.getValue("items") as any[];
      return (
        <div className="text-sm text-muted-foreground">
          {items?.length || 0} item{items?.length !== 1 ? "s" : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("created_at"));
      return (
        <div className="text-sm text-muted-foreground">
          {createdAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const invoice = row.original;

      return <ActionButtons invoice={invoice} />;
    },
  },
];

const ActionButtons = ({ invoice }: { invoice: Invoice }) => {
  const companyId = useFlowdrStore.getState().store.user?.companyId;

  const isPaid = invoice.status === "PAID";

  return (
    <div className="flex items-center gap-2">
      {/* View Button */}
      {/* <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Navigate to bill detail page
              
              if (companyId) {
                const router = useRouter();
                router.push(`/company/${companyId}/payments/bills/${bill.id}`);
              }
            }}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View bill</span>
          </Button> */}

      {/* Pay Button - Only show if balance remains */}
      {isPaid ? (
        <ReceiptModal invoice={invoice} />
      ) : (
        <PaymentModal invoice={invoice} companyId={companyId} />
      )}
    </div>
  );
};
