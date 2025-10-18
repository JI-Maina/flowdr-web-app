import { FC } from "react";

import { BillsTable } from "./bills-table";
import { fetchBills } from "@/data/bills/get-bills";
import { billColumns } from "./bills-columns";
import { fetchAccounts } from "@/data/accounts/get-accounts";

type BillProps = {
  params: Promise<{ companyId: string }>;
};

const BillsPage: FC<BillProps> = async ({ params }) => {
  const { companyId } = await params;

  const bills = await fetchBills(companyId);

  return (
    <main className="container mx-auto p-6 space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Bills</h1>
          <p className="text-muted-foreground">
            Streamline your procurement process and vendor relationships
          </p>
        </div>
      </header>

      <section>
        <BillsTable data={bills} columns={billColumns} />
      </section>
    </main>
  );
};

export default BillsPage;
