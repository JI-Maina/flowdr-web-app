"use client";

import React, { FC } from "react";
import { Truck } from "lucide-react";

import { useFlowdrStore } from "@/store/store";
import { RequisitionOrder } from "@/types/flowdr";

export const TransferCard: FC<{ order: RequisitionOrder }> = ({ order }) => {
  const branches = useFlowdrStore((state) => state.store.branches);

  const source = branches.find((b) => b.id === order.source_branch)?.name;
  const destination = branches.find(
    (b) => b.id === order.destination_branch
  )?.name;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-muted-foreground">TRANSFER</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-medium">From</div>
            <div className="text-lg font-bold">{source}</div>
          </div>
          <Truck className="h-5 w-5 text-muted-foreground" />
          <div className="text-center">
            <div className="text-sm font-medium">To</div>
            <div className="text-lg font-bold">{destination}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
