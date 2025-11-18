"use client";

import { useFlowdrStore } from "@/store/store";
import { Branch } from "@/types/flowdr";
import { useEffect } from "react";

export const DashboardOverview = ({ branches }: { branches: Branch[] }) => {
  const { updateBranches } = useFlowdrStore((state) => state);

  useEffect(() => {
    updateBranches(branches);
  }, [branches, updateBranches]);

  return (
    <div className="flex items-center justify-center h-96 text-4xl">
      Company Metrics updating soon
    </div>
  );
};
