"use server";

import { getToken } from "@/actions/auth-action";

import { Bill } from "@/types/flowdr";

export const fetchBills = async (companyId: string): Promise<Bill[]> => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/companies/${companyId}/bills/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch company bills.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching purchase bills", error);
    throw error;
  }
};

export const fetchBill = async (
  companyId: string,
  id: string
): Promise<Bill> => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/companies/${companyId}/bills/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch company bills.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching purchase bills", error);
    throw error;
  }
};
