"use client";

import z from "zod";
import { toast } from "sonner";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  DollarSign,
  Rotate3DIcon,
  PlusIcon,
} from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { branchSchema } from "@/lib/schemas";
import { useFlowdrStore } from "@/store/store";
import { Country, Currency } from "@/types/flowdr";
import { createBranch } from "@/actions/company-actions";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type BranchProps = {
  currencies: Currency[];
  countries: Country[];
};

export const CreateBranchModal: FC<BranchProps> = ({
  currencies,
  countries,
}) => {
  const [open, setOpen] = useState(false);

  const { store, updateUser } = useFlowdrStore((state) => state);

  const router = useRouter();

  const path = usePathname();
  const companyId = path.split("/")[2];

  const form = useForm<z.infer<typeof branchSchema>>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      branch: "",
      description: "",
      country: "",
      city: "",
      currency: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof branchSchema>) => {
    try {
      const company = {
        name: data.branch,
        description: data.description,
        country: data.country,
        city: data.city,
        currency: data.currency,
      };

      const res = await createBranch(companyId, company);

      if (res.error === "0") {
        updateUser({ ...store.user, companyId: res.data.id });
        toast.success("Branch created", { description: res.message });
      } else {
        toast.error("Creation Failed!", { description: res.message });
      }
    } catch (error) {
      console.log(error);
      toast.error("Creation Failed!", {
        description: "Server error, try again later!",
      });
    } finally {
      form.reset();
      router.refresh();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Branch
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Add Branch
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-1">
            You are creating a new branch to your company
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Company Name */}
            <FormField
              name="branch"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Building2 className="h-4 w-4" />
                    Branch Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your company name"
                      {...field}
                      className="h-12 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Branch Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your company..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Country */}
              <FormField
                name="country"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base font-semibold">
                      <MapPin className="h-4 w-4" />
                      Country
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                name="city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      City/State
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter city or state"
                        {...field}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Currency */}
            <FormField
              name="currency"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <DollarSign className="h-4 w-4" />
                    Currency
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem
                          key={currency.numeric_code}
                          value={currency.numeric_code}
                        >
                          <div className="flex items-center gap-2">
                            <span>{currency.currency}</span>
                            <span className="text-muted-foreground text-sm">
                              ({currency.alpha_code})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                Add Branch{" "}
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
