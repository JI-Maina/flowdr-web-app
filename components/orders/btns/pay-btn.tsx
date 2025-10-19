"use client";

import React, { FC } from "react";
import { useRouter } from "next/navigation";
import { BadgeDollarSignIcon } from "lucide-react";

import { Button } from "../../ui/button";

export const OrderPaymentButton: FC<{ path: string }> = ({ path }) => {
  const router = useRouter();

  return (
    <Button
      size="sm"
      variant={"destructive"}
      className="gap-2"
      onClick={() => router.push(path)}
    >
      <BadgeDollarSignIcon className="h-4 w-4" />
      Pay
    </Button>
  );
};
