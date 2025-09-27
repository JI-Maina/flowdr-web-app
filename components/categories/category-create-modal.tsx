"use client";

import z from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { Plus, Rotate3D } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useFlowdrStore } from "@/store/store";
import { categorySchema } from "@/lib/schemas";
import { createCategory } from "@/actions/create-actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const CategoryCreateModal = () => {
  const [open, setOpen] = useState(false);

  const { companyId } = useParams();

  const { branches, categories } = useFlowdrStore((state) => state.store);
  const updateCategories = useFlowdrStore((state) => state.updateCategories);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: "",
      productType: "product",
      branch: branches[0]?.id || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof categorySchema>) => {
    const category = {
      name: data.categoryName,
      product_type: data.productType,
      branch: data.branch,
    };

    try {
      const res = await createCategory(companyId as string, category);
      form.reset();
      updateCategories([...categories, res]);
      setOpen(false);
      toast.success("Category created successfully");
    } catch (err) {
      console.log("Error creating category:", err);
      toast.error("Failed to create category");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="text-xs h-8 px-2">
          <Plus className="h-3 w-3 mr-1" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new product category for your inventory.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              <FormField
                name="categoryName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>

                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="productType"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Type</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={"product"}
                    >
                      <SelectTrigger
                        id="price-type"
                        className="focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        <SelectValue placeholder="Select price type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                name="branch"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={branches[0]?.id}
                    >
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

              {/* <div className="space-y-2 mb-6">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter product description"
                  // defaultValue={product?.description || ""}
                />
              </div> */}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting && (
                  <Rotate3D className="w-4 h-4 animate-spin" />
                )}{" "}
                Add Category
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryCreateModal;
