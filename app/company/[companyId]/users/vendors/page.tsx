import { Button } from "@/components/ui/button";
import { fetchVendors } from "@/data/users/get-users";
import { Plus } from "lucide-react";
import React, { FC } from "react";
import { VendorsTable } from "./data-table";
import { vendorColumns } from "./columns";

type VendorProps = {
  params: Promise<{ companyId: string }>;
};

const VendorsPage: FC<VendorProps> = async ({ params }) => {
  const { companyId } = await params;

  const data = await fetchVendors(companyId);

  return (
    <main className="container mx-auto p-4 space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
          <p className="text-muted-foreground">Vendors</p>
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

      <VendorsTable data={data} columns={vendorColumns} />
    </main>
  );
};

export default VendorsPage;
