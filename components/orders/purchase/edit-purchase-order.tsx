"use client";

import z from "zod";
import { FC } from "react";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useFlowdrStore } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  Package,
  Plus,
  Rotate3DIcon,
  Trash2,
  Save,
  Minus,
} from "lucide-react";

import { Vendor, PurchaseOrder } from "@/types/flowdr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { PurchaseItemsModal } from "./purchase-items-modal";
// import { updatePurchaseOrder } from "@/data/orders/update-orders";
import { updatePurchaseOrder } from "@/data/orders/update-orders";
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

type EditProps = {
  vendors: Vendor[];
  companyId: string;
  order: PurchaseOrder; // The existing order data
};

export type Item = {
  id?: string; // Include id for existing items
  product_id: string;
  order_quantity: number;
  delivered_quantity: number;
  unit_price: string;
  received_date: string | null;
};

const status = [
  "DRAFT",
  "PENDING",
  "APPROVED",
  "PARTIALLY_RECEIVED",
  "COMPLETED",
  "CANCELLED",
];

const editProductSchema = z.object({
  vendor: z.string(),
  status: z.enum(status),
  deliveryDate: z.date().refine((val) => !!val, {
    message: "Delivery date is required.",
  }),
  notes: z.string(),
});

export const EditPurchaseOrderForm: FC<EditProps> = ({
  vendors,
  companyId,
  order,
}) => {
  const products = useFlowdrStore((state) => state.store.products);

  // Initialize with existing items
  const [orderItems, setOrderItems] = useState<Item[]>(() =>
    order.items.map((item) => ({
      id: item.id,
      product_id: item.product.id,
      order_quantity: item.order_quantity,
      delivered_quantity: item.delivered_quantity,
      unit_price: item.unit_price,
      received_date: item.received_date,
    }))
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const form = useForm<z.infer<typeof editProductSchema>>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      vendor: order.vendor.id,
      status: order.status as any,
      deliveryDate: new Date(order.expected_delivery_date),
      notes: order.notes || "",
    },
  });

  const router = useRouter();
  //   const path = usePathname();

  const addOrderItem = (newItem: Item) => {
    setOrderItems((prev) => [...prev, newItem]);
  };

  //   const updateOrderItem = (updatedItem: Item) => {
  //     setOrderItems((prev) =>
  //       prev.map((item) =>
  //         item.product_id === updatedItem.product_id ? updatedItem : item
  //       )
  //     );
  //     setEditingItem(null);
  //   };

  const removeOrderItem = (productId: string) => {
    setOrderItems((prev) =>
      prev.filter((item) => item.product_id !== productId)
    );
  };

  //   const editOrderItem = (item: Item) => {
  //     setEditingItem(item);
  //     setIsModalOpen(true);
  //   };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + parseFloat(item.unit_price) * (item.order_quantity || 0);
    }, 0);
  };

  const onSubmit = async (values: z.infer<typeof editProductSchema>) => {
    try {
      const updatedOrder = {
        vendor_id: values.vendor,
        status: values.status,
        expected_delivery_date: new Date(values.deliveryDate)
          .toISOString()
          .split("T")[0],
        notes: values.notes,
        items: orderItems,
      };

      const res = await updatePurchaseOrder(companyId, order.id, updatedOrder);

      console.log(res);

      if (res.error === "0") {
        toast.success("Success", { description: "Order updated successfully" });
        router.replace(`/company/${companyId}/orders/purchase`);
      } else {
        toast.error("Failed!", { description: res.message });
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
              <CardTitle className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">Order #{order.id}</p>
                </div>
                <Badge
                  variant={
                    order.status === "APPROVED"
                      ? "default"
                      : order.status === "PENDING"
                      ? "secondary"
                      : order.status === "CANCELLED"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {order.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  name="vendor"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          {vendors.map((vendor) => (
                            <SelectItem key={vendor.id} value={vendor.id}>
                              <div className="flex flex-col">
                                <span>{vendor.user.username}</span>
                                {vendor.vendor_company && (
                                  <span className="text-xs text-muted-foreground">
                                    {vendor.vendor_company}
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
                    onClick={() => {
                      setEditingItem(null);
                      setIsModalOpen(true);
                    }}
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
                            Ordered Qty
                          </TableHead>
                          <TableHead className="text-center">
                            Delivered Qty
                          </TableHead>
                          <TableHead className="text-right">
                            Unit Price
                          </TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead className="text-center">
                            Received Date
                          </TableHead>
                          <TableHead className="w-[80px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderItems.map((item) => {
                          const product = products.find(
                            (p) => p.id === item.product_id
                          );

                          const receivedDate = item.received_date
                            ? new Date(item.received_date)
                            : new Date();

                          const isFullyDelivered =
                            item.delivered_quantity >= item.order_quantity;
                          const isPartiallyDelivered =
                            item.delivered_quantity > 0 && !isFullyDelivered;

                          // Format received date
                          const formatReceivedDate = (
                            dateString: string | null
                          ) => {
                            if (!dateString) return "Not received";
                            try {
                              return format(
                                new Date(dateString),
                                "MMM dd, yyyy"
                              );
                            } catch {
                              return "Invalid date";
                            }
                          };

                          // Handle received date change
                          const handleReceivedDateChange = (
                            date: Date | undefined
                          ) => {
                            if (date) {
                              setOrderItems((prev) =>
                                prev.map((i) =>
                                  i.product_id === item.product_id
                                    ? {
                                        ...i,
                                        received_date: date
                                          .toISOString()
                                          .split("T")[0],
                                      }
                                    : i
                                )
                              );
                            }
                          };

                          // Ordered Quantity Controls
                          const updateOrderedQuantity = (
                            newQuantity: number
                          ) => {
                            if (newQuantity >= item.delivered_quantity) {
                              // Can't go below delivered quantity
                              setOrderItems((prev) =>
                                prev.map((i) =>
                                  i.product_id === item.product_id
                                    ? { ...i, order_quantity: newQuantity }
                                    : i
                                )
                              );
                            }
                          };

                          const incrementOrderedQuantity = () => {
                            updateOrderedQuantity(item.order_quantity + 1);
                          };

                          const decrementOrderedQuantity = () => {
                            if (item.order_quantity > item.delivered_quantity) {
                              updateOrderedQuantity(item.order_quantity - 1);
                            }
                          };

                          // Delivered Quantity Controls
                          const updateDeliveredQuantity = (
                            newDeliveredQuantity: number
                          ) => {
                            if (
                              newDeliveredQuantity >= 0 &&
                              newDeliveredQuantity <= item.order_quantity
                            ) {
                              setOrderItems((prev) =>
                                prev.map((i) =>
                                  i.product_id === item.product_id
                                    ? {
                                        ...i,
                                        delivered_quantity:
                                          newDeliveredQuantity,
                                        // Auto-set received date when delivered quantity increases
                                        received_date:
                                          newDeliveredQuantity >
                                            item.delivered_quantity &&
                                          !item.received_date
                                            ? new Date()
                                                .toISOString()
                                                .split("T")[0]
                                            : item.received_date,
                                      }
                                    : i
                                )
                              );
                            }
                          };

                          const incrementDeliveredQuantity = () => {
                            if (item.delivered_quantity < item.order_quantity) {
                              updateDeliveredQuantity(
                                item.delivered_quantity + 1
                              );
                            }
                          };

                          const decrementDeliveredQuantity = () => {
                            if (item.delivered_quantity > 0) {
                              updateDeliveredQuantity(
                                item.delivered_quantity - 1
                              );
                            }
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

                              {/* Ordered Quantity */}
                              <TableCell>
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={decrementOrderedQuantity}
                                    disabled={
                                      item.order_quantity <=
                                      item.delivered_quantity
                                    }
                                    className="h-8 w-8"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <div className="min-w-[40px] text-center font-medium">
                                    {item.order_quantity}
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={incrementOrderedQuantity}
                                    className="h-8 w-8"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>

                              {/* Delivered Quantity */}
                              <TableCell>
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={decrementDeliveredQuantity}
                                    disabled={item.delivered_quantity <= 0}
                                    className="h-8 w-8"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <div
                                    className={cn(
                                      "min-w-[40px] text-center font-medium",
                                      isFullyDelivered && "text-green-600",
                                      isPartiallyDelivered && "text-orange-600"
                                    )}
                                  >
                                    {item.delivered_quantity}
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={incrementDeliveredQuantity}
                                    disabled={
                                      item.delivered_quantity >=
                                      item.order_quantity
                                    }
                                    className="h-8 w-8"
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
                                  (item.order_quantity || 0)
                                ).toFixed(2)}
                              </TableCell>

                              {/* Delivery Status */}
                              <TableCell className="text-center">
                                <Badge
                                  variant={
                                    isFullyDelivered
                                      ? "default"
                                      : isPartiallyDelivered
                                      ? "secondary"
                                      : "outline"
                                  }
                                  className={cn(
                                    "text-xs",
                                    isFullyDelivered &&
                                      "bg-green-100 text-green-800",
                                    isPartiallyDelivered &&
                                      "bg-orange-100 text-orange-800"
                                  )}
                                >
                                  {isFullyDelivered
                                    ? "Delivered"
                                    : isPartiallyDelivered
                                    ? "Partial"
                                    : "Pending"}
                                </Badge>
                              </TableCell>

                              {/* Received Date */}
                              <TableCell className="text-center">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <div
                                      className={cn(
                                        "text-sm border border-input rounded-md px-3 py-2 min-h-[40px] flex items-center justify-center cursor-pointer transition-colors w-full max-w-[180px] mx-auto",
                                        item.received_date
                                          ? "text-green-600 font-medium bg-green-50 border-green-200 hover:bg-green-100"
                                          : "text-muted-foreground bg-muted hover:bg-accent"
                                      )}
                                    >
                                      {formatReceivedDate(
                                        receivedDate.toISOString()
                                      )}
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="center"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={
                                        item.received_date
                                          ? new Date(item.received_date)
                                          : new Date() // Default to today when no date
                                      }
                                      onSelect={handleReceivedDateChange}
                                      disabled={(date) => date > new Date()}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
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

                  {/* Enhanced Order Summary */}
                  <div className="flex justify-end items-center">
                    <div className="text-right space-y-2 text-xl font-bold">
                      Updated Total: ${calculateTotal().toFixed(2)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No items in order
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Add products to update this purchase order
                  </p>
                  <Button
                    onClick={() => {
                      setEditingItem(null);
                      setIsModalOpen(true);
                    }}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Items
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

      {/* Enhanced Items Modal */}
      <PurchaseItemsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddItem={addOrderItem}
        existingItems={orderItems}
      />
    </div>
  );
};
