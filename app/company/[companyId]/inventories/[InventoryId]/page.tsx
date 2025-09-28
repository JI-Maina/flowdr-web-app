import React from "react";

import { AuditTable } from "./audit-table";
import AuditHeader from "@/components/inventory/audit-header";
import { fetchInventoryAudit } from "@/data/inventory/get-inventory";

type AuditProps = {
  params: Promise<{ InventoryId: string }>;
};

const InventoryAuditPage = async ({ params }: AuditProps) => {
  const { InventoryId } = await params;

  const data = await fetchInventoryAudit(InventoryId);

  const inventory = data && data[0].inventory;

  return (
    <main className="space-y-6">
      <header>
        <AuditHeader inventory={inventory} />
      </header>

      <section>
        <AuditTable data={data} />
      </section>
    </main>
  );
};

export default InventoryAuditPage;
