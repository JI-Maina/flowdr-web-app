import BackButton from "@/components/common/back-button";
import { CreateSaleOrderForm } from "@/components/orders/sale/sale-purchase-form";
import { Button } from "@/components/ui/button";
import { fetchClients } from "@/data/users/get-users";
import React, { FC } from "react";

type AddProps = {
  params: Promise<{ companyId: string }>;
};

const AddSaleOrderPage: FC<AddProps> = async ({ params }) => {
  const { companyId } = await params;

  const clients = await fetchClients(companyId);

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
          <Button>Add client</Button>
        </div>
      </header>

      <section>
        <CreateSaleOrderForm clients={clients} companyId={companyId} />
      </section>
    </main>
  );
};

export default AddSaleOrderPage;
