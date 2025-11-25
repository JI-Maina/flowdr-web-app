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
  productData: ProductPayload & { image: File | null }
) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const formData = new FormData();

    formData.append("branch", productData.branch);
    formData.append("category", productData.category);
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append(
      "is_price_fixed",
      productData.is_price_fixed ? "true" : "false"
    );
    formData.append("sku_number", productData.sku_number);
    formData.append("vat", productData.vat);

    if (productData.image) {
      formData.append("image", productData.image, productData.image.name);
    }

    const res = await fetch(`${url}/api/companies/${id}/products/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    // if (!res.ok) {
    //   // Use the error message from your API response
    //   throw new Error(result.message || `HTTP error! status: ${res.status}`);
    //   // throw new Error({"message": result.message})
    // }

    return result;
  } catch (error) {
    console.log("Error creating products", error);
    throw error;
  }
};

export const updateProduct = async (
  companyId: string,
  productId: string,
  productData: ProductPayload
) => {
  try {
    const token = await getToken();
    const url = process.env.NEXT_PUBLIC_API_HOST;

    const formData = new FormData();

    formData.append("branch", productData.branch);
    formData.append("category", productData.category);
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append(
      "is_price_fixed",
      productData.is_price_fixed ? "true" : "false"
    );
    formData.append("sku_number", productData.sku_number);
    formData.append("vat", productData.vat);

    if (productData.image instanceof File) {
      formData.append("image", productData.image, productData.image.name);
    }

    console.log(`${url}/api/companies/${companyId}/products/${productId}/`);
    console.log(formData);

    const res = await fetch(
      `${url}/api/companies/${companyId}/products/${productId}/`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const result = await res.json();

    // if (!res.ok) {
    //   // Use the error message from your API response
    //   throw new Error(result.message || `HTTP error! status: ${res.status}`);
    //   // throw new Error({"message": result.message})
    // }

    return result;
  } catch (error) {
    console.log("Error creating products", error);
    throw error;
  }
};
