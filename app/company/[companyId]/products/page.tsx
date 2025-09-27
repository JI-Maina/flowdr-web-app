import { Suspense } from "react";

import { fetchProducts } from "@/data/product/get-products";
import { fetchBranches } from "@/data/branches/get-branches";
import { fetchCategories } from "@/data/category/get-category";
import ProductsTable from "../../../../components/products/products-table";

type Props = {
  params: { companyId: string };
};

const ProductsPage = async ({ params }: Props) => {
  const { companyId } = await params;

  const [productsData, categoriesData, branchesData] = await Promise.all([
    fetchProducts(companyId),
    fetchCategories(companyId),
    fetchBranches(companyId),
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsTable
        productsData={productsData}
        categoriesData={categoriesData}
        branchesData={branchesData}
      />
    </Suspense>
  );
};

export default ProductsPage;
