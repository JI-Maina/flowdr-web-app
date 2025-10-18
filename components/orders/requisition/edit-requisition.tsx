"use client";

import z from "zod";
import { toast } from "sonner";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Package, Plus, Rotate3DIcon, Save, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useFlowdrStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { RequisitionOrder } from "@/types/flowdr";
import { Textarea } from "@/components/ui/textarea";
import { RequisitionItem } from "./create-requisition";
import { RequisitionItemsModal } from "./requisition-items-modal";
import { updateRequisitionOrder } from "@/data/orders/update-orders";
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

type EditProps = {
  companyId: string;
  order: RequisitionOrder;
};

const status = ["PENDING", "APPROVED", "DENIED", "FULFILLED", "CANCELLED"];

const requisitionSchema = z.object({
  source: z.string(),
  destination: z.string(),
  status: z.enum(status),
  deliveryDate: z.date().refine((val) => !!val, {
    message: "Match date is required.",
  }),
  notes: z.string(),
});

const EditRequisitionOrderForm: FC<EditProps> = ({ companyId, order }) => {
  const { products, branches } = useFlowdrStore((state) => state.store);

  const [orderItems, setOrderItems] = useState<RequisitionItem[]>(() =>
    order.items.map((item) => ({
      id: item.id,
      requisition: item.requisition,
      product_id: item.product.id,
      quantity: item.quantity,
      quantity_fulfilled: item.quantity_fulfilled,
      unit_price: item.product.price,
    }))
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof requisitionSchema>>({
    resolver: zodResolver(requisitionSchema),
    defaultValues: {
      source: order.source_branch,
      destination: order.destination_branch,
      status: order.status,
      deliveryDate: new Date(),
      notes: order.notes,
    },
    mode: "onChange",
  });

  const addOrderItem = (newItem: RequisitionItem) => {
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

  const onSubmit = async (values: z.infer<typeof requisitionSchema>) => {
    try {
      const updatedOrder = {
        source_branch: values.source,
        destination_branch: values.destination,
        status: values.status,
        notes: values.notes,
        items: [...orderItems],
      };

      const res = await updateRequisitionOrder(
        companyId,
        order.id,
        updatedOrder
      );

      if (res.error === "0") {
        toast.success("Success", { description: "Order updated successfully" });
        router.replace(`/company/${companyId}/orders/requisition`);
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
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  name="source"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Branch *</FormLabel>
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
                  name="destination"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Branch *</FormLabel>
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

              <div className="mt-6">
                <FormField
                  name="notes"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any special instructions or notes for this order..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
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
                          <TableHead className="text-center">
                            Quantity
                          </TableHead>
                          <TableHead className="text-center">
                            Fulfilled Qty
                          </TableHead>
                          <TableHead className="text-right">
                            Unit Price
                          </TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderItems.map((item) => {
                          const product = products.find(
                            (p) => p.id === item.product_id
                          );

                          const updateQuantity = (
                            productId: string,
                            change: number
                          ) => {
                            setOrderItems((prev) =>
                              prev.map((item) =>
                                item.product_id === productId
                                  ? {
                                      ...item,
                                      quantity: Math.max(
                                        1,
                                        item.quantity + change
                                      ),
                                    }
                                  : item
                              )
                            );
                          };

                          const updateFulfilledQuantity = (
                            productId: string,
                            change: number
                          ) => {
                            setOrderItems((prev) =>
                              prev.map((item) => {
                                if (item.product_id === productId) {
                                  const newFulfilled = Math.max(
                                    0,
                                    Math.min(
                                      item.quantity,
                                      item.quantity_fulfilled + change
                                    )
                                  );
                                  return {
                                    ...item,
                                    quantity_fulfilled: newFulfilled,
                                  };
                                }
                                return item;
                              })
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

                              {/* Quantity with +/- buttons */}
                              <TableCell>
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      updateQuantity(item.product_id, -1)
                                    }
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="font-medium w-8 text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      updateQuantity(item.product_id, 1)
                                    }
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>

                              {/* Fulfilled Quantity with +/- buttons */}
                              <TableCell>
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      updateFulfilledQuantity(
                                        item.product_id,
                                        -1
                                      )
                                    }
                                    disabled={item.quantity_fulfilled <= 0}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="font-medium w-8 text-center">
                                    {item.quantity_fulfilled}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      updateFulfilledQuantity(
                                        item.product_id,
                                        1
                                      )
                                    }
                                    disabled={
                                      item.quantity_fulfilled >= item.quantity
                                    }
                                  >
                                    <Plus className="h-3 w-3" />
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
      <RequisitionItemsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddItem={addOrderItem}
        existingItems={orderItems}
      />
    </div>
  );
};

export default EditRequisitionOrderForm;
