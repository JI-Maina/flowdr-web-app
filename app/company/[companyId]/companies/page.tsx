import { Suspense } from "react";

import {
  fetchCompany,
  fetchCountries,
  fetchCurrencies,
} from "@/data/company/get-companies";
import Companies from "./company";

const CompaniesPage = () => {
  const dataPromise = Promise.all([
    fetchCompany(),
    fetchCountries(),
    fetchCurrencies(),
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Companies data={dataPromise} />
    </Suspense>
  );
};

export default CompaniesPage;
