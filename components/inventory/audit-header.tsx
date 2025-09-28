"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Hash, MapPin, Package } from "lucide-react";

import { Inventory } from "@/types/flowdr";
import { Card, CardContent } from "@/components/ui/card";
import { useFlowdrStore } from "@/store/store";

const AuditHeader = ({ inventory }: { inventory: Inventory }) => {
  const branches = useFlowdrStore((state) => state.store.branches);

  const branchName = branches.find((b) => b.id === inventory.branch)?.name;

  const getStockStatus = (units: number, reorderLevel: number) => {
    if (units === 0)
      return { status: "Out of Stock", variant: "destructive" as const };
    if (units <= reorderLevel)
      return { status: "Low Stock", variant: "destructive" as const };
    if (units <= reorderLevel * 2)
      return { status: "Adequate", variant: "secondary" as const };
    return { status: "In Stock", variant: "default" as const };
  };

  const stockStatus = getStockStatus(
    inventory.units_available,
    inventory.reorder_level
  );

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="px-4">
        {/* Product Header */}
        <div className="flex items-start space-x-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            {inventory?.product?.image ? (
              <img
                src={inventory.product?.image}
                alt={inventory.product.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <Package className="h-6 w-6 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h1 className="text-xl font-semibold truncate">
                {inventory.product.name}
              </h1>
              <Badge variant={inventory.is_active ? "default" : "secondary"}>
                {inventory.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Hash className="h-3 w-3" />
                <span>{inventory.product.sku_number}</span>
              </div>

              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{branchName}</span>
              </div>

              {inventory.product.description && (
                <span className="truncate">
                  {inventory.product.description}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stock Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-4">
          {/* Current Stock */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span
                className={`text-2xl font-bold ${
                  inventory.units_available <= inventory.reorder_level
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {inventory.units_available}
              </span>
              {inventory.units_available <= inventory.reorder_level && (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div>
              <div className="text-sm font-medium">Current Stock</div>
              <div className="text-xs text-muted-foreground">
                Units available
              </div>
            </div>
          </div>

          {/* Reorder Level */}
          <div className="flex items-center space-x-3">
            <div className="text-xl font-bold text-gray-900">
              {inventory.reorder_level}
            </div>
            <div>
              <div className="text-sm font-medium">Reorder Level</div>
              <div className="text-xs text-muted-foreground">
                Alert threshold
              </div>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-3">
            <Badge variant={stockStatus.variant} className="text-sm px-3 py-1">
              {stockStatus.status}
            </Badge>
            <div>
              <div className="text-sm font-medium">Stock Status</div>
              <div className="text-xs text-muted-foreground">Current state</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditHeader;
