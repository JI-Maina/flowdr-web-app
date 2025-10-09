import React, { FC } from "react";
import BackButton from "@/components/common/back-button";
import { CreatePurchaseOrderForm } from "@/components/orders/purchase/purchase-create-form";
import { fetchVendors } from "@/data/users/get-users";
import { Button } from "@/components/ui/button";

type AddProps = {
  params: Promise<{ companyId: string }>;
};

const AddPurchaseOrderPage: FC<AddProps> = async ({ params }) => {
  const { companyId } = await params;

  const data = await fetchVendors(companyId);

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BackButton />

          <div>
            <h1 className="text-3xl font-bold">Purchase Order</h1>
            <p className="text-gray-500">Add new purchase order</p>
          </div>
        </div>

        <div className="">
          <Button>Add vendor</Button>
        </div>
      </header>

      <section>
        <CreatePurchaseOrderForm companyId={companyId} vendors={data} />
      </section>
    </main>
  );
};

export default AddPurchaseOrderPage;
