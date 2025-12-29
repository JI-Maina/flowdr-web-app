"use client";

import { FC, use } from "react";
import { Pencil, Plus, Building, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AccountType,
  BankAccount,
  Company,
  Country,
  Currency,
} from "@/types/flowdr";
import { EditCompanyModal } from "@/components/company/edit-company";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateBranchModal } from "@/components/company/create-branch";
import DeleteBranchModal from "@/components/company/delete-branch";
import { EditBranchModal } from "@/components/company/edit-branch";
import { CreateAccountModal } from "@/components/company/create-account";

type CompProps = {
  data: Promise<
    [Company[], Country[], Currency[], AccountType[], BankAccount[]]
  >;
};

const Companies: FC<CompProps> = ({ data }) => {
  const [companies, countries, currencies, accountTypes, accounts] = use(data);

  const company = companies[0];

  console.log(accountTypes);
  console.log(accounts);

  return (
    <main className="container mx-auto p-6 space-y-6">
      {/* Company Details Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-16 h-16 rounded-lg"
                  />
                ) : (
                  <Building className="w-8 h-8 text-gray-500" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{company.name}</h1>
                <p className="text-gray-500">
                  {company.city}, {company.country}
                </p>
              </div>
            </div>

            <EditCompanyModal
              company={company}
              currencies={currencies}
              countries={countries}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Currency</p>
              <p>{company.currency}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge
                variant={company.status === "AC" ? "default" : "secondary"}
              >
                {company.status}
              </Badge>
            </div>
          </div>
          {company.description && (
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p>{company.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Branches Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Branches</h2>
        <CreateBranchModal countries={countries} currencies={currencies} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {company.branches.map((branch) => (
          <Card key={branch.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                    {branch.name}
                  </CardTitle>
                  <CardDescription>
                    {branch.city}, {branch.country}
                  </CardDescription>
                </div>
                <Badge
                  variant={branch.status === "active" ? "default" : "secondary"}
                >
                  {branch.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {branch.description && (
                <p className="text-sm mb-3">{branch.description}</p>
              )}
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Created: {new Date(branch.created_at).toLocaleDateString()}
                </p>
                <div className="space-x-2">
                  <EditBranchModal
                    branch={branch}
                    countries={countries}
                    currencies={currencies}
                  />

                  <DeleteBranchModal branch={branch} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Accounts Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Accounts</h2>
          <CreateAccountModal accountTypes={accountTypes} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <CardTitle>{account.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Companies;
