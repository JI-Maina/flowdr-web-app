import "server-only";

import { getToken } from "@/actions/auth-action";
import { Branch } from "@/types/flowdr";

export const fetchBranches = async (id: string): Promise<Branch[]> => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/companies/${id}/branches/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch company branches.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching branches", error);
    throw error;
  }
};
