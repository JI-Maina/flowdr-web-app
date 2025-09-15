import { Suspense } from "react";

import { fetchCompany } from "@/data/company/get-companies";
import Companies from "./company";

const CompaniesPage = () => {
  const dataPromise = fetchCompany();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Companies data={dataPromise} />
    </Suspense>
  );
};

export default CompaniesPage;
