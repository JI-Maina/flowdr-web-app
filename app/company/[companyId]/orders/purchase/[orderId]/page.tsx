import { FC } from "react";
import {
  Calendar,
  User,
  DollarSign,
  CheckCircle,
  Edit,
  Plus,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchPurchaseOrder } from "@/data/orders/get-orders";
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

type ItemsProps = {
  params: Promise<{ orderId: string; companyId: string }>;
};

const ItemsPage: FC<ItemsProps> = async ({ params }) => {
  const { companyId, orderId } = await params;

  const order = await fetchPurchaseOrder(companyId, orderId);

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
    <div className="container mx-auto p-6 space-y-6">
      {/* Order Details Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">Purchase Order</h1>
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
              <Button size="sm" variant={"outline"} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>

              <Button size="sm" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Vendor Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">
                VENDOR
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{order?.vendor.user.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {order?.vendor.user.email}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm">
                    Phone: {order?.vendor.primary_phone}
                  </p>
                  <p className="text-sm capitalize">
                    Type: {order?.vendor.vendor_type.toLowerCase()}
                  </p>
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
                    <p className="font-medium">Expected Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order?.expected_delivery_date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Total Value</p>
                    <p className="text-sm text-muted-foreground">
                      ${order?.total_value.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personnel */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">
                PERSONNEL
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm">Ordered By</p>
                  <p className="text-sm text-muted-foreground">
                    {order?.ordered_by.username}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm">Approved By</p>
                  <p className="text-sm text-muted-foreground">
                    {order?.approved_by.username}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {order?.notes && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                NOTES
              </h3>
              <p className="text-sm">{order?.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Items Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <CardTitle>Order Items</CardTitle>
            </div>
            <Button size="sm" variant={"outline"} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
          <CardDescription>
            Products included in this purchase order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Ordered Qty</TableHead>
                <TableHead className="text-right">Delivered Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Received Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order?.items.map((item) => {
                const product = item.product;
                const total = parseFloat(item.unit_price) * item.order_quantity;
                const isFullyDelivered =
                  item.delivered_quantity >= item.order_quantity;
                const isPartiallyDelivered =
                  item.delivered_quantity > 0 && !isFullyDelivered;

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {product?.name || "Unknown Product"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {product?.sku_number}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.order_quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          isFullyDelivered ? "text-green-600 font-medium" : ""
                        }
                      >
                        {item.delivered_quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      ${parseFloat(item.unit_price).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {item.received_date
                        ? formatDate(item.received_date)
                        : "Not received"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            isFullyDelivered
                              ? "default"
                              : isPartiallyDelivered
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {isFullyDelivered
                            ? "Delivered"
                            : isPartiallyDelivered
                            ? "Partial"
                            : "Pending"}
                        </Badge>

                        {/* Item Actions Dropdown */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Summary */}
          <div className="flex justify-end mt-4 pt-4 border-t">
            <div className="text-right space-y-1">
              <div className="text-sm text-muted-foreground">
                {order?.items.length} item{order?.items.length !== 1 ? "s" : ""}
              </div>
              <div className="text-lg font-bold">
                Total: ${order?.total_value.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemsPage;
