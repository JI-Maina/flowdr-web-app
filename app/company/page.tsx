import React from "react";
import { fetchCountries } from "@/data/company/get-companies";

const page = async () => {
  const data = await fetchCountries();

  console.log(data);

  return <div>page</div>;
};

export default page;
