"use server";

import { getToken } from "@/actions/auth-action";

interface CompanyPayload {
  name: string;
  description: string;
  country: string;
  city: string;
  currency: string;
}

export const createCompany = async (
  companyData: CompanyPayload & { logo: File | null }
) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const formData = new FormData();

    formData.append("name", companyData.name);
    formData.append("description", companyData.description);
    formData.append("country", companyData.country);
    formData.append("city", companyData.city);
    formData.append("currency", companyData.currency);

    if (companyData.logo instanceof File) {
      formData.append("logo", companyData.logo, companyData.logo.name);
    }

    const res = await fetch(`${url}/api/companies/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(JSON.stringify(errorData) || "Failed to create company.");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching purchase order", error);
    throw error;
  }
};
