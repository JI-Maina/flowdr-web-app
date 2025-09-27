"use server";

import { getToken } from "@/actions/auth-action";
import { ProductPayload } from "@/types/flowdr";

export const updateProduct = async (
  id: string,
  product: string,
  data: ProductPayload
) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/companies/${id}/products/${product}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update company product.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error updating product", error);
    throw error;
  }
};
