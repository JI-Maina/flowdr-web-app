import { Button } from "@/components/ui/button";
import { fetchRequisitionOrders } from "@/data/orders/get-orders";
import { Plus } from "lucide-react";
import React, { FC } from "react";
import { columns } from "./columns";
import { RequisitionTable } from "./orders-table";

type RequisitionProps = {
  params: Promise<{ companyId: string }>;
};

const RequisitionPage: FC<RequisitionProps> = async ({ params }) => {
  const { companyId } = await params;

  const data = await fetchRequisitionOrders(companyId);

  console.log(data);

  return (
    <main className="container mx-auto p-6 space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Requisition Orders
          </h1>
          <p className="text-muted-foreground">
            Track and manage inventory across all branches
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Order
            </Button>
          </div>
        </div>
      </header>

      <RequisitionTable data={data} columns={columns} />
    </main>
  );
};

export default RequisitionPage;
