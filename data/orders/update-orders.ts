import { getToken } from "@/actions/auth-action";
import { SaleItem } from "@/components/orders/sale/edit-sale-order";
import { Item } from "@/components/orders/purchase/edit-purchase-order";
import { RequisitionItem } from "@/components/orders/requisition/create-requisition";

type PurchasePayload = {
  vendor_id: string;
  status: string;
  expected_delivery_date: string;
  notes: string;
  items: Item[];
};

type RequisitionPayload = {
  source_branch: string;
  destination_branch: string;
  status: string;
  notes: string;
  items: RequisitionItem[];
};

type SalePayload = {
  client_id: string;
  status: string;
  required_date: string;
  shipped_date: string;
  items: SaleItem[];
};

export const updatePurchaseOrder = async (
  companyId: string,
  orderId: string,
  order: PurchasePayload
) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(
      `${url}/api/companies/${companyId}/purchase-orders/${orderId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to edit purchase order.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error updating purchase order", error);
    throw error;
  }
};

export const updateSaleOrder = async (
  branchId: string,
  orderId: string,
  order: SalePayload
) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(
      `${url}/api/branches/${branchId}/sale-orders/${orderId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to edit sale order.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error updating sale order", error);
    throw error;
  }
};

export const updateRequisitionOrder = async (
  companyId: string,
  orderId: string,
  order: RequisitionPayload
) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(
      `${url}/api/companies/${companyId}/requisition-orders/${orderId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to edit requisition order.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error updating requisition order", error);
    throw error;
  }
};
