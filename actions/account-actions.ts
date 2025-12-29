import { getToken } from "./auth-action";

interface AccountPayload {
  name: string;
  account_type: string;
  bank_account_number: string;
  description: string;
  is_active: boolean;
}

export const createAccount = async (
  companyId: string,
  account: AccountPayload
) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(`${url}/api/companies/${companyId}/accounts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(account),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(JSON.stringify(errorData) || "Failed to create account.");
    }

    return await res.json();
  } catch (error) {
    console.error("Error creating account", error);
    throw error;
  }
};

export const deleteAccount = async (companyId: string, accountId: string) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(
      `${url}/api/companies/${companyId}/accounts/${accountId}/`,
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
      throw new Error(errorData.message || "Failed to delete account.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error deleting account", error);
    throw error;
  }
};

export const updateAccount = async (
  companyId: string,
  accountId: string,
  account: AccountPayload
) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(
      `${url}/api/companies/${companyId}/accounts/${accountId}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(account),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update account.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error updating account", error);
    throw error;
  }
};
