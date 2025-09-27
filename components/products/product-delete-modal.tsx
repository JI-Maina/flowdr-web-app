"use client";

import { toast } from "sonner";
import { Rotate3D, Trash2 } from "lucide-react";
import { Product } from "@/types/flowdr";
import { useRouter } from "next/navigation";

import { deleteProducts } from "@/data/product/delete-product";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const ProductDeleteModal = ({ product }: { product: Product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setIsOpen] = useState(false);

  const router = useRouter();

  const handleDeleteProduct = async () => {
    try {
      setIsLoading(true);
      const res = await deleteProducts(product.company, product.id);

      if (res.error === "0") {
        setIsOpen(false);
        toast.success("Success", { description: res.message });
      } else {
        toast.error("Delete Failed!", { description: res.message });
      }
    } catch (error) {
      console.log(error);
      toast.error("Delete Failed!", {
        description: "Server error, try again later!",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => router.refresh(), 300);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(value) => setIsOpen(value)}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            {product.name} and it's related data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button onClick={handleDeleteProduct} disabled={isLoading}>
            Delete
            {isLoading && <Rotate3D className="w-4 h-4 animate-spin" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProductDeleteModal;
