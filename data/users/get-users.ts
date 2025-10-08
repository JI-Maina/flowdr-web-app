"use server";

import { getToken } from "@/actions/auth-action";

import { Client } from "@/types/flowdr";

export const fetchClients = async (id: string): Promise<Client[]> => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/users/company/${id}/clients/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch users.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching clients", error);
    throw error;
  }
};
