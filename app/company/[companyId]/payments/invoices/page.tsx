"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Invoice } from "@/types/flowdr";
import { invoiceColumns } from "./columns";
import { useFlowdrStore } from "@/store/store";
import { InvoiceDataTable } from "./invoice-table";
import { fetchInvoices } from "@/data/bills/get-bills";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const InvoicesPage = () => {
  const branches = useFlowdrStore((state) => state.store.branches);
  const [branch, setBranch] = useState("");

  useEffect(() => {
    if (branches.length > 0) {
      setBranch(branches[0].id);
    }
  }, [branches]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["invoices", branch],
    queryFn: () => fetchInvoices(branch),
    enabled: !!branch,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <main className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Invoice Management
          </h1>
          <p className="text-muted-foreground">
            Track and manage invoice across all branches
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
        </div>
      </header>

      <section>
        <InvoiceDataTable data={data as Invoice[]} columns={invoiceColumns} />
      </section>
    </main>
  );
};

export default InvoicesPage;
