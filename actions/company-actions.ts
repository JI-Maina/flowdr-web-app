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

export const editCompany = async (
  id: string,
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

    const res = await fetch(`${url}/api/companies/${id}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(JSON.stringify(errorData) || "Failed to edit company.");
    }

    return await res.json();
  } catch (error) {
    console.error("Error editing company details", error);
    throw error;
  }
};

export const createBranch = async (id: string, companyData: CompanyPayload) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/companies/${id}/branches/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(companyData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(JSON.stringify(errorData) || "Failed to add branch.");
    }

    return await res.json();
  } catch (error) {
    console.error("Error adding banch to company", error);
    throw error;
  }
};

export const editBranch = async (
  companyId: string,
  branchId: string,
  branch: CompanyPayload
) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(
      `${url}/api/companies/${companyId}/branches/${branchId}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(branch),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(JSON.stringify(errorData) || "Failed to edit branch.");
    }

    return await res.json();
  } catch (error) {
    console.error("Error editing banch", error);
    throw error;
  }
};

export const deleteBranch = async (id: string, branchId: string) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(
      `${url}/api/companies/${id}/branches/${branchId}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete branch.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error deleting branch", error);
    throw error;
  }
};
