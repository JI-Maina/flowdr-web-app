"use server";

import { getToken } from "@/actions/auth-action";

type VoucherPayload = {
  bill: string;
  amount_paid: number;
  method: string;
  account: string;
  reference_number: string;
};

export const createVoucher = async (
  companyId: string,
  billId: string,
  voucher: VoucherPayload
) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const res = await fetch(
      `${url}/api/companies/${companyId}/bills/${billId}/vouchers/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(voucher),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create bill payment.");
    }

    return await res.json();
  } catch (error) {
    console.log("Error creating bill payment", error);
    throw error;
  }
};
