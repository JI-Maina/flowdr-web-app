import "server-only";

import { getToken } from "@/actions/auth-action";
import { Company } from "@/types/flowdr";

export const fetchCompany = async (): Promise<Company[]> => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/companies/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch company data.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching companies", error);
    throw error;
  }
};
