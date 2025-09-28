"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";

import { columns } from "./columns";
import { useFlowdrStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { InventoryTable } from "./inventory-table";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchInventories } from "@/data/inventory/get-inventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const InventoryPage = () => {
  const branches = useFlowdrStore((state) => state.store.branches);
  const [branch, setBranch] = useState("");

  useEffect(() => {
    if (branches.length > 0) {
      setBranch(branches[0].id);
    }
  }, [branches]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["inventory", branch],
    queryFn: () => fetchInventories(branch),
    enabled: !!branch,
  });

  // Calculate inventory stats
  const inventoryStats = {
    totalItems: data?.length || 0,
    lowStock:
      data?.filter((item) => item.units_available <= item.reorder_level)
        .length || 0,
    outOfStock: data?.filter((item) => item.units_available === 0).length || 0,
    activeItems: data?.filter((item) => item.is_active).length || 0,
  };

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-destructive text-lg font-semibold mb-2">
                Failed to load inventory
              </div>
              <p className="text-muted-foreground mb-4">
                There was an error loading your inventory data.
              </p>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Inventory Management
          </h1>
          <p className="text-muted-foreground">
            Track and manage inventory across all branches
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div> */}
        </div>
      </header>

      {/* Stats Cards */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="px-4">
            <div className="flex flex-row items-center justify-between ">
              <div className="text-sm font-medium">Total Items</div>
              <Package className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {inventoryStats.totalItems}
              </div>
              <p className="text-xs text-muted-foreground">In this branche</p>
            </div>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {inventoryStats.lowStock}
              </div>
              <p className="text-xs text-muted-foreground">Needs reordering</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Out of Stock
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {inventoryStats.outOfStock}
              </div>
              <p className="text-xs text-muted-foreground">
                Urgent attention needed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Items
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {inventoryStats.activeItems}
              </div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-12 mb-1" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Data Table Section */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : (
        <InventoryTable columns={columns} data={data || []} />
      )}
    </main>
  );
};

export default InventoryPage;
