"use server";

import { getToken } from "@/actions/auth-action";
import { PurchaseOrder } from "@/types/flowdr";

export const fetchInvoiceReceipt = async (
  branchId: string,
  invoiceId: string
): Promise<PurchaseOrder[]> => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(
      `${url}/api/branches/${branchId}/invoices/${invoiceId}/receipts/`,
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
      throw new Error(errorData.message || "Failed to fetch invoice receipt.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching invoice receipt", error);
    throw error;
  }
};
