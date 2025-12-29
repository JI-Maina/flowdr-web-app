import React, { FC } from "react";
import { Building } from "lucide-react";

import { BranchTab } from "./branch-tab";
import { AccountTab } from "./account-tab";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { EditCompanyModal } from "@/components/company/edit-company";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchAccounts, fetchAccountTypes } from "@/data/accounts/get-accounts";
import {
  fetchCompany,
  fetchCountries,
  fetchCurrencies,
} from "@/data/company/get-companies";

type CompaniesPageProps = {
  params: Promise<{ companyId: string }>;
};

const CompaniesPage: FC<CompaniesPageProps> = async ({ params }) => {
  const { companyId } = await params;

  const [companies, countries, currencies, accountTypes, accounts] =
    await Promise.all([
      fetchCompany(),
      fetchCountries(),
      fetchCurrencies(),
      fetchAccountTypes(),
      fetchAccounts(companyId),
    ]);

  const company = companies[0];

  return (
    <main className="">
      <Tabs defaultValue="branches">
        {/* Company Details Card */}
        <Card className="overflow-hidden pb-0">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-700">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  ) : (
                    <Building className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h1 className="text-3xl font-bold mb-1">
                        {company.name}
                      </h1>
                      <p className="text-gray-500 text-sm">
                        {company.city}, {company.country}
                      </p>
                    </div>
                    <EditCompanyModal
                      company={company}
                      currencies={currencies}
                      countries={countries}
                    />
                  </div>

                  <div className="flex items-center gap-6 flex-wrap">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Currency
                      </p>
                      <p className="text-sm font-semibold">
                        {company.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Status
                      </p>
                      <Badge
                        variant={
                          company.status === "AC" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {company.status}
                      </Badge>
                    </div>
                  </div>

                  {company.description && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Description
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {company.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="branches" className="flex-1 sm:flex-none">
                Branches
              </TabsTrigger>
              <TabsTrigger value="accounts" className="flex-1 sm:flex-none">
                Accounts
              </TabsTrigger>
            </TabsList>
          </div>
        </Card>

        <TabsContent value="branches" className="mt-6">
          <BranchTab
            companies={companies}
            countries={countries}
            currencies={currencies}
          />
        </TabsContent>

        <TabsContent value="accounts" className="mt-6">
          <AccountTab accountTypes={accountTypes} accounts={accounts} />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default CompaniesPage;
