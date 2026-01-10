import React, { FC } from "react";

import { Button } from "@/components/ui/button";
import { fetchClients } from "@/data/users/get-users";
import BackButton from "@/components/common/back-button";
import { fetchSaleOrder } from "@/data/orders/get-orders";
import { EditSaleOrderForm } from "@/components/orders/sale/edit-sale-order";
import { fetchProducts } from "@/data/product/get-products";

type EditProps = {
  params: Promise<{ orderId: string; companyId: string }>;
};

const EditSaleOrderPage: FC<EditProps> = async ({ params }) => {
  const { orderId, companyId } = await params;

  const branchId = orderId.split("-")[0];
  const id = orderId.split("-")[1];

  const [order, clients, products] = await Promise.all([
    fetchSaleOrder(branchId, id),
    fetchClients(companyId),
    fetchProducts(companyId),
  ]);

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BackButton />

          <div>
            <h1 className="text-3xl font-bold">Sale Order</h1>
            <p className="text-gray-500">Edit Sale order</p>
          </div>
        </div>

        <div className="">
          <Button>Add client</Button>
        </div>
      </header>

      <section>
        <EditSaleOrderForm
          companyId={companyId}
          order={order}
          clients={clients}
          products={products}
        />
      </section>
    </main>
  );
};

export default EditSaleOrderPage;
