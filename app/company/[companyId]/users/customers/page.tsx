import React, { FC } from "react";

import { columns } from "./columns";
import { ClientTable } from "./client-table";
import { fetchClients } from "@/data/users/get-users";
import CreateClientsModal from "@/components/users/create-clients";

type CustomerProps = {
  params: Promise<{ companyId: string }>;
};

const CustomersPage: FC<CustomerProps> = async ({ params }) => {
  const { companyId } = await params;

  const data = await fetchClients(companyId);

  return (
    <main className="container mx-auto p-4 space-y-6">
      <header className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Clients across all branches</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <CreateClientsModal />
        </div>
      </header>

      <ClientTable data={data} columns={columns} />
    </main>
  );
};

export default CustomersPage;
