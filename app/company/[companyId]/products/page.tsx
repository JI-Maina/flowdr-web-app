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
import {
  Pencil,
  Plus,
  Trash2,
  Search,
  Filter,
  Image as ImageIcon,
} from "lucide-react";
import { Category, Product } from "@/types/flowdr";
import ProductEditModal from "@/components/products/product-edit-modal";

// Mock data - in a real app, this would come from an API
const productsData: Product[] = [
  {
    id: "K7u6HRyfcw",
    company: "okMSEmbaW7",
    branch: "RBZRuajbPn",
    category: "TRct7oVomH",
    name: "Irutu Watch",
    description: "",
    image: null,
    price: "25.00",
    is_price_fixed: true,
    created_by: "bLgqxykUeF",
    sku_number: "#45465776",
    vat: null,
    created_at: "2025-08-28T12:11:35.334815Z",
    updated_at: "2025-08-28T12:11:35.334848Z",
  },
  {
    id: "L8v7ISzgdv",
    company: "okMSEmbaW7",
    branch: "RBZRuajbPn",
    category: "TRct7oVomH",
    name: "Smart Water Bottle",
    description: "Keeps your water cold for 24 hours",
    image: null,
    price: "35.00",
    is_price_fixed: false,
    created_by: "bLgqxykUeF",
    sku_number: "#45465777",
    vat: "5.00",
    created_at: "2025-08-29T10:15:22.123456Z",
    updated_at: "2025-08-29T10:15:22.123489Z",
  },
  {
    id: "M9w8JTahew",
    company: "okMSEmbaW7",
    branch: "M6F8VDbJaJ",
    category: "USdt8pWpnI",
    name: "Energy Drink",
    description: "Boosts your energy instantly",
    image: null,
    price: "15.00",
    is_price_fixed: true,
    created_by: "bLgqxykUeF",
    sku_number: "#45465778",
    vat: "2.50",
    created_at: "2025-08-30T14:20:18.987654Z",
    updated_at: "2025-08-30T14:20:18.987687Z",
  },
];

const categoriesData = [
  {
    id: "TRct7oVomH",
    name: "Electronics",
    description: "Electronic gadgets and devices",
  },
  {
    id: "USdt8pWpnI",
    name: "Beverages",
    description: "Drinks and beverages",
  },
];

const branchesData = [
  {
    id: "RBZRuajbPn",
    name: "Main Branch",
  },
  {
    id: "M6F8VDbJaJ",
    name: "OTC Branch",
  },
];

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(productsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesBranch =
      branchFilter === "all" || product.branch === branchFilter;

    let matchesPrice = true;
    if (priceFilter === "fixed") {
      matchesPrice = product.is_price_fixed;
    } else if (priceFilter === "negotiable") {
      matchesPrice = !product.is_price_fixed;
    }

    return matchesSearch && matchesCategory && matchesBranch && matchesPrice;
  });

  // In a real app, these would be API calls
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
    setIsAddingProduct(false);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Combined Filters and Add Button in Card Header */}
      <Card>
        <CardHeader className="">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </CardTitle>
              <CardDescription>
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsAddingProduct(true)}
              className="md:w-auto w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoriesData.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Branch</label>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branchesData.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price Type</label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select price type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="fixed">Fixed Price</SelectItem>
                  <SelectItem value="negotiable">Negotiable Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Price Type</TableHead>
                <TableHead>VAT</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const category = categoriesData.find(
                  (c) => c.id === product.category
                );
                const branch = branchesData.find(
                  (b) => b.id === product.branch
                );

                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          {product.description && (
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.sku_number}</TableCell>
                    <TableCell>{category?.name || "Unknown"}</TableCell>
                    <TableCell>{branch?.name || "Unknown"}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.is_price_fixed ? "default" : "secondary"
                        }
                      >
                        {product.is_price_fixed ? "Fixed" : "Negotiable"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.vat ? `$${product.vat}` : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-gray-500"
                  >
                    No products found. Try adjusting your filters or add a new
                    product.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals for adding and editing */}
      {isAddingProduct && (
        <ProductEditModal
          onSave={handleAddProduct}
          onClose={() => setIsAddingProduct(false)}
          categories={categoriesData}
          branches={branchesData}
        />
      )}

      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onSave={handleEditProduct}
          onClose={() => setEditingProduct(null)}
          categories={categoriesData}
          branches={branchesData}
        />
      )}
    </div>
  );
};

export default ProductsPage;
