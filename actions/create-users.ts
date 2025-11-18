"use server";

type VPayload = {
  user: {
    role: string;
    username: string;
    email: string;
    password: string;
  };
  first_name: string;
  last_name: string;

  // Vendor fields
  vendor_type?: string;
  vendor_company?: string;
  primary_phone?: string;
  secondary_phone?: string | undefined;
  website?: string | undefined;

  // Client fields
  client_type?: string;
  company_name?: string;
  phone?: string;
  branch?: string;
  is_active: boolean;
};

export async function createUser(path: string, user: VPayload) {
  const url = process.env.NEXT_PUBLIC_API_HOST || "";
  console.log(user);
  try {
    const res = await fetch(`${url}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    // const data = await res.json();
    // console.log("er", data);
    // if (!res.ok) {
    //   const errorData = await res.json().catch(() => ({}));
    //   throw new Error(errorData.message || "Failed to create company vendor.");
    // }

    return await res.json();
  } catch (error) {
    console.log("Error creating user", error);
    throw error;
  }
}
