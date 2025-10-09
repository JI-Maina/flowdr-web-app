"use server";

import { getToken } from "@/actions/auth-action";
import { Item } from "@/components/orders/purchase/purchase-create-form";
import { SaleItem } from "@/components/orders/sale/sale-purchase-form";
import { PurchaseOrder, RequisitionOrder, SaleOrder } from "@/types/flowdr";

type PurchasePayload = {
  vendor_id: string;
  status: string;
  expected_delivery_date: string;
  notes: string;
  items: Item[];
};

type SalePayload = {
  client_id: string;
  status: string;
  required_date: string;
  shipped_date: string;
  items: SaleItem[];
};

export const createPurchaseOrder = async (
  companyId: string,
  order: PurchasePayload
) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(
      `${url}/api/companies/${companyId}/purchase-orders/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create purchase order.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching purchase order", error);
    throw error;
  }
};

export const createSaleOrder = async (branch: string, order: SalePayload) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/branches/${branch}/sale-orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(order),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create sale order.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching sale order", error);
    throw error;
  }
};
