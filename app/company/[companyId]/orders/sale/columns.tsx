"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Package, User, Calendar } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { SaleOrder } from "@/types/flowdr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<SaleOrder>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    size: 100,
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="font-mono text-sm font-medium">
          #{order.id.slice(0, 8)}
        </div>
      );
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
        CONFIRMED: { variant: "default", label: "Confirmed" },
        PENDING: { variant: "secondary", label: "Pending" },
        CANCELLED: { variant: "destructive", label: "Cancelled" },
        SHIPPED: { variant: "default", label: "Shipped" },
        DELIVERED: { variant: "default", label: "Delivered" },
        COMPLETED: { variant: "default", label: "Completed" },
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
    id: "client_info",
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => {
      const client = row.original.client;
      return (
        <div className="flex items-center space-x-2 min-w-[150px]">
          <User className="h-4 w-4 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-sm font-medium truncate">
              {client.company_name || client.user.username}
            </span>
            <span className="text-xs text-gray-500 truncate">
              {client.user.email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "amount",
    header: "Amount",
    size: 100,
    cell: ({ row }) => {
      const items = row.original.items;
      const totalAmount = items.reduce((sum, item) => {
        return sum + parseFloat(item.unit_price) * item.quantity;
      }, 0);

      return (
        <div className="text-right font-semibold">
          ${totalAmount.toFixed(2)}
        </div>
      );
    },
  },
  {
    id: "dates",
    header: "Dates",
    size: 140,
    cell: ({ row }) => {
      const order = row.original;
      const requiredDate = new Date(order.required_date);
      const shippedDate = order.shipped_date
        ? new Date(order.shipped_date)
        : null;

      return (
        <div className="flex flex-col space-y-1 text-xs">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3 text-gray-500" />
            <span>Req: {requiredDate.toLocaleDateString()}</span>
          </div>
          {shippedDate && (
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3 text-green-500" />
              <span>Shipped: {shippedDate.toLocaleDateString()}</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "sales_info",
    header: "Sold By",
    size: 120,
    cell: ({ row }) => {
      const soldBy = row.original.sold_by;
      return (
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium">{soldBy.username}</span>
          <span className="text-xs text-gray-500 capitalize">
            {soldBy.role}
          </span>
        </div>
      );
    },
  },
  {
    id: "items_summary",
    header: "Items",
    size: 120,
    cell: ({ row }) => {
      const items = row.original.items;
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

      return (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2 flex-1">
            <Package className="h-4 w-4 text-gray-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{items.length} items</span>
              <span className="text-xs text-gray-500">
                {totalItems} total qty
              </span>
            </div>
          </div>

          <ViewItemsButton order={row.original} />
        </div>
      );
    },
  },
];

const ViewItemsButton = ({ order }: { order: SaleOrder }) => {
  const router = useRouter();
  const path = usePathname();

  return (
    <Button
      size="sm"
      variant="outline"
      className="shrink-0 h-8 px-2"
      onClick={() => router.push(`${path}/${order.branch}-${order.id}`)}
    >
      View
    </Button>
  );
};
