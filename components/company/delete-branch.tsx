"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Branch } from "@/types/flowdr";
import { useRouter } from "next/navigation";
import { Rotate3D, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteBranch } from "@/actions/company-actions";
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

const DeleteBranchModal = ({ branch }: { branch: Branch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setIsOpen] = useState(false);

  const router = useRouter();

  const handleDeleteProduct = async () => {
    try {
      setIsLoading(true);
      const res = await deleteBranch(branch.company, branch.id);

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
            {branch.name} and it's related data from our servers.
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

export default DeleteBranchModal;
