"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

import { Product } from "@/types/flowdr";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFlowdrStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { RequisitionItem } from "./create-requisition";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PurchaseItemsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: RequisitionItem) => void;
  existingItems: RequisitionItem[];
}

export function RequisitionItemsModal({
  open,
  onOpenChange,
  onAddItem,
  existingItems,
}: PurchaseItemsModalProps) {
  const products = useFlowdrStore((state) => state.store.products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setUnitPrice("");
    setSearchTerm("");
  };

  const handleAddItem = () => {
    const item = {
      product_id: selectedProduct?.id || "",
      quantity: quantity,
      unit_price: selectedProduct?.price || "",
      quantity_fulfilled: 0,
    };

    if (selectedProduct && quantity > 0 && unitPrice) {
      onAddItem(item);
      resetForm();
    }
  };

  const isProductAlreadyAdded = selectedProduct
    ? existingItems.some((item) => item.product_id === selectedProduct.id)
    : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Order Items</DialogTitle>
          <DialogDescription>
            Select products and quantities for your purchase order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Select Product</Label>
            <Select
              value={selectedProduct?.id || ""}
              onValueChange={(value) => {
                const product = products.find((p) => p.id === value);
                setSelectedProduct(product || null);
                if (product) {
                  setUnitPrice(product.price);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a product" />
              </SelectTrigger>
              <SelectContent>
                {filteredProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      <span className="text-xs text-muted-foreground">
                        SKU: {product.sku_number} • ${product.price}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProduct && (
            <div className="grid grid-cols-2 gap-4">
              {/* Quantity Controls */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Unit Price */}
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price ($)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {selectedProduct && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{selectedProduct.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Total: $
                    {(parseFloat(unitPrice || "0") * quantity).toFixed(2)}
                  </div>
                </div>
                <Button
                  onClick={handleAddItem}
                  disabled={
                    isProductAlreadyAdded ||
                    !unitPrice ||
                    parseFloat(unitPrice) <= 0
                  }
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {isProductAlreadyAdded ? "Already Added" : "Add to Order"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
