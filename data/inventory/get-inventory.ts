"use server";

import { getToken } from "@/actions/auth-action";
import { Inventory, InventoryAudit } from "@/types/flowdr";

export const fetchInventories = async (
  branchId: string
): Promise<Inventory[]> => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/branches/${branchId}/inventories/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Failed to fetch branch inventories."
      );
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching inventories", error);
    throw error;
  }
};

export const fetchInventoryAudit = async (
  id: string
): Promise<InventoryAudit[]> => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/inventories/${id}/audits/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Failed to fetch inventory audit log."
      );
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching inventory audit log", error);
    throw error;
  }
};
