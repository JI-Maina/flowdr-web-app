import { OrdersHeader } from "@/components/orders/orders-header";
import PurchaseOrders from "@/components/orders/purchase-orders";
import { Button } from "@/components/ui/button";
import { fetchPurchaseOrders } from "@/data/orders/get-orders";
import { Plus } from "lucide-react";
import React, { FC } from "react";
import { PurchaseTable } from "./purchase-table";
import { columns } from "./columns";

type PurchaseProps = {
  params: Promise<{ companyId: string }>;
};

const PurchaseOrderPage: FC<PurchaseProps> = async ({ params }) => {
  const { companyId } = await params;

  const data = await fetchPurchaseOrders(companyId);

  console.log(data);

  return (
    <main className="container mx-auto p-6 space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
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

      <PurchaseTable data={data} columns={columns} />
    </main>
  );
};

export default PurchaseOrderPage;
