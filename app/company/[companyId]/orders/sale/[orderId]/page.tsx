import React, { FC } from "react";
import { Calendar, ShoppingCart, Truck, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { fetchSaleOrder } from "@/data/orders/get-orders";
import { EditOrderButton } from "@/components/orders/edit-order";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SaleParams = {
  params: Promise<{ orderId: string; companyId: string }>;
};

const SaleOrderItems: FC<SaleParams> = async ({ params }) => {
  const { orderId, companyId } = await params;

  const branchId = orderId.split("-")[0];
  const id = orderId.split("-")[1];

  const order = await fetchSaleOrder(branchId, id);

  // Calculate total amount from items
  const totalAmount =
    order?.items.reduce((sum, item) => {
      return sum + parseFloat(item.unit_price) * item.quantity;
    }, 0) || 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "default";
      case "PENDING":
        return "secondary";
      case "REJECTED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <main className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">Sales Order</h1>
                  <Badge
                    variant={getStatusVariant(order?.status)}
                    className="text-sm px-3 py-1"
                  >
                    {order?.status}
                  </Badge>
                </div>

                <CardDescription className="text-muted-foreground">
                  Order #{order?.id}
                </CardDescription>
              </div>
            </div>

            <div className="flex gap-2">
              <EditOrderButton
                path={`/company/${companyId}/orders/sale/${orderId}/edit/`}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Client Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">
                CLIENT
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {order?.client.company_name ||
                        order?.client.user.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order?.client.user.email}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm">Phone: {order?.client.phone}</p>
                  <p className="text-sm capitalize">
                    Type: {order?.client.client_type.toLowerCase()}
                  </p>
                  {order?.client.company_name && (
                    <p className="text-sm">
                      Company: {order?.client.company_name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">
                ORDER DETAILS
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Required Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order?.required_date)}
                    </p>
                  </div>
                </div>
                {order?.shipped_date && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Shipped Date</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.shipped_date)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sales Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">
                SALES INFORMATION
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm">Sold By</p>
                  <p className="text-sm text-muted-foreground">
                    {order?.sold_by.username}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {order?.sold_by.role}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm">Branch</p>
                  <p className="text-sm text-muted-foreground">
                    {order?.branch}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items Section - Single Correct Version */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <CardTitle>Order Items</CardTitle>
            </div>
          </div>
          <CardDescription>
            Products included in this sales order
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => {
                const product = item.product;
                const total = parseFloat(item.unit_price) * item.quantity;
                const isDiscounted =
                  parseFloat(item.unit_price) < parseFloat(product.price);

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {product?.name || "Unknown Product"}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {product?.description || "No description"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-medium">
                          ${parseFloat(item.unit_price).toFixed(2)}
                        </span>
                        {isDiscounted && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${parseFloat(product.price).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground font-mono">
                        {product?.sku_number}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(order.status)}
                        className="text-xs capitalize"
                      >
                        {order.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Summary */}
          <div className="flex justify-between items-end mt-6 pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              {order.items.length} item{order.items.length !== 1 ? "s" : ""} in
              this order
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-4 text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default SaleOrderItems;
