"use client";

import { toast } from "sonner";
import { FC, use, useState } from "react";
import { useRouter } from "next/navigation";
import { Rotate3D, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteOrder } from "@/data/orders/delete-orders";
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
import { useQueryClient } from "@tanstack/react-query";

type DeleteProps = { path: string };

export const DeleteOrderModal: FC<DeleteProps> = ({ path }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setIsOpen] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const res = await deleteOrder(path);

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
      queryClient.invalidateQueries({ queryKey: ["saleOrders"] });
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
            This action cannot be undone. This will permanently delete order and
            it's related data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button onClick={handleDelete} disabled={isLoading}>
            Delete
            {isLoading && <Rotate3D className="w-4 h-4 animate-spin" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
