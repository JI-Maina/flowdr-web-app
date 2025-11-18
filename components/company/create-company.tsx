"use client";

import z from "zod";
import { FC } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Upload,
  MapPin,
  DollarSign,
  Rotate3DIcon,
} from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { companySchema } from "@/lib/schemas";
import { useFlowdrStore } from "@/store/store";
import { Country, Currency } from "@/types/flowdr";
import { createCompany } from "@/actions/company-actions";
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
  currencies: Currency[];
  countries: Country[];
};

export const CreateCompanyForm: FC<CompProps> = ({ currencies, countries }) => {
  const router = useRouter();
  const { store, updateUser } = useFlowdrStore((state) => state);

  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      company: "",
      description: "",
      country: "",
      city: "",
      currency: "",
      image: null,
    },
  });

  const onSubmit = async (data: z.infer<typeof companySchema>) => {
    try {
      const company = {
        name: data.company,
        description: data.description,
        country: data.country,
        city: data.city,
        logo: data.image,
        currency: data.currency,
      };

      const res = await createCompany(company);

      if (res.error === "0") {
        updateUser({ ...store.user, companyId: res.data.id });
        toast.success("Company created", { description: res.message });
        router.replace(`/company/${res.data.id}`);
      } else {
        toast.error("Creation Failed!", { description: res.message });
      }
    } catch (error) {
      console.log(error);
      toast.error("Creation Failed!", {
        description: "Server error, try again later!",
      });
    }
  };

  return (
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
        <FormField
          name="image"
          control={form.control}
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Company Logo
              </FormLabel>
              <FormControl>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
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
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF (MAX. 5MB)
                      </p>
                      {value && (
                        <p className="text-sm text-green-600 font-medium mt-2">
                          ✓ {value.name}
                        </p>
                      )}
                    </div>
                  </label>
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
            Create Company{" "}
            {form.formState.isSubmitting && (
              <Rotate3DIcon className="h-4 w-4 animate-spin" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
