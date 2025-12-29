"use client";

import React, { FC } from "react";
import { CreditCard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { AccountType, BankAccount } from "@/types/flowdr";
import { EditAccountModal } from "@/components/company/edit-account";
// import DeleteAccountModal from "@/components/company/delete-account";
import { CreateAccountModal } from "@/components/company/create-account";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type AccountTabProps = {
  accountTypes: AccountType[];
  accounts: BankAccount[];
};

export const AccountTab: FC<AccountTabProps> = ({ accountTypes, accounts }) => {
  const getAccountTypeName = (accountTypeId: string): string => {
    const accountType = accountTypes.find((type) => type.id === accountTypeId);
    return accountType?.name || "Unknown";
  };

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Accounts</h2>
        <CreateAccountModal accountTypes={accountTypes} />
      </div>

      {accounts.length <= 0 ? (
        <div className="h-80 flex flex-col items-center justify-center gap-2 text-center text-gray-500 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">No accounts found</p>
          <p className="text-xs text-gray-500">
            Create an account to get started
          </p>
          <CreateAccountModal accountTypes={accountTypes} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center mb-1">
                      <CreditCard className="w-5 h-5 mr-2 text-gray-500 shrink-0" />
                      <span className="truncate">{account.name}</span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {getAccountTypeName(account.account_type)}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={account.is_active ? "default" : "secondary"}
                    className="shrink-0 ml-2"
                  >
                    {account.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Account Number
                  </p>
                  <p className="text-sm font-mono font-semibold">
                    {account.bank_account_number}
                  </p>
                </div>

                {account.description && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Description
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {account.description}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500">
                    Created: {new Date(account.created_at).toLocaleDateString()}
                  </p>
                  <div className="space-x-2">
                    <EditAccountModal
                      accountTypes={accountTypes}
                      account={account}
                    />
                    {/* <DeleteAccountModal account={account} /> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};
