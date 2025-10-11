import React, { FC } from "react";

import { columns } from "./columns";
import { RequisitionTable } from "./orders-table";
import { OrderButton } from "@/components/orders/order-btn";
import { fetchRequisitionOrders } from "@/data/orders/get-orders";

type RequisitionProps = {
  params: Promise<{ companyId: string }>;
};

const RequisitionPage: FC<RequisitionProps> = async ({ params }) => {
  const { companyId } = await params;

  const data = await fetchRequisitionOrders(companyId);

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
            <OrderButton />
          </div>
        </div>
      </header>

      <RequisitionTable data={data} columns={columns} />
    </main>
  );
};

export default RequisitionPage;
