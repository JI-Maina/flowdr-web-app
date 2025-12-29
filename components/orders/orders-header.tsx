"use client";

import { useEffect } from "react";

import { OrderButton } from "./btns/order-btn";
import { useFlowdrStore } from "@/store/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const OrdersHeader = () => {
  const { store, updateBranchId } = useFlowdrStore((state) => state);
  const { branchId, branches } = store;

  useEffect(() => {
    // If branchId is empty and branches exist, set to first branch
    if (!branchId && branches.length > 0) {
      updateBranchId(branches[0].id);
    }
  }, [branchId, branches, updateBranchId]);

  return (
    <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Sale Orders</h1>
        <p className="text-muted-foreground">
          Track and manage inventory across all branches
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select
          value={branchId || branches[0]?.id || ""}
          onValueChange={(value) => updateBranchId(value)}
        >
          <SelectTrigger className="w-full sm:w-50">
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

        <div className="flex gap-2">
          <OrderButton />
        </div>
      </div>
    </header>
  );
};
