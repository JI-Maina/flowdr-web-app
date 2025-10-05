"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "../ui/button";
import { useFlowdrStore } from "@/store/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const OrdersHeader = () => {
  const branches = useFlowdrStore((state) => state.store.branches);
  const [branch, setBranch] = useState("");

  useEffect(() => {
    if (branches.length > 0) {
      setBranch(branches[0].id);
    }
  }, [branches]);

  return (
    <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
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

        <div className="flex gap-2">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Order
          </Button>
        </div>
      </div>
    </header>
  );
};
