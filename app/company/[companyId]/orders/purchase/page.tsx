import React, { FC } from "react";

import { columns } from "./columns";
import { PurchaseTable } from "./purchase-table";
import { OrderButton } from "@/components/orders/btns/order-btn";
import { fetchPurchaseOrders } from "@/data/orders/get-orders";

type PurchaseProps = {
  params: Promise<{ companyId: string }>;
};

const PurchaseOrderPage: FC<PurchaseProps> = async ({ params }) => {
  const { companyId } = await params;

  const data = await fetchPurchaseOrders(companyId);

  return (
    <main className="container mx-auto p-6 space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
          <p className="text-muted-foreground">
            Streamline your procurement process and vendor relationships
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            <OrderButton />
          </div>
        </div>
      </header>

      <PurchaseTable data={data} columns={columns} />
    </main>
  );
};

export default PurchaseOrderPage;
