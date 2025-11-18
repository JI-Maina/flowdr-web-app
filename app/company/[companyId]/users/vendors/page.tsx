import React, { FC } from "react";

import { vendorColumns } from "./columns";
import { VendorsTable } from "./data-table";
import { fetchVendors } from "@/data/users/get-users";
import CreateVendorModal from "@/components/users/create-vendor-modal";

type VendorProps = {
  params: Promise<{ companyId: string }>;
};

const VendorsPage: FC<VendorProps> = async ({ params }) => {
  const { companyId } = await params;

  const data = await fetchVendors(companyId);

  return (
    <main className="container mx-auto p-4 space-y-6">
      <header className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
          <p className="text-muted-foreground">Vendors</p>
        </div>

        <CreateVendorModal />
      </header>

      <VendorsTable data={data} columns={vendorColumns} />
    </main>
  );
};

export default VendorsPage;
