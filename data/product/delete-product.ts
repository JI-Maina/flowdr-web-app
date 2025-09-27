"use server";

import { getToken } from "@/actions/auth-action";

export const deleteProducts = async (id: string, product: string) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/companies/${id}/products/${product}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Failed to delete company products."
      );
    }

    return await res.json();
  } catch (error) {
    console.log("Error deleting product", error);
    throw error;
  }
};
