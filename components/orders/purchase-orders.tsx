"use client";

const SaleOrders = ({ branchId }: { branchId: string }) => {
  // const { data, isLoading, isError, refetch } = useQuery({
  //     queryKey: ["inventory", branch],
  //     queryFn: () => fetchInventories(branch),
  //     enabled: !!branch,
  //   });

  console.log(branchId);

  return <section>SaleOrders</section>;
};

export default SaleOrders;
