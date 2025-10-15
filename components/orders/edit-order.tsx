"use client";

import React, { FC } from "react";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

export const EditOrderButton: FC<{ path: string }> = ({ path }) => {
  const router = useRouter();

  return (
    <Button
      size="sm"
      variant={"outline"}
      className="gap-2"
      onClick={() => router.push(path)}
    >
      <Edit className="h-4 w-4" />
      Edit
    </Button>
  );
};
