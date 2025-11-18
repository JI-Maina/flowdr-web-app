import { fetchCompany } from "@/data/company/get-companies";
import React from "react";
import { DashboardOverview } from "./dashboard";

const DashboardPage = async () => {
  const data = await fetchCompany();

  return <DashboardOverview branches={data[0].branches} />;
};

export default DashboardPage;
