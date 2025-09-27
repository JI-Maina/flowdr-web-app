// types.ts
export interface Branch {
  id: string;
  name: string;
  description: string;
  country: string;
  city: string;
  slug: string;
  status: string;
  currency: string;
  company: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  country: string;
  city: string;
  slug: string;
  logo: string | null;
  status: string;
  currency: string;
  owner: string;
  branches: Branch[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  product_type: string;
  company: string;
  branch: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  company: string;
  branch: string;
  category: string;
  name: string;
  description: string;
  image: string | null;
  price: string;
  is_price_fixed: boolean;
  created_by: string;
  sku_number: string;
  vat: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductPayload {
  branch: string;
  category: string;
  name: string;
  description: string;
  image: string;
  price: string;
  is_price_fixed: boolean;
  sku_number: string;
  vat: string;
}
