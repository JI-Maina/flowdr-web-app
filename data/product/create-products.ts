"use server";

import { getToken } from "@/actions/auth-action";
import { ProductPayload } from "@/types/flowdr";

// export const  = async ( data: ProductPayload) => {
//   try {
//     const token = await getToken();
//     const url = process.env.NEXT_PUBLIC_API_HOST;

//     const res = await fetch(, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(data),
//     });

//     if (!res.ok) {
//       const errorData = await res.json().catch(() => ({}));
//       throw new Error(
//         errorData.message || "Failed to create company products."
//       );
//     }

//     return await res.json();
//   } catch (error) {
//     console.log("Error creating products", error);
//     throw error;
//   }
// };

export const createProducts = async (
  id: string,
  companyData: ProductPayload & { image: File | null }
) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const formData = new FormData();

    formData.append("branch", companyData.branch);
    formData.append("category", companyData.category);
    formData.append("name", companyData.name);
    formData.append("description", companyData.description);
    formData.append("price", companyData.price);
    formData.append(
      "is_price_fixed",
      companyData.is_price_fixed ? "true" : "false"
    );
    formData.append("sku_number", companyData.sku_number);
    formData.append("vat", companyData.vat);

    if (companyData.image instanceof File) {
      formData.append("image", companyData.image, companyData.image.name);
    }

    const res = await fetch(`${url}/api/companies/${id}/products/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    console.log("res", res);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.log("errorData", errorData);
      throw new Error(
        JSON.stringify(errorData) || "Failed to create company products."
      );
    }

    return await res.json();
  } catch (error) {
    console.log("Error creating products", error);
    throw error;
  }
};
