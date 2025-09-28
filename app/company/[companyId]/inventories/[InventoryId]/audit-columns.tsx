"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InventoryAudit } from "@/types/flowdr";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown, Minus } from "lucide-react";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const auditColumns: ColumnDef<InventoryAudit>[] = [
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.original.action;

      const getActionConfig = (action: string) => {
        switch (action) {
          case "STOCK_IN":
            return {
              label: "Stock In",
              variant: "default" as const,
              icon: ArrowDown,
              color: "text-green-600",
            };
          case "STOCK_OUT":
            return {
              label: "Stock Out",
              variant: "destructive" as const,
              icon: ArrowUp,
              color: "text-red-600",
            };
          case "ADJUSTMENT":
            return {
              label: "Adjustment",
              variant: "secondary" as const,
              icon: Minus,
              color: "text-blue-600",
            };
          default:
            return {
              label: action,
              variant: "outline" as const,
              icon: Minus,
              color: "text-gray-600",
            };
        }
      };

      const config = getActionConfig(action);
      const IconComponent = config.icon;

      return (
        <div className="flex items-center space-x-2">
          <IconComponent className={`h-4 w-4 ${config.color}`} />
          <Badge variant={config.variant} className="capitalize">
            {config.label}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity Change",
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      const isPositive = quantity > 0;

      return (
        <div className="flex items-center space-x-2">
          <span
            className={`font-semibold ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {quantity}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "previous_quantity",
    header: "Previous Qty",
    cell: ({ row }) => (
      <div className="text-sm font-medium">
        {row.original.previous_quantity}
      </div>
    ),
  },
  {
    accessorKey: "new_quantity",
    header: "New Qty",
    cell: ({ row }) => (
      <div className="text-sm font-bold">{row.original.new_quantity}</div>
    ),
  },
  {
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.original.reference}</div>
    ),
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
      <div className="max-w-[200px]">
        <p className="text-sm truncate" title={row.original.notes}>
          {row.original.notes || "—"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "created_by",
    header: "Performed By",
    cell: ({ row }) => (
      <div className="text-sm">
        <div className="font-medium">
          {row.original.inventory.created_by.username}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Date & Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.original.created_at)}
      </div>
    ),
  },
];
