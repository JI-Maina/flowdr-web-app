import "server-only";

import { getToken } from "@/actions/auth-action";
import { PurchaseOrder } from "@/types/flowdr";

export const fetchPurchaseOrders = async (
  id: string
): Promise<PurchaseOrder[]> => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/companies/${id}/purchase-orders/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Failed to fetch company purchase orders."
      );
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching purchase orders", error);
    throw error;
  }
};

export const fetchPurchaseOrder = async (
  id: string,
  orderId: string
): Promise<PurchaseOrder> => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(
      `${url}/api/companies/${id}/purchase-orders/${orderId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Failed to fetch company purchase order."
      );
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching purchase order", error);
    throw error;
  }
};
