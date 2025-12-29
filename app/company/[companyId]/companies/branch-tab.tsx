"use client";

import { CreateBranchModal } from "@/components/company/create-branch";
import React, { FC } from "react";
import { Branch, Company, Country, Currency } from "@/types/flowdr";
import { Card, CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { EditBranchModal } from "@/components/company/edit-branch";
import DeleteBranchModal from "@/components/company/delete-branch";
import { CardContent } from "@/components/ui/card";

type BranchTabProps = {
  companies: Company[];
  countries: Country[];
  currencies: Currency[];
};

export const BranchTab: FC<BranchTabProps> = ({
  companies,
  countries,
  currencies,
}) => {
  const company = companies[0];
  return (
    <section className="space-y-4">
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
    </section>
  );
};
