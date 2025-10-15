import { getToken } from "@/actions/auth-action";
import { Item } from "@/components/orders/purchase/edit-purchase-order";

type PurchasePayload = {
  vendor_id: string;
  status: string;
  expected_delivery_date: string;
  notes: string;
  items: Item[];
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
