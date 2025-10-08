"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Client } from "@/types/flowdr";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, User, Building, Phone, Mail } from "lucide-react";

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "user",
    header: "Client",
    cell: ({ row }) => {
      const client = row.original;
      return (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">
              {client.first_name && client.last_name
                ? `${client.first_name} ${client.last_name}`
                : client.user.username}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {client.user.email}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "client_type",
    header: "Type",
    cell: ({ row }) => {
      const client = row.original;
      const isCompany = client.client_type === "COMPANY";

      return (
        <div className="flex items-center space-x-2">
          {isCompany ? (
            <Building className="h-4 w-4 text-blue-500" />
          ) : (
            <User className="h-4 w-4 text-green-500" />
          )}
          <Badge
            variant={isCompany ? "default" : "secondary"}
            className="capitalize"
          >
            {client.client_type.toLowerCase()}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "company_name",
    header: "Company",
    cell: ({ row }) => {
      const client = row.original;
      return (
        <div className="text-sm">
          {client.company_name || (
            <span className="text-muted-foreground italic">Individual</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Contact",
    cell: ({ row }) => {
      const client = row.original;
      return (
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm font-mono">{client.phone}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "branch",
    header: "Branch",
    cell: ({ row }) => {
      const client = row.original;
      return (
        <Badge variant="outline" className="font-normal">
          {client.branch}
        </Badge>
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
      const client = row.original;

      const handleEdit = () => {
        console.log("Edit client:", client.id);
        // Add your edit logic here
      };

      const handleDelete = () => {
        console.log("Delete client:", client.id);
        // Add your delete logic here
      };

      return (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            title="Edit client"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Delete client"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
