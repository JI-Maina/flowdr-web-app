"use client";

import React from "react";
import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "../../ui/button";

export const OrderButton = () => {
  const router = useRouter();
  const path = usePathname();

  return (
    <Button size="sm" onClick={() => router.push(`${path}/add`)}>
      <Plus className="w-4 h-4 mr-2" />
      Add Order
    </Button>
  );
};
