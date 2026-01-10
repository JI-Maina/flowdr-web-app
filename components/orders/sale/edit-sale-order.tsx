"use client";

import z from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  Package,
  Plus,
  Rotate3DIcon,
  Save,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useFlowdrStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Client, Product, SaleOrder } from "@/types/flowdr";
import { Calendar } from "@/components/ui/calendar";
import { SaleItemsModal } from "./sale-items-modal";
import { updateSaleOrder } from "@/data/orders/update-orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type SaleItem = {
  id?: string;
  product_id: string;
  quantity: number;
  unit_price: string;
};

type EditProps = {
  clients: Client[];
  companyId: string;
  order: SaleOrder;
  products: Product[];
};

const status = [
  "DRAFT",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

const editSchema = z.object({
  client: z.string().min(3, { message: "Client is required" }),
  branch: z.string().min(3, { message: "Branch is required" }),
  status: z.enum(status),
  deliveryDate: z.date().refine((val) => !!val, {
    message: "Match date is required.",
  }),
  shippingDate: z.date().refine((val) => !!val, {
    message: "Shipping date is required.",
  }),
});

export const EditSaleOrderForm: FC<EditProps> = ({
  clients,
  companyId,
  order,
  products,
}) => {
  const { branches } = useFlowdrStore((state) => state.store);

  const [orderItems, setOrderItems] = useState<SaleItem[]>(() =>
    order.items.map((item) => ({
      id: item.id,
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }))
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof editSchema>>({
    defaultValues: {
      client: order.client.id,
      branch: order.branch,
      status: order.status,
      deliveryDate: new Date(order.required_date),
      shippingDate: new Date(order.shipped_date),
    },
    mode: "onChange",
  });

  const addOrderItem = (newItem: SaleItem) => {
    setOrderItems((prev) => [...prev, newItem]);
  };

  const removeOrderItem = (itemId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.product_id !== itemId));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + parseFloat(item.unit_price) * (item.quantity || 0);
    }, 0);
  };

  const onSubmit = async (values: z.infer<typeof editSchema>) => {
    try {
      const updatedOrder = {
        client_id: values.client,
        status: values.status,
        required_date: new Date(values.deliveryDate)
          .toISOString()
          .split("T")[0],
        shipped_date: new Date(values.deliveryDate).toISOString().split("T")[0],
        items: [...orderItems],
      };

      const res = await updateSaleOrder(companyId, order.id, updatedOrder);

      if (res.error === "0") {
        toast.success("Update Success", {
          description: "Order updated successfully",
        });
        router.replace(`/company/${companyId}/orders/sale`);
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
    <div className="space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          {/* Order Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  name="branch"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              <div className="flex flex-col">
                                <span>{branch.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="client"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              <div className="flex flex-col">
                                <span>{client.user.username}</span>
                                {client.company_name && (
                                  <span className="text-xs text-muted-foreground">
                                    {client.company_name}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {status.map((item) => (
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="deliveryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expected Delivery</FormLabel>
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
                  control={form.control}
                  name="shippingDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Shipping Date</FormLabel>
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
              </div>
            </CardContent>
          </Card>

          {/* Order Items Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Items</CardTitle>
                <div className="flex items-center gap-2">
                  {orderItems.length > 0 && (
                    <Badge variant="secondary" className="text-sm">
                      {orderItems.length} item
                      {orderItems.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  <Button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Items
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {orderItems.length > 0 ? (
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">
                            Unit Price
                          </TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderItems.map((item) => {
                          const product = products.find(
                            (p) => p.id === item.product_id
                          );

                          const updateQuantity = (newQuantity: number) => {
                            if (newQuantity < 1) return; // Prevent negative quantities
                            setOrderItems((prev) =>
                              prev.map((prevItem) =>
                                prevItem.product_id === item.product_id
                                  ? { ...prevItem, quantity: newQuantity }
                                  : prevItem
                              )
                            );
                          };

                          return (
                            <TableRow key={item.product_id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {product?.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {product?.sku_number}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      updateQuantity(item.quantity - 1)
                                    }
                                  >
                                    <span className="sr-only">
                                      Decrease quantity
                                    </span>
                                    -
                                  </Button>
                                  <span className="font-medium w-8 text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      updateQuantity(item.quantity + 1)
                                    }
                                  >
                                    <span className="sr-only">
                                      Increase quantity
                                    </span>
                                    +
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                ${parseFloat(item.unit_price).toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                $
                                {(
                                  parseFloat(item.unit_price) *
                                  (item.quantity || 0)
                                ).toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    removeOrderItem(item.product_id)
                                  }
                                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Order Summary */}
                  <div className="flex justify-end">
                    <div className="text-right space-y-2">
                      <div className="text-sm text-muted-foreground">
                        {orderItems.length} item
                        {orderItems.length !== 1 ? "s" : ""}
                      </div>
                      <div className="text-xl font-bold">
                        Total: ${calculateTotal().toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No items added</h3>
                  <p className="text-muted-foreground mb-4">
                    Add products to create your purchase order
                  </p>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Your First Item
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-between gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset Changes
              </Button>
              <Button
                type="submit"
                disabled={
                  orderItems.length === 0 || form.formState.isSubmitting
                }
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Update Order
                {form.formState.isSubmitting && (
                  <Rotate3DIcon className="h-4 w-4 animate-spin" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {/* Items Modal */}
      <SaleItemsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddItem={addOrderItem}
        existingItems={orderItems}
        products={products}
      />
    </div>
  );
};
