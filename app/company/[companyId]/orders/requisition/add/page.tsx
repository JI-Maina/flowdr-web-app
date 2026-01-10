import React, { FC } from "react";

import { fetchVendors } from "@/data/users/get-users";
import BackButton from "@/components/common/back-button";
import { fetchProducts } from "@/data/product/get-products";
import { CreateRequisitionOrderForm } from "@/components/orders/requisition/create-requisition";

type Props = {
  params: Promise<{ companyId: string }>;
};

const AddRequisitionPage: FC<Props> = async ({ params }) => {
  const { companyId } = await params;

  const [vendors, products] = await Promise.all([
    fetchVendors(companyId),
    fetchProducts(companyId),
  ]);

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BackButton />

          <div>
            <h1 className="text-3xl font-bold">Requisition Order</h1>
            <p className="text-gray-500">Add new requisition order</p>
          </div>
        </div>
      </header>

      <section>
        <CreateRequisitionOrderForm
          companyId={companyId}
          vendors={vendors}
          products={products}
        />
      </section>
    </main>
  );
};

export default AddRequisitionPage;
