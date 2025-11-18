import "server-only";

import { getToken } from "@/actions/auth-action";
import { Company, Country, Currency } from "@/types/flowdr";

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

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/countries/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch countries data.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching countries", error);
    throw error;
  }
};

export const fetchCurrencies = async (): Promise<Currency[]> => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/currencies/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch currencies data.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching currencies", error);
    throw error;
  }
};
