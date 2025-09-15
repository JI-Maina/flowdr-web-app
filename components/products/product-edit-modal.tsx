import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Category, Product } from "@/types/flowdr";

const ProductEditModal: React.FC<{
  product?: Product;
  onSave: (product: Product) => void;
  onClose: () => void;
  categories: Category[];
  branches: { id: string; name: string }[];
  open: boolean;
}> = ({ product, onSave, onClose, categories, branches, open }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Update the product details below."
              : "Add a new product to your inventory."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">Product Name</Label>
            <Input
              id="product-name"
              defaultValue={product?.name || ""}
              placeholder="Enter product name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku-number">SKU Number</Label>
            <Input
              id="sku-number"
              defaultValue={product?.sku_number || ""}
              placeholder="Enter SKU number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select defaultValue={product?.category || ""}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <Select defaultValue={product?.branch || ""}>
              <SelectTrigger id="branch">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              defaultValue={product?.price || ""}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vat">VAT ($)</Label>
            <Input
              id="vat"
              type="number"
              defaultValue={product?.vat || ""}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price-type">Price Type</Label>
            <Select
              defaultValue={product?.is_price_fixed ? "fixed" : "negotiable"}
            >
              <SelectTrigger id="price-type">
                <SelectValue placeholder="Select price type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed Price</SelectItem>
                <SelectItem value="negotiable">Negotiable Price</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            className="min-h-[100px]"
            placeholder="Enter product description"
            defaultValue={product?.description || ""}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSave({
                id: product?.id || "new-id",
                company: product?.company || "okMSEmbaW7",
                branch: product?.branch || branches[0].id,
                category: product?.category || categories[0].id,
                name: "New Product",
                description: "",
                image: null,
                price: "0.00",
                is_price_fixed: true,
                created_by: "bLgqxykUeF",
                sku_number: "#00000000",
                vat: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
            }
          >
            Save Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditModal;
