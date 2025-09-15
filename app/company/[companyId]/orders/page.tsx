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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, Eye, Download } from "lucide-react";

// Mock data
const purchaseOrders = [
  {
    id: "Gwj97fGwta",
    vendor: "ptePUUTXnM",
    ordered_by: "bLgqxykUeF",
    approved_by: "bLgqxykUeF",
    status: "APPROVED",
    expected_delivery_date: "2025-08-31",
    total_value: 100.0,
    notes: "",
    items: [
      {
        id: "PYAAHaY7eL",
        order: "Gwj97fGwta",
        product: "K7u6HRyfcw",
        order_quantity: 10,
        delivered_quantity: 10,
        unit_price: "10.00",
        received_date: "2025-08-31",
        created_at: "2025-08-31T04:02:23.373955Z",
        updated_at: "2025-08-31T04:02:55.464501Z",
      },
    ],
  },
];

const saleOrders = [
  {
    id: "qStBXrbZpP",
    client: "ax6ZHJzM2W",
    branch: "RBZRuajbPn",
    sold_by: "bLgqxykUeF",
    status: "CONFIRMED",
    required_date: "2025-08-31",
    shipped_date: "2025-08-31",
    items: [
      {
        id: "7zuFjhhsNU",
        order: "qStBXrbZpP",
        product: "K7u6HRyfcw",
        quantity: 2,
        unit_price: "25.00",
      },
      {
        id: "o5i7722vi7",
        order: "qStBXrbZpP",
        product: "WzkMxvsshF",
        quantity: 1,
        unit_price: "30.00",
      },
    ],
  },
];

const requisitionOrders = [
  {
    id: "A22j7AnPeA",
    source_branch: "RBZRuajbPn",
    destination_branch: "M6F8VDbJaJ",
    created_by: "bLgqxykUeF",
    approved_by: "bLgqxykUeF",
    status: "FULFILLED",
    notes: "",
    items: [
      {
        id: "tM3dNd7apF",
        requisition: "A22j7AnPeA",
        product: "K7u6HRyfcw",
        quantity: 5,
        quantity_fulfilled: 5,
      },
      {
        id: "uUr6GyzMoa",
        requisition: "A22j7AnPeA",
        product: "WzkMxvsshF",
        quantity: 2,
        quantity_fulfilled: 2,
      },
    ],
  },
  {
    id: "qKQ2cCSu26",
    source_branch: "RBZRuajbPn",
    destination_branch: "M6F8VDbJaJ",
    created_by: "bLgqxykUeF",
    approved_by: "bLgqxykUeF",
    status: "FULFILLED",
    notes: "",
    items: [
      {
        id: "GCXiba6nb4",
        requisition: "qKQ2cCSu26",
        product: "WzkMxvsshF",
        quantity: 3,
        quantity_fulfilled: 3,
      },
    ],
  },
];

// Vendor and Client data (would come from API in real app)
const vendors = [{ id: "ptePUUTXnM", name: "Supplier One" }];

const clients = [{ id: "ax6ZHJzM2W", name: "Client One" }];

const branches = [
  { id: "RBZRuajbPn", name: "Main Branch" },
  { id: "M6F8VDbJaJ", name: "OTC Branch" },
];

const products = [
  { id: "K7u6HRyfcw", name: "Irutu Watch" },
  { id: "WzkMxvsshF", name: "Smart Water Bottle" },
];

const OrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("purchase");

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "APPROVED":
      case "CONFIRMED":
      case "FULFILLED":
        return "default";
      case "PENDING":
        return "secondary";
      case "REJECTED":
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const filteredPurchaseOrders = purchaseOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredSaleOrders = saleOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredRequisitionOrders = requisitionOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.source_branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.destination_branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-end items-center">
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="purchase">Purchase Orders</TabsTrigger>
          <TabsTrigger value="sale">Sale Orders</TabsTrigger>
          <TabsTrigger value="requisition">Requisition Orders</TabsTrigger>
        </TabsList>

        {/* Purchase Orders Tab */}
        <TabsContent value="purchase" className="mt-4">
          <Card>
            <CardHeader>
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
                      placeholder="Search orders..."
                      className="pl-8 w-full sm:w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="FULFILLED">Fulfilled</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPurchaseOrders.map((order) => {
                    const vendor = vendors.find((v) => v.id === order.vendor);
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>{vendor?.name || order.vendor}</TableCell>
                        <TableCell>{order.expected_delivery_date}</TableCell>
                        <TableCell>${order.total_value.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredPurchaseOrders.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        No purchase orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sale Orders Tab */}
        <TabsContent value="sale" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sale Orders</CardTitle>
              <CardDescription>
                {filteredSaleOrders.length} order
                {filteredSaleOrders.length !== 1 ? "s" : ""} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Required Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSaleOrders.map((order) => {
                    const client = clients.find((c) => c.id === order.client);
                    const branch = branches.find((b) => b.id === order.branch);
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>{client?.name || order.client}</TableCell>
                        <TableCell>{branch?.name || order.branch}</TableCell>
                        <TableCell>{order.required_date}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredSaleOrders.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        No sale orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requisition Orders Tab */}
        <TabsContent value="requisition" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Requisition Orders</CardTitle>
              <CardDescription>
                {filteredRequisitionOrders.length} order
                {filteredRequisitionOrders.length !== 1 ? "s" : ""} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requisition ID</TableHead>
                    <TableHead>From Branch</TableHead>
                    <TableHead>To Branch</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequisitionOrders.map((order) => {
                    const sourceBranch = branches.find(
                      (b) => b.id === order.source_branch
                    );
                    const destBranch = branches.find(
                      (b) => b.id === order.destination_branch
                    );
                    const totalItems = order.items.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    );

                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>
                          {sourceBranch?.name || order.source_branch}
                        </TableCell>
                        <TableCell>
                          {destBranch?.name || order.destination_branch}
                        </TableCell>
                        <TableCell>{totalItems} items</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredRequisitionOrders.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        No requisition orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersPage;
