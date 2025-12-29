"use server";

import { getToken } from "@/actions/auth-action";

import { AccountType, BankAccount } from "@/types/flowdr";

export const fetchAccounts = async (
  companyId: string
): Promise<BankAccount[]> => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/companies/${companyId}/accounts/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch company accounts.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching purchase accounts", error);
    throw error;
  }
};

export const fetchAccountTypes = async (): Promise<AccountType[]> => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/account-type/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch account types.");
      } else {
        throw new Error(
          `Failed to fetch account types: ${res.status} ${res.statusText}`
        );
      }
    }

    return await res.json();
  } catch (error) {
    console.log("Error fetching account types", error);
    throw error;
  }
};
