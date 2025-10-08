"use client";

import { useQuery } from "@tanstack/react-query";

import { columns } from "./columns";
import { SaleOrder } from "@/types/flowdr";
import { SaleOrderTable } from "./sale-table";
import { useFlowdrStore } from "@/store/store";
import { fetchSaleOrders } from "@/data/orders/get-orders";

const SaleOrdersWrapper = () => {
  const { branchId } = useFlowdrStore((state) => state.store);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["saleOrders", branchId],
    queryFn: () => fetchSaleOrders(branchId),
    enabled: !!branchId,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <SaleOrderTable data={data as SaleOrder[]} columns={columns} />;
};

export default SaleOrdersWrapper;
