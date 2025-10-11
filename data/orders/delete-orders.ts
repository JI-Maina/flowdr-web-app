"use server";

import { getToken } from "@/actions/auth-action";

export const deletePurchaseOrder = async (id: string, order: string) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(
      `${url}/api/companies/${id}/purchase-orders/${order}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete purchase order.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error deleting purchase order", error);
    throw error;
  }
};

export const deleteOrder = async (path: string) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/${path}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete order.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error deleting order", error);
    throw error;
  }
};
