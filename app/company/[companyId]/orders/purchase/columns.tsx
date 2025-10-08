"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PurchaseOrder } from "@/types/flowdr";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar, User, Building } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export const columns: ColumnDef<PurchaseOrder>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    size: 120,
    cell: ({ row }) => {
      const order = row.original;
      return <div className="font-mono text-sm font-medium">{order.id}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
    cell: ({ row }) => {
      const status = row.original.status;

      type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

      const statusConfig: Record<
        string,
        { variant: BadgeVariant; label: string }
      > = {
        APPROVED: { variant: "default", label: "Approved" },
        PENDING: { variant: "secondary", label: "Pending" },
        REJECTED: { variant: "destructive", label: "Rejected" },
        DELIVERED: { variant: "default", label: "Delivered" },
        CANCELLED: { variant: "outline", label: "Cancelled" },
      };

      const config = statusConfig[status] || {
        variant: "outline",
        label: status,
      };

      return (
        <Badge variant={config.variant} className="capitalize">
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "total_value",
    header: "Amount",
    size: 100,
    cell: ({ row }) => {
      const amount = row.original.total_value;
      return (
        <div className="text-right font-semibold">${amount.toFixed(2)}</div>
      );
    },
  },
  {
    id: "vendor_info",
    accessorKey: "vendor",
    header: "Vendor",
    cell: ({ row }) => {
      const vendor = row.original.vendor;
      return (
        <div className="flex items-center space-x-2 min-w-[120px]">
          <Building className="h-4 w-4 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-sm font-medium truncate">
              {vendor.vendor_company || vendor.user.username}
            </span>
            <span className="text-xs text-gray-500 truncate">
              {vendor.user.email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "personnel",
    header: "Personnel",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex flex-col space-y-1 min-w-[140px]">
          <div className="flex items-center space-x-2">
            <User className="h-3 w-3 text-gray-500" />
            <div className="flex flex-col">
              <span className="text-xs font-medium">Ordered by</span>
              <span className="text-xs text-gray-500 truncate">
                {order.ordered_by.username}
              </span>
            </div>
          </div>
          {order.approved_by && (
            <div className="flex items-center space-x-2">
              <User className="h-3 w-3 text-green-500" />
              <div className="flex flex-col">
                <span className="text-xs font-medium">Approved by</span>
                <span className="text-xs text-gray-500 truncate">
                  {order.approved_by.username}
                </span>
              </div>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "expected_delivery_date",
    header: "Delivery",
    size: 120,
    cell: ({ row }) => {
      const deliveryDate = row.original.expected_delivery_date;
      const today = new Date();
      const delivery = new Date(deliveryDate);
      const isOverdue = delivery < today && row.original.status !== "DELIVERED";

      return (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <div className="flex flex-col">
            <span
              className={`text-sm ${
                isOverdue ? "text-red-600 font-medium" : "text-gray-700"
              }`}
            >
              {new Date(deliveryDate).toLocaleDateString()}
            </span>
            {isOverdue && <span className="text-xs text-red-500">Overdue</span>}
          </div>
        </div>
      );
    },
  },
  {
    id: "items_summary",
    header: "Items",
    size: 120,
    cell: ({ row }) => {
      const order = row.original;
      const items = row.original.items;
      const totalItems = items.reduce(
        (sum, item) => sum + item.order_quantity,
        0
      );
      const deliveredItems = items.reduce(
        (sum, item) => sum + item.delivered_quantity,
        0
      );

      return (
        <div className="flex items-center justify-between w-full space-x-2">
          <div className="flex flex-col flex-1">
            <span className="text-sm font-medium">{items.length} items</span>
            <span className="text-xs text-gray-500">
              {deliveredItems}/{totalItems}
            </span>
          </div>

          <ViewItemsButton order={order} />
        </div>
      );
    },
  },
];

const ViewItemsButton = ({ order }: { order: PurchaseOrder }) => {
  const router = useRouter();
  const path = usePathname();

  return (
    <Button
      size="sm"
      variant="outline"
      className="shrink-0 h-8 px-2"
      onClick={() => router.push(`${path}/${order.id}`)}
    >
      View
    </Button>
  );
};
