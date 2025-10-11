import React, { FC } from "react";

import BackButton from "@/components/common/back-button";
import { CreateRequisitionOrderForm } from "@/components/orders/requisition/create-requisition";

type Props = {
  params: Promise<{ companyId: string }>;
};

const AddRequisitionPage: FC<Props> = async ({ params }) => {
  const { companyId } = await params;

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
        <CreateRequisitionOrderForm companyId={companyId} vendors={[]} />
      </section>
    </main>
  );
};

export default AddRequisitionPage;
