import React, { FC } from "react";

import { fetchClients } from "@/data/users/get-users";
import BackButton from "@/components/common/back-button";
import { fetchProducts } from "@/data/product/get-products";
import CreateClientsModal from "@/components/users/create-clients";
import { CreateSaleOrderForm } from "@/components/orders/sale/create-sale-order";

type AddProps = {
  params: Promise<{ companyId: string }>;
};

const AddSaleOrderPage: FC<AddProps> = async ({ params }) => {
  const { companyId } = await params;

  const [clients, products] = await Promise.all([
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
            <p className="text-gray-500">Add new purchase order</p>
          </div>
        </div>

        <div className="">
          <CreateClientsModal />
        </div>
      </header>

      <section>
        <CreateSaleOrderForm
          clients={clients}
          companyId={companyId}
          products={products}
        />
      </section>
    </main>
  );
};

export default AddSaleOrderPage;
