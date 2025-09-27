import z from "zod";
import { toast } from "sonner";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Pencil, Rotate3D } from "lucide-react";

import { productSchema } from "@/lib/schemas";
import { Input } from "@/components/ui/input";
import { useFlowdrStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product, ProductPayload } from "@/types/flowdr";
import { updateProduct } from "@/data/product/update-product";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const ProductEditModal = ({ product }: { product: Product }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { branches, categories } = useFlowdrStore((state) => state.store);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: product.category,
      product: product.name,
      skuNumber: product.sku_number,
      price:
        typeof product.price === "string"
          ? parseFloat(product.price)
          : product.price,
      vat: product.vat ?? undefined,
      priceType: product.is_price_fixed === true ? "fixed" : "negotiable",
      branch: product.branch,
      description: product.description,
      image: product.image,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    try {
      const productData: ProductPayload = {
        branch: values.branch,
        category: values.category,
        name: values.product,
        description: values.description || "",
        image: values.image,
        price: values.price.toString(),
        is_price_fixed: values.priceType === "fixed" ? true : false,
        sku_number: values.skuNumber,
        vat: values.vat as string,
      };

      const res = await updateProduct(product.company, product.id, productData);

      if (res.error === "0") {
        setOpen(false);
        toast.success("Success", { description: res.message });
        router.refresh();
      } else {
        toast.error("Update Failed!", { description: res.message });
      }
    } catch (error) {
      console.log(error);
      toast.error("Update Failed!", {
        description: "Server error, try again later!",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
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
                    <FormLabel>Category</FormLabel>

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
                      <Input placeholder="Enter product name" {...field} />
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

              <FormField
                name="priceType"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Type</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={"fixed"}
                    >
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

              <FormField
                name="image"
                control={form.control}
                render={({ field: { onChange, value, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Product Images</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          onChange(file);
                        }}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <DialogFooter>
              <Button disabled={form.formState.isSubmitting}>
                Update{" "}
                {form.formState.isSubmitting && (
                  <Rotate3D className="w-4 h-4 animate-spin" />
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditModal;
