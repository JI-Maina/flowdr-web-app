"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Vendor } from "@/types/flowdr";
import { ColumnDef } from "@tanstack/react-table";
import {
  Edit,
  Trash2,
  User,
  Building,
  Phone,
  Mail,
  Globe,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const vendorColumns: ColumnDef<Vendor>[] = [
  {
    accessorKey: "user",
    header: "Vendor",
    cell: ({ row }) => {
      const vendor = row.original;
      return (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">
              {vendor.first_name && vendor.last_name
                ? `${vendor.first_name} ${vendor.last_name}`
                : vendor.user.username}
            </div>
            <div className="text-sm text-muted-foreground truncate flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {vendor.user.email}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "vendor_type",
    header: "Vendor Type",
    cell: ({ row }) => {
      const vendor = row.original;
      const isCompany = vendor.vendor_type === "COMPANY";

      return (
        <div className="flex items-center space-x-2">
          {isCompany ? (
            <Building className="h-4 w-4 text-purple-500" />
          ) : (
            <User className="h-4 w-4 text-green-500" />
          )}
          <Badge
            variant={isCompany ? "default" : "secondary"}
            className="capitalize"
          >
            {vendor.vendor_type.toLowerCase()}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "vendor_company",
    header: "Company",
    cell: ({ row }) => {
      const vendor = row.original;
      return (
        <div className="text-sm">
          {vendor.vendor_company || (
            <span className="text-muted-foreground italic">Individual</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const vendor = row.original;
      return (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <div className="text-sm font-mono">{vendor.primary_phone}</div>
          </div>
          {vendor.secondary_phone &&
            vendor.secondary_phone !== vendor.primary_phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <div className="text-xs text-muted-foreground font-mono">
                  {vendor.secondary_phone}
                </div>
              </div>
            )}
        </div>
      );
    },
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => {
      const vendor = row.original;
      return (
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            {vendor.website ? (
              <a
                href={
                  vendor.website.startsWith("http")
                    ? vendor.website
                    : `https://${vendor.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline truncate max-w-[120px]"
              >
                {vendor.website}
              </a>
            ) : (
              <span className="text-muted-foreground italic">No website</span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.is_active;

      return (
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={
            isActive
              ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
          }
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const vendor = row.original;

      const handleEdit = () => {
        console.log("Edit vendor:", vendor.id);
        // Add your edit logic here
      };

      const handleDelete = () => {
        console.log("Delete vendor:", vendor.id);
        // Add your delete logic here
      };

      const handleViewOrders = () => {
        console.log("View vendor orders:", vendor.id);
        // Navigate to vendor orders
      };

      const handleContact = () => {
        console.log("Contact vendor:", vendor.id);
        // Open contact modal or email
      };

      return (
        <div className="flex items-center justify-end space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            title="Edit vendor"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 data-[state=open]:bg-muted"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem onClick={handleViewOrders} className="gap-2">
                <Building className="h-4 w-4" />
                View Orders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleContact} className="gap-2">
                <Mail className="h-4 w-4" />
                Contact
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="gap-2 text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Delete Vendor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
