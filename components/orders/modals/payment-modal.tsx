"use client";

import z from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, CreditCard, Rotate3DIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Invoice } from "@/types/flowdr";
import { Calendar } from "../../ui/calendar";
import { useFlowdrStore } from "@/store/store";
import { createPayment } from "@/data/payments/create-pay";
import { fetchAccounts } from "@/data/accounts/get-accounts";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

type PayProps = { invoice: Invoice; companyId: string };

const PAY_METHOD = [
  "CASH",
  "BANK_TRANSFER",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "MOBILE_MONEY",
  "CHECK",
];

const paySchema = z.object({
  refNumber: z.string(),
  amount: z.number(),
  account: z.string().min(3, { message: "Payment Account is required" }),
  method: z.string().min(3, { message: "Payment method is required" }),
  payDate: z.date().refine((val) => !!val, {
    message: "Payment date is required.",
  }),
});

export const PaymentModal: FC<PayProps> = ({ invoice, companyId }) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const branchId = useFlowdrStore((state) => state.store.branchId);
  const queryClient = useQueryClient();

  const { data: accounts } = useQuery({
    queryKey: ["accounts", companyId],
    queryFn: () => fetchAccounts(companyId),
    enabled: !!companyId,
  });

  const form = useForm<z.infer<typeof paySchema>>({
    resolver: zodResolver(paySchema),
    defaultValues: {
      amount: invoice.balance,
      refNumber: "",
      method: "",
      account: "",
      payDate: new Date(),
    },
  });

  const onSubmit = async (values: z.infer<typeof paySchema>) => {
    try {
      const payment = {
        method: values.method,
        account: values.account,
        amount: values.amount,
        payment_date: new Date(values.payDate).toISOString().split("T")[0],
        reference_number: values.refNumber,
        notes: "",
      };

      const res = await createPayment(branchId, invoice.id, payment);

      if (res.error === "0") {
        toast.success("Success", {
          description: res.message || "Payment made successfully",
        });
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
      queryClient.invalidateQueries({ queryKey: ["invoices", branchId] });
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
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <DialogTitle>Process Payment</DialogTitle>
          </div>
          <DialogDescription>
            Complete your payment for invoice{" "}
            <span className="font-medium">{invoice.invoice_number}</span>{" "}
            totaling <span className="font-medium">${invoice.balance}</span>.
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
              control={form.control}
              name="payDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Payment Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
