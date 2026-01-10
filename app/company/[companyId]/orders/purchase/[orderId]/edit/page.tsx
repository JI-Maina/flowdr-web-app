import React, { FC } from "react";

import { Button } from "@/components/ui/button";
import { fetchVendors } from "@/data/users/get-users";
import BackButton from "@/components/common/back-button";
import { fetchPurchaseOrder } from "@/data/orders/get-orders";
import { EditPurchaseOrderForm } from "@/components/orders/purchase/edit-purchase-order";
import { fetchProducts } from "@/data/product/get-products";

type EditProps = {
  params: Promise<{ companyId: string; orderId: string }>;
};

const EditPurchaseOrderPage: FC<EditProps> = async ({ params }) => {
  const { companyId, orderId } = await params;

  const [order, vendors, products] = await Promise.all([
    fetchPurchaseOrder(companyId, orderId),
    fetchVendors(companyId),
    fetchProducts(companyId),
  ]);

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BackButton />

          <div>
            <h1 className="text-3xl font-bold">Purchase Order</h1>
            <p className="text-gray-500">Edit purchase order</p>
          </div>
        </div>

        <div className="">
          <Button>Add vendor</Button>
        </div>
      </header>

      <section>
        <EditPurchaseOrderForm
          companyId={companyId}
          order={order}
          vendors={vendors}
          products={products}
        />
      </section>
    </main>
  );
};

export default EditPurchaseOrderPage;
