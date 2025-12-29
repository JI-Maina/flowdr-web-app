"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import React, { FC, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon, Rotate3DIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { AccountType, BankAccount } from "@/types/flowdr";
import { updateAccount } from "@/actions/account-actions";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";

type AccountProps = {
  accountTypes: AccountType[];
  account: BankAccount;
};

const accountSchema = z.object({
  accountName: z.string().min(1, { message: "Account name is required" }),
  accountType: z.string().min(1, { message: "Account type is required" }),
  accountNumber: z.string().min(1, { message: "Account number is required" }),
  description: z.string().optional(),
});

export const EditAccountModal: FC<AccountProps> = ({
  accountTypes,
  account,
}) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const path = usePathname();

  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      accountName: account.name,
      accountType: account.account_type,
      accountNumber: account.bank_account_number,
      description: account.description,
    },
    mode: "onChange",
  });

  const companyId = path.split("/")[2];

  const onSubmit = async (values: z.infer<typeof accountSchema>) => {
    try {
      const accountData = {
        name: values.accountName,
        account_type: values.accountType,
        bank_account_number: values.accountNumber,
        description: values.description || "",
        is_active: true,
      };

      const res = await updateAccount(companyId, account.id, accountData);

      if (res.error === "0") {
        toast.success("Account updated", { description: res.message });
      } else {
        toast.error("Failed to update account", { description: res.message });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update account", {
        description: "Server error, try again later!",
      });
    } finally {
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          type="button"
          size="sm"
          className="text-xs h-8 px-2"
        >
          <PencilIcon className="h-3 w-3 mr-1" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Account</DialogTitle>
          <DialogDescription>
            You are creating a new account for your company
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="accountNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter account number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="accountName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter account name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="accountType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accountTypes.map((accountType) => (
                          <SelectItem
                            key={accountType.id}
                            value={accountType.id}
                          >
                            {accountType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter account description"
                      className="min-h-[100px] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700"
                disabled={form.formState.isSubmitting}
              >
                Update Account{" "}
                {form.formState.isSubmitting && (
                  <Rotate3DIcon className="h-4 w-4 animate-spin" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
