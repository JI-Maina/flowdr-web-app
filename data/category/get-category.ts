import "server-only";

import { getToken } from "@/actions/auth-action";
import { Category } from "@/types/flowdr";

export const fetchCategories = async (id: string): Promise<Category[]> => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/companies/${id}/categories/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Failed to fetch company categories."
      );
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching categories", error);
    throw error;
  }
};
