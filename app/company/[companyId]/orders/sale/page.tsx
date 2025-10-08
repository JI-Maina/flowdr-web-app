import React from "react";

import { OrdersHeader } from "@/components/orders/orders-header";
import SaleOrdersWrapper from "@/app/company/[companyId]/orders/sale/sale-orders";

const SaleOrderPage = () => {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <OrdersHeader />

      <SaleOrdersWrapper />
    </main>
  );
};

export default SaleOrderPage;
