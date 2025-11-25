import { ProductPayload } from "@/types/flowdr";
import { getToken } from "./auth-action";

export const editPoduct = async (
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

    const res = await fetch(
      `${url}/api/companies/${companyId}/products/${productId}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    const result = await res.json();
    console.log(result);
    return result;
  } catch (error) {
    console.log("Error updating products", error);
    throw error;
  }
};
