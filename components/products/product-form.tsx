"use client";

import z from "zod";
import { toast } from "sonner";
import { Rotate3D } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { productSchema } from "@/lib/schemas";
import { useFlowdrStore } from "@/store/store";
import { ProductPayload } from "@/types/flowdr";
import { createProducts } from "@/data/product/create-products";
import CategoryCreateModal from "../categories/category-create-modal";
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

const ProductCreateForm = ({ companyId }: { companyId: string }) => {
  const { branches, categories } = useFlowdrStore((state) => state.store);

  const router = useRouter();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: "",
      product: "",
      skuNumber: "",
      price: 0,
      vat: "",
      priceType: "fixed",
      branch: branches[0]?.id || "",
      description: "",
      image: null,
    },
  });

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    const productData: ProductPayload = {
      branch: values.branch,
      category: values.category,
      name: values.product,
      description: values.description || "",
      price: values.price.toString(),
      is_price_fixed: values.priceType === "fixed" ? true : false,
      sku_number: values.skuNumber,
      vat: values.vat as string,
    };

    const payload = {
      ...productData,
      image: (values as any).image ?? null,
    };

    try {
      const res = await createProducts(companyId, payload);

      if (res.error === "0") {
        toast.success("Product created", { description: res.message });
        router.replace(`/company/${res.product.company}/products`);
      } else {
        toast.error("Creation Failed!", { description: res.message });
      }
    } catch (error) {
      console.log(error);
      const message =
        error instanceof Error
          ? error.message
          : String(error ?? "Server error, try again later!");

      toast.error("Creation Failed!", {
        description: message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <FormField
            name="branch"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch</FormLabel>

                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>

                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="category"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Category</FormLabel>

                  <CategoryCreateModal />
                </div>

                <Select
                  // defaultValue={product?.category || ""}
                  // value={selectedCategory}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="category"
                    className="focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="product"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product name</FormLabel>

                <FormControl>
                  <Input
                    // defaultValue={ ""}
                    placeholder="Enter product name"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="skuNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU number</FormLabel>

                <FormControl>
                  <Input
                    id="product-name"
                    // defaultValue={ ""}
                    placeholder="Enter sku number"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="price"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>

                <FormControl>
                  <Input
                    // defaultValue={ ""}
                    placeholder="0.00"
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Convert the string to a number, handling empty values
                      const numberValue =
                        value === "" ? null : parseFloat(value);
                      // Update the form state with the number
                      field.onChange(numberValue);
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="vat"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>VAT</FormLabel>

                <FormControl>
                  <Input
                    // defaultValue={ ""}
                    placeholder="Enter vat"
                    type="number"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormField
              name="priceType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Type</FormLabel>

                  <Select onValueChange={field.onChange} defaultValue={"fixed"}>
                    <SelectTrigger
                      id="price-type"
                      className="focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <SelectValue placeholder="Select price type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="negotiable">
                        Negotiable Price
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="description"
                  className="text-sm font-medium"
                >
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    id="description"
                    placeholder="Enter product description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Image Upload Section */}
        <div className="space-y-2 mb-6">
          <FormField
            name="image"
            control={form.control}
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel htmlFor="image" className="text-sm font-medium">
                  Product Image
                </FormLabel>
                <FormControl>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF (MAX. 5MB)
                        </p>
                        {value && (
                          <p className="text-xs text-green-500 mt-2">
                            File selected: {value.name}
                          </p>
                        )}
                      </div>
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
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            className="min-w-[120px]"
            disabled={form.formState.isSubmitting}
          >
            Save Product
            {form.formState.isSubmitting && (
              <Rotate3D className="w-4 h-4 animate-spin" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductCreateForm;
