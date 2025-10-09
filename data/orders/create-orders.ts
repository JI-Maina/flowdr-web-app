"use server";

import { getToken } from "@/actions/auth-action";
import { Item } from "@/components/orders/purchase/purchase-create-form";
import { PurchaseOrder, RequisitionOrder, SaleOrder } from "@/types/flowdr";

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

export const fetchSaleOrders = async (id: string): Promise<SaleOrder[]> => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/branches/${id}/sale-orders/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch sale orders.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching sale orders", error);
    throw error;
  }
};

export const fetchSaleOrder = async (
  branchId: string,
  id: string
): Promise<SaleOrder> => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(
      `${url}/api/branches/${branchId}/sale-orders/${id}/`,
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
      throw new Error(errorData.message || "Failed to fetch sale order.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching sale order", error);
    throw error;
  }
};

export const fetchRequisitionOrders = async (
  id: string
): Promise<RequisitionOrder[]> => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/companies/${id}/requisition-orders/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Failed to fetch requisition orders."
      );
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching requisition orders", error);
    throw error;
  }
};

type PurchasePaylod = {
  vendor_id: string;
  status: string;
  expected_delivery_date: string;
  notes: string;
  items: Item[];
};

export const createPurchaseOrder = async (
  companyId: string,
  order: PurchasePaylod
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
