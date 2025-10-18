import React, { FC } from "react";

import BackButton from "@/components/common/back-button";
import { fetchRequisitionOrder } from "@/data/orders/get-orders";
import EditRequisitionOrderForm from "@/components/orders/requisition/edit-requisition";

type EditProps = {
  params: Promise<{ orderId: string; companyId: string }>;
};

const EditRequisitionOrderPage: FC<EditProps> = async ({ params }) => {
  const { companyId, orderId } = await params;

  const order = await fetchRequisitionOrder(companyId, orderId);

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BackButton />

          <div>
            <h1 className="text-3xl font-bold">Requisition Order</h1>
            <p className="text-gray-500">Edit requisition order</p>
          </div>
        </div>
      </header>

      <section>
        <EditRequisitionOrderForm companyId={companyId} order={order} />
      </section>
    </main>
  );
};

export default EditRequisitionOrderPage;
