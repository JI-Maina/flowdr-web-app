"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, Package } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Inventory } from "@/types/flowdr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const columns: ColumnDef<Inventory>[] = [
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      const inventory = row.original;

      return (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
            {inventory.product.image ? (
              <img
                src={inventory.product.image}
                alt={inventory.product.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <Package className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">{inventory.product.name}</div>
            <div className="text-sm text-muted-foreground truncate">
              {inventory.product.sku_number}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    cell: ({ row }) => {
      const inventory = row.original;

      return (
        <div>
          <div className="font-medium">{inventory.created_by.username}</div>
          <div className="text-sm text-gray-500">
            {formatDate(inventory.created_at)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "units_available",
    header: "Stock Level",
    cell: ({ row }) => {
      const item = row.original;
      const isLowStock = item.units_available <= item.reorder_level;
      const isOutOfStock = item.units_available === 0;

      return (
        <div className="flex items-center space-x-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span
                className={`font-semibold ${
                  isOutOfStock
                    ? "text-red-600"
                    : isLowStock
                    ? "text-orange-600"
                    : "text-green-600"
                }`}
              >
                {item.units_available}
              </span>
              {isLowStock && (
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Reorder at {item.reorder_level}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.is_active;

      return (
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={
            isActive
              ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
          }
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.original.updated_at)}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const inventory = row.original;
      const router = useRouter();
      const path = usePathname();

      return (
        <Button
          variant={"outline"}
          onClick={() => router.push(`${path}/${inventory.id}`)}
        >
          Audit
        </Button>
      );
    },
  },
];
