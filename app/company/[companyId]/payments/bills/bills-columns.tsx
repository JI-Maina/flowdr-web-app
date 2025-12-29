"use client";

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

import { Bill } from "@/types/flowdr";
import { Badge } from "@/components/ui/badge";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
import { useFlowdrStore } from "@/store/store";
import { VoucherModal } from "@/components/orders/modals/voucher-modal";

export const billColumns: ColumnDef<Bill>[] = [
  {
    accessorKey: "id",
    header: "Bill ID",
    cell: ({ row }) => {
      const bill = row.original;
      return (
        <div className="font-medium text-sm">
          #{bill.id.slice(-6).toUpperCase()}
        </div>
      );
    },
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
    cell: ({ row }) => {
      const bill = row.original;
      const vendorName = bill.order.vendor.user.username;
      const vendorCompany = bill.order.vendor.vendor_company;

      return (
        <div className="flex flex-col">
          <span className="font-medium">{vendorName}</span>
          {vendorCompany && (
            <span className="text-xs text-muted-foreground">
              {vendorCompany}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "order.id",
    header: "Purchase Order",
    cell: ({ row }) => {
      const bill = row.original;
      return (
        <div className="text-sm">
          PO#{bill.order.id.slice(-6).toUpperCase()}
        </div>
      );
    },
  },
  {
    accessorKey: "amount_due",
    header: "Total Amount",
    cell: ({ row }) => {
      const bill = row.original;
      return (
        <div className="font-semibold text-right">
          ${parseFloat(bill.amount_due).toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const bill = row.original;
      const amountDue = parseFloat(bill.amount_due);
      const totalPaid = bill.total_paid || 0;
      const balance =
        bill.balance !== undefined
          ? parseFloat(bill.balance.toString())
          : amountDue - totalPaid;

      const isPaid = balance <= 0;
      const isOverpaid = balance < 0;
      const hasPartialPayment = totalPaid > 0 && balance > 0 && !isPaid;

      return (
        <div
          className={`text-right font-semibold ${
            isOverpaid
              ? "text-purple-600"
              : isPaid
              ? "text-green-600"
              : hasPartialPayment
              ? "text-orange-600"
              : "text-red-600"
          }`}
        >
          ${Math.abs(balance).toFixed(2)}
          {isOverpaid && (
            <div className="text-xs text-purple-500 font-normal">Overpaid</div>
          )}
          {isPaid && !isOverpaid && (
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
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => {
      const bill = row.original;
      const dueDate = new Date(bill.due_date);
      const today = new Date();
      const amountDue = parseFloat(bill.amount_due);
      const totalPaid = bill.total_paid || 0;
      const balance =
        bill.balance !== undefined
          ? parseFloat(bill.balance.toString())
          : amountDue - totalPaid;
      const isOverdue = dueDate < today && balance > 0;

      return (
        <div
          className={`text-sm ${isOverdue ? "text-red-600 font-medium" : ""}`}
        >
          {format(dueDate, "MMM dd, yyyy")}
          {isOverdue && <div className="text-xs text-red-500">Overdue</div>}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const bill = row.original;
      const status = bill.status;
      const amountDue = parseFloat(bill.amount_due);
      const totalPaid = bill.total_paid || 0;
      const balance =
        bill.balance !== undefined
          ? parseFloat(bill.balance.toString())
          : amountDue - totalPaid;

      // Auto-calculate status based on balance if needed
      let effectiveStatus = status;
      if (balance < 0) {
        effectiveStatus = "OVERPAID";
      } else if (balance === 0 && totalPaid > 0) {
        effectiveStatus = "PAID";
      } else if (balance > 0 && totalPaid > 0) {
        effectiveStatus = "PARTIALLY_PAID";
      }

      const statusConfig = {
        DRAFT: { variant: "secondary" as const, label: "Draft" },
        OPEN: { variant: "outline" as const, label: "Open" },
        SENT: { variant: "outline" as const, label: "Sent" },
        OVERDUE: { variant: "destructive" as const, label: "Overdue" },
        PARTIALLY_PAID: { variant: "default" as const, label: "Partial" },
        PAID: { variant: "success" as const, label: "Paid" },
        OVERPAID: { variant: "default" as const, label: "Overpaid" },
        CANCELLED: { variant: "destructive" as const, label: "Cancelled" },
      };

      const config = statusConfig[
        effectiveStatus as keyof typeof statusConfig
      ] || {
        variant: "outline",
        label: effectiveStatus,
      };

      return (
        <Badge variant={config.variant as any} className="capitalize">
          {config.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "order.status",
    header: "Order Status",
    cell: ({ row }) => {
      const bill = row.original;
      const orderStatus = bill.order.status;

      const orderStatusConfig = {
        DRAFT: { variant: "secondary" as const },
        PENDING: { variant: "outline" as const },
        APPROVED: { variant: "default" as const },
        COMPLETED: { variant: "success" as const },
        CANCELLED: { variant: "destructive" as const },
      };

      const config = orderStatusConfig[
        orderStatus as keyof typeof orderStatusConfig
      ] || {
        variant: "outline",
      };

      return (
        <Badge variant={config.variant as any} className="capitalize text-xs">
          {orderStatus.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const bill = row.original;

      return <ActionButtons bill={bill} />;
    },
  },
];

const ActionButtons = ({ bill }: { bill: Bill }) => {
  const companyId = useFlowdrStore.getState().store.user?.companyId;

  const amountDue = parseFloat(bill.amount_due);
  const totalPaid = bill.total_paid || 0;
  const balance =
    bill.balance !== undefined
      ? parseFloat(bill.balance.toString())
      : amountDue - totalPaid;
  const isFullyPaid = balance <= 0;

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

      {/* Pay Button - Only show if balance remains (not fully paid or overpaid) */}
      {!isFullyPaid && <VoucherModal bill={bill} companyId={companyId} />}
    </div>
  );
};
