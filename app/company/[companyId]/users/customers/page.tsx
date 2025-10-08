import { Button } from "@/components/ui/button";
import { fetchClients } from "@/data/users/get-users";
import { Plus } from "lucide-react";
import React, { FC } from "react";
import { ClientTable } from "./client-table";
import { columns } from "./columns";

type CustomerProps = {
  params: Promise<{ companyId: string }>;
};

const CustomersPage: FC<CustomerProps> = async ({ params }) => {
  const { companyId } = await params;

  const data = await fetchClients(companyId);

  console.log(data);

  return (
    <main className="container mx-auto p-4 space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Clients across all branches</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>
      </header>

      <ClientTable data={data} columns={columns} />
    </main>
  );
};

export default CustomersPage;
