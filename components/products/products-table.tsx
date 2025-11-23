"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Branch, Category, Product } from "@/types/flowdr";
import { Pencil, Plus, Search, Filter, Image as ImageIcon } from "lucide-react";

import { useFlowdrStore } from "@/store/store";
import ProductDeleteModal from "./product-delete-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import ProductEditModal from "./product-edit-modal";

type ProductsTableProps = {
  productsData: Product[];
  categoriesData: Category[];
  branchesData: Branch[];
};

const ProductsTable = ({
  productsData,
  categoriesData,
  branchesData,
}: ProductsTableProps) => {
  const [products, setProducts] = useState<Product[]>(productsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");

  const path = usePathname();
  const router = useRouter();

  const { updateBranches, updateCategories, updateProducts } = useFlowdrStore(
    (state) => state
  );

  console.log("branch ", branchesData);
  console.log("cat ", categoriesData);

  useEffect(() => {
    setProducts(productsData);
    updateProducts(productsData);
    updateCategories(categoriesData);
    updateBranches(branchesData);
  }, [
    productsData,
    categoriesData,
    branchesData,
    updateProducts,
    updateCategories,
    updateBranches,
    setProducts,
  ]);

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
              onClick={() => router.push(`${path}/add`)}
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
                        <ProductEditModal product={product} />

                        <ProductDeleteModal product={product} />
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
    </div>
  );
};

export default ProductsTable;
