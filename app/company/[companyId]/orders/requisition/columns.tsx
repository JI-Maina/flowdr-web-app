"use client";

import { ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  Package,
  Delete,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useFlowdrStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { RequisitionOrder } from "@/types/flowdr";
import { DeleteOrderModal } from "@/components/orders/delete-order";

export const columns: ColumnDef<RequisitionOrder>[] = [
  {
    accessorKey: "id",
    header: "Requisition ID",
    size: 120,
    cell: ({ row }) => {
      const requisition = row.original;
      return (
        <div>
          <div className="font-mono text-sm font-medium">{requisition.id}</div>
          <div className="max-w-[200px]">
            <p className="text-sm truncate" title={requisition.notes}>
              {requisition.notes || "—"}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "branches",
    header: "Transfer",
    cell: ({ row }) => {
      const requisition = row.original;

      return <Branches requisition={requisition} />;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const requisition = row.original;

      const getStatusConfig = (status: string) => {
        switch (status) {
          case "FULFILLED":
            return {
              variant: "default" as const,
              icon: CheckCircle,
              label: "Fulfilled",
            };
          case "PENDING":
            return {
              variant: "secondary" as const,
              icon: Clock,
              label: "Pending",
            };
          case "APPROVED":
            return {
              variant: "default" as const,
              icon: CheckCircle,
              label: "Approved",
            };
          case "REJECTED":
            return {
              variant: "destructive" as const,
              icon: XCircle,
              label: "Rejected",
            };
          case "PARTIAL":
            return {
              variant: "secondary" as const,
              icon: Clock,
              label: "Partial",
            };
          default:
            return {
              variant: "outline" as const,
              icon: Clock,
              label: status,
            };
        }
      };

      const config = getStatusConfig(requisition.status);
      const IconComponent = config.icon;

      return (
        <Badge variant={config.variant} className="gap-1 capitalize">
          <IconComponent className="h-3 w-3" />
          {config.label}
        </Badge>
      );
    },
  },

  {
    accessorKey: "created_by",
    header: "Created By",
    cell: ({ row }) => {
      const requisition = row.original;
      return (
        <div>
          <div className="text-sm font-medium">
            {requisition.created_by.username}
          </div>
          <div className="text-xs text-muted-foreground capitalize">
            {requisition.created_by.role}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "approved_by",
    header: "Approved By",
    cell: ({ row }) => {
      const requisition = row.original;
      return (
        <div>
          <div className="text-sm font-medium">
            {requisition?.approved_by?.username || "—"}
          </div>
          <div className="text-xs text-muted-foreground capitalize">
            {requisition?.approved_by?.role || "—"}
          </div>
        </div>
      );
    },
  },

  {
    id: "items_summary",
    header: "Items",
    size: 120,
    cell: ({ row }) => {
      const requisition = row.original;
      const totalItems = requisition.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const totalFulfilled = requisition.items.reduce(
        (sum, item) => sum + item.quantity_fulfilled,
        0
      );

      return (
        <div className="flex items-center justify-between w-full space-x-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{totalItems} items</div>
                <div className="text-xs text-muted-foreground">
                  {totalFulfilled} fulfilled
                </div>
              </div>
            </div>
          </div>

          <ViewItemsButton order={requisition} />
        </div>
      );
    },
  },
];

const Branches = ({ requisition }: { requisition: RequisitionOrder }) => {
  const { branches } = useFlowdrStore((state) => state.store);

  const source = branches.find((b) => b.id === requisition.source_branch)?.name;
  const destination = branches.find(
    (b) => b.id === requisition.destination_branch
  )?.name;

  return (
    <div className="flex items-center gap-2">
      <div className="text-right">
        <div className="text-sm font-medium">{source}</div>
        <div className="text-xs text-muted-foreground">From</div>
      </div>
      <Truck className="h-4 w-4 text-muted-foreground" />
      <div className="text-left">
        <div className="text-sm font-medium">{destination}</div>
        <div className="text-xs text-muted-foreground">To</div>
      </div>
    </div>
  );
};

const ViewItemsButton = ({ order }: { order: RequisitionOrder }) => {
  const router = useRouter();
  const path = usePathname();

  const companyId = path.split("/")[2];

  return (
    <div className="flex gap-1.5">
      <Button
        size="sm"
        variant="outline"
        className="shrink-0 h-8 px-2"
        onClick={() => router.push(`${path}/${order.id}`)}
      >
        View
      </Button>

      <DeleteOrderModal
        path={`api/companies/${companyId}/requisition-orders/${order.id}`}
      />
    </div>
  );
};
