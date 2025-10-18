import { FC } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Package,
  User,
  UserCheck,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditOrderButton } from "@/components/orders/edit-order";
import { fetchRequisitionOrder } from "@/data/orders/get-orders";
import { TransferCard } from "@/components/orders/requisition/transfer-card";
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

const RequisitionItemsPage: FC<ItemsProps> = async ({ params }) => {
  const { companyId, orderId } = await params;

  const order = await fetchRequisitionOrder(companyId, orderId);

  // Calculate fulfillment statistics
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalFulfilled = order.items.reduce(
    (sum, item) => sum + item.quantity_fulfilled,
    0
  );
  const fulfillmentRate =
    totalItems > 0 ? (totalFulfilled / totalItems) * 100 : 0;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "FULFILLED":
        return "default";
      case "PENDING":
        return "secondary";
      case "APPROVED":
        return "default";
      case "REJECTED":
        return "destructive";
      case "PARTIAL":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "FULFILLED":
        return CheckCircle;
      case "PENDING":
        return Clock;
      case "REJECTED":
        return XCircle;
      default:
        return Clock;
    }
  };

  const StatusIcon = getStatusIcon(order.status);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/company/${companyId}/orders/requisition`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Requisition Order</h1>
            <p className="text-muted-foreground">Order #{order.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={getStatusVariant(order.status)}
            className="text-sm px-3 py-1 gap-1"
          >
            <StatusIcon className="h-3 w-3" />
            {order.status}
          </Badge>

          <EditOrderButton
            path={`/company/${companyId}/orders/requisition/${orderId}/edit`}
          />
        </div>
      </div>

      {/* Order Details Section */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Transfer Information */}
            <TransferCard order={order} />

            {/* Fulfillment Stats */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">
                FULFILLMENT
              </h3>
              <div className="space-y-3">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {fulfillmentRate.toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Completion Rate
                  </div>
                </div>
              </div>
            </div>

            {/* Created By */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">
                CREATED BY
              </h3>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{order.created_by.username}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {order.created_by.role}
                  </div>
                </div>
              </div>
            </div>

            {/* Approved By */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">
                APPROVED BY
              </h3>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    {order.approved_by?.username}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {order.approved_by?.role}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {order.notes && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                NOTES
              </h3>
              <p className="text-sm bg-muted/50 p-3 rounded-lg">
                {order.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Items Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <CardTitle>Requisition Items</CardTitle>
            </div>
          </div>
          <CardDescription>
            Products being transferred between branches
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Requested Qty</TableHead>
                <TableHead className="text-right">Fulfilled Qty</TableHead>
                <TableHead className="text-right">Pending</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Fulfillment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => {
                const product = item.product;
                const pending = item.quantity - item.quantity_fulfilled;
                const fulfillmentRate =
                  item.quantity > 0
                    ? (item.quantity_fulfilled / item.quantity) * 100
                    : 0;
                const isFullyFulfilled =
                  item.quantity_fulfilled >= item.quantity;
                const isPartiallyFulfilled =
                  item.quantity_fulfilled > 0 && !isFullyFulfilled;

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
                      <span
                        className={
                          isFullyFulfilled
                            ? "text-green-600 font-medium"
                            : isPartiallyFulfilled
                            ? "text-orange-600 font-medium"
                            : "text-gray-600"
                        }
                      >
                        {item.quantity_fulfilled}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          pending > 0
                            ? "text-red-600 font-medium"
                            : "text-gray-600"
                        }
                      >
                        {pending}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground font-mono">
                        {product?.sku_number}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-[60px]">
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                isFullyFulfilled
                                  ? "bg-green-600"
                                  : isPartiallyFulfilled
                                  ? "bg-orange-500"
                                  : "bg-gray-400"
                              }`}
                              style={{ width: `${fulfillmentRate}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground min-w-[35px]">
                          {fulfillmentRate.toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Summary */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              Transferring {totalItems} items from {order.source_branch} to{" "}
              {order.destination_branch}
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Overall fulfillment:{" "}
                <span className="font-semibold text-green-600">
                  {fulfillmentRate.toFixed(1)}%
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                ({totalFulfilled} of {totalItems} items fulfilled)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequisitionItemsPage;
