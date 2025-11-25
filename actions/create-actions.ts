"use server";

import { getToken } from "./auth-action";

export async function createCategory(
  id: string,
  data: {
    name: string;
    product_type: string;
    branch: string;
  }
) {
  const url = process.env.NEXT_PUBLIC_API_HOST;
  const token = await getToken();

  if (!token) {
    throw new Error("Authentication failed: No token found.");
  }

  try {
    const res = await fetch(`${url}/api/companies/${id}/categories/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Failed to create category");
    }

    return await res.json();
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}
