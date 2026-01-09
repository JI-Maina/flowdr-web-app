import React from "react";
import { fetchCountries } from "@/data/company/get-companies";

export const dynamic = "force-dynamic";

const page = async () => {
  const data = await fetchCountries();

  console.log(data);

  return <div>page</div>;
};

export default page;
