"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Search, Filter, Download, ArrowUpDown, Eye } from "lucide-react";

// Mock data
const inventoryData = [
  {
    id: "cwhpZmpLqc",
    inventory: "bMzSgcnDLD",
    action: "STOCK_IN",
    quantity: 10,
    previous_quantity: 15,
    new_quantity: 25,
    reference: "PO-Gwj97fGwta",
    notes: "Purchase order Approved",
    created_by: "bLgqxykUeF",
    created_at: "2025-08-31T04:02:55.454316Z",
    updated_at: "2025-08-31T04:02:55.454395Z",
  },
  {
    id: "nfu3y4xWf4",
    inventory: "bMzSgcnDLD",
    action: "STOCK_IN",
    quantity: 10,
    previous_quantity: 5,
    new_quantity: 15,
    reference: "PO-4VCzkjgRzY",
    notes: "Purchase order Approved",
    created_by: "bLgqxykUeF",
    created_at: "2025-08-30T17:15:35.091969Z",
    updated_at: "2025-08-30T17:15:35.091996Z",
  },
  {
    id: "RLDf6XWJNX",
    inventory: "bMzSgcnDLD",
    action: "STOCK_IN",
    quantity: 5,
    previous_quantity: 0,
    new_quantity: 5,
    reference: "PO-4WzAnTcYyG",
    notes: "Purchase order Approved",
    created_by: "bLgqxykUeF",
    created_at: "2025-08-30T13:50:52.103073Z",
    updated_at: "2025-08-30T13:50:52.103130Z",
  },
  {
    id: "abc123def456",
    inventory: "xYz789Inventory",
    action: "STOCK_OUT",
    quantity: 3,
    previous_quantity: 20,
    new_quantity: 17,
    reference: "SO-qStBXrbZpP",
    notes: "Sale order processed",
    created_by: "bLgqxykUeF",
    created_at: "2025-09-01T10:30:15.123456Z",
    updated_at: "2025-09-01T10:30:15.123489Z",
  },
  {
    id: "ghi789jkl012",
    inventory: "bMzSgcnDLD",
    action: "ADJUSTMENT",
    quantity: -2,
    previous_quantity: 25,
    new_quantity: 23,
    reference: "ADJ-001",
    notes: "Damaged goods write-off",
    created_by: "user456",
    created_at: "2025-09-02T14:45:22.987654Z",
    updated_at: "2025-09-02T14:45:22.987687Z",
  },
];

// Mock inventory items (would come from API in real app)
const inventoryItems = [
  { id: "bMzSgcnDLD", name: "Irutu Watch", sku: "IW-001" },
  { id: "xYz789Inventory", name: "Smart Water Bottle", sku: "SWB-002" },
];

// Mock users (would come from API in real app)
const users = [
  { id: "bLgqxykUeF", name: "John Doe" },
  { id: "user456", name: "Jane Smith" },
];

const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [inventoryFilter, setInventoryFilter] = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");

  // Filter and sort inventory data
  const filteredInventory = inventoryData
    .filter((record) => {
      const matchesSearch =
        record.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.notes.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAction =
        actionFilter === "all" || record.action === actionFilter;
      const matchesInventory =
        inventoryFilter === "all" || record.inventory === inventoryFilter;

      return matchesSearch && matchesAction && matchesInventory;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "quantity":
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case "new_quantity":
          aValue = a.new_quantity;
          bValue = b.new_quantity;
          break;
        case "created_at":
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case "reference":
          aValue = a.reference;
          bValue = b.reference;
          break;
        default:
          aValue = a[sortField as keyof typeof a];
          bValue = b[sortField as keyof typeof b];
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getActionVariant = (action: string) => {
    switch (action) {
      case "STOCK_IN":
        return "default";
      case "STOCK_OUT":
        return "destructive";
      case "ADJUSTMENT":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getActionDisplay = (action: string) => {
    switch (action) {
      case "STOCK_IN":
        return "Stock In";
      case "STOCK_OUT":
        return "Stock Out";
      case "ADJUSTMENT":
        return "Adjustment";
      default:
        return action;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6 overflow-x-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-gray-500">
            Track inventory movements and adjustments
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </CardTitle>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search references or notes..."
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="STOCK_IN">Stock In</SelectItem>
                  <SelectItem value="STOCK_OUT">Stock Out</SelectItem>
                  <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={inventoryFilter}
                onValueChange={setInventoryFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by item" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  {inventoryItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("reference")}
                  >
                    <div className="flex items-center">
                      Reference
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("inventory")}
                  >
                    <div className="flex items-center">
                      Item
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100 text-right"
                    onClick={() => handleSort("quantity")}
                  >
                    <div className="flex items-center justify-end">
                      Qty Change
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100 text-right"
                    onClick={() => handleSort("new_quantity")}
                  >
                    <div className="flex items-center justify-end">
                      New Qty
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("created_at")}
                  >
                    <div className="flex items-center">
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((record) => {
                  const inventoryItem = inventoryItems.find(
                    (item) => item.id === record.inventory
                  );
                  const user = users.find((u) => u.id === record.created_by);

                  return (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.reference}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {inventoryItem?.name || "Unknown Item"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {inventoryItem?.sku || record.inventory}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionVariant(record.action)}>
                          {getActionDisplay(record.action)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            record.quantity > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {record.quantity > 0 ? "+" : ""}
                          {record.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {record.new_quantity}
                      </TableCell>
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={record.notes}
                      >
                        {record.notes}
                      </TableCell>
                      <TableCell>{formatDate(record.created_at)}</TableCell>
                      <TableCell>{user?.name || record.created_by}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredInventory.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-gray-500"
                    >
                      No inventory records found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination would go here in a real implementation */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-gray-500">
              Showing {filteredInventory.length} of {inventoryData.length}{" "}
              records
            </div>
            {/* Pagination controls would go here */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryPage;
