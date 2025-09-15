import "server-only";

import { getToken } from "@/actions/auth-action";
import { Product } from "@/types/flowdr";

export const fetchProducts = async (id: string): Promise<Product[]> => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/companies/${id}/products/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch company products.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching products", error);
    throw error;
  }
};
