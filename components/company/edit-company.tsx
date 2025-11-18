"use client";

import z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { editCompany } from "@/actions/company-actions";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { companySchema } from "@/lib/schemas";
import { Company, Country, Currency } from "@/types/flowdr";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Building2,
  DollarSign,
  MapPin,
  Pencil,
  Rotate3DIcon,
  Upload,
} from "lucide-react";
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

type CompProps = {
  company: Company;
  currencies: Currency[];
  countries: Country[];
};

export const EditCompanyModal: FC<CompProps> = ({
  company,
  currencies,
  countries,
}) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      company: company.name,
      description: company.description,
      country: company.country,
      city: company.city,
      currency: company.currency,
      image: company.logo || null,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof companySchema>) => {
    try {
      const compPayload = {
        name: data.company,
        description: data.description,
        country: data.country,
        city: data.city,
        logo: data.image,
        currency: data.currency,
      };

      const res = await editCompany(company.id, compPayload);

      if (res.error === "0") {
        toast.success("Company edited", { description: res.message });
      } else {
        toast.error("Edit Failed!", { description: res.message });
      }
    } catch (error) {
      console.log(error);
      toast.error("Edit Failed!", {
        description: "Server error, try again later!",
      });
    } finally {
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Pencil className="w-4 h-4 mr-2" />
          Edit Company
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Edit Company
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-1">
            You are editing your company details
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Company Name */}
            <FormField
              name="company"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Building2 className="h-4 w-4" />
                    Company Name
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
                    Company Description
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

            {/* Company Logo */}
            {/* Company Logo */}
            <FormField
              name="image"
              control={form.control}
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Company Logo
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Logo Preview - Shows when logo exists */}
                      {value && (
                        <div className="flex-1 flex flex-col items-center justify-center border-2 border-gray-200 rounded-xl p-4 min-h-[200px]">
                          <div className="relative w-32 h-32 mb-4">
                            {value instanceof File ? (
                              <img
                                src={URL.createObjectURL(value)}
                                alt="Logo preview"
                                className="w-full h-full object-contain rounded-lg"
                              />
                            ) : (
                              <img
                                src={value}
                                alt="Company logo"
                                className="w-full h-full object-contain rounded-lg"
                              />
                            )}
                          </div>
                          {/* <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onChange(null)}
                            className="text-red-600 hover:text-red-700 border-red-200"
                          >
                            Remove Logo
                          </Button> */}
                        </div>
                      )}

                      {/* Upload Area */}
                      <div
                        className={`
            flex-1 border-2 border-dashed border-gray-300 rounded-xl p-6 
            text-center hover:border-blue-400 transition-colors cursor-pointer
            min-h-[200px] flex items-center justify-center
          `}
                      >
                        <input
                          id="image"
                          type="file"
                          className="hidden"
                          accept="image/png, image/jpeg, image/gif"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            onChange(file);
                          }}
                          {...field}
                        />
                        <label htmlFor="image" className="cursor-pointer">
                          <div className="flex flex-col items-center justify-center">
                            <Upload className="w-8 h-8 text-gray-400 mb-3" />
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-semibold text-blue-600">
                                {value ? "Change logo" : "Click to upload"}
                              </span>{" "}
                              {!value && "or drag and drop"}
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF (MAX. 5MB)
                            </p>
                            {value && value instanceof File && (
                              <p className="text-sm text-green-600 font-medium mt-2">
                                ✓ {value.name}
                              </p>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
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
                Edit Company{" "}
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
