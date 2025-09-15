import { fetchCategories } from "@/data/category/get-category";
import React from "react";

const ProductsPage = async () => {
  const data = await fetchCategories("okMSEmbaW7");

  console.log(data);

  return <div>ProductsPage</div>;
};

export default ProductsPage;
