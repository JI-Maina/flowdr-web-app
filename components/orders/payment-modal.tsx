"use client";

import z from "zod";
import { toast } from "sonner";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Rotate3DIcon } from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Bill } from "@/types/flowdr";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVoucher } from "@/data/payments/create-pay";
import { fetchAccounts } from "@/data/accounts/get-accounts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type PayProps = { bill: Bill; companyId: string };

const PAY_METHOD = [
  "CASH",
  "BANK_TRANSFER",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "MOBILE_MONEY",
  "CHECK",
  "OTHER",
];

const paySchema = z.object({
  refNumber: z.string(),
  amount: z.number(),
  account: z.string().min(3, { message: "Payment Account is required" }),
  method: z.string().min(3, { message: "Payment method is required" }),
});

export const PaymentModal: FC<PayProps> = ({ bill, companyId }) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const { data: accounts } = useQuery({
    queryKey: ["accounts", companyId],
    queryFn: () => fetchAccounts(companyId),
    enabled: !!companyId,
  });

  const form = useForm<z.infer<typeof paySchema>>({
    resolver: zodResolver(paySchema),
    defaultValues: {
      amount: bill.balance,
      refNumber: "",
      method: "",
      account: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof paySchema>) => {
    try {
      const payment = {
        bill: bill.id,
        amount_paid: values.amount,
        method: values.method,
        account: values.account,
        reference_number: values.refNumber,
      };

      const res = await createVoucher(companyId, bill.id, payment);

      if (res.error === "0") {
        toast.success("Success", {
          description: res.message || "Payment made successfully",
        });
        router.refresh();
      } else {
        toast.error("Failed!", {
          description: res.message || "Failed to make payment",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Payment Failed!", {
        description: "Server error, try again later!",
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"sm"}>
          <CreditCard className="h-4 w-4" /> Pay
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="amount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Amount *</FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="method"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAY_METHOD.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="account"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} {item.bank_account_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="refNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ref Number</FormLabel>

                  <FormControl>
                    <Input placeholder="ref number" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-2">
              <Button disabled={form.formState.isSubmitting}>
                Make Payment
                {form.formState.isSubmitting && (
                  <Rotate3DIcon className="w-4 h-4 animate-spin" />
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
