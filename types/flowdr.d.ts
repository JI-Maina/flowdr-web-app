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

export interface User {
  id: string;
  role: string;
  username: string;
  email: string;
}

export interface Inventory {
  id: string;
  product: Product;
  branch: string;
  created_by: User;
  units_available: number;
  reorder_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InventoryAudit {
  id: string;
  inventory: Inventory;
  action: string;
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  reference: string;
  notes: string;
  created_by: string;
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

export interface Vendor {
  id: string;
  user: User;
  company: string;
  first_name: string;
  last_name: string;
  vendor_type: string;
  vendor_company: string;
  primary_phone: string;
  secondary_phone: string;
  website: string;
  is_active: boolean;
}

export interface Client {
  id: string;
  user: User;
  first_name: string;
  last_name: string;
  company: string;
  branch: string;
  client_type: string;
  company_name: string;
  phone: string;
  is_active: boolean;
}

export interface PurchaseOrderItem {
  id: string;
  order: string;
  product: Product;
  order_quantity: number;
  delivered_quantity: number;
  unit_price: string;
  received_date: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrder {
  id: string;
  vendor: Vendor;
  ordered_by: User;
  approved_by: User;
  status: string;
  expected_delivery_date: string;
  total_value: number;
  notes: string;
  items: PurchaseOrderItem[];
}

export interface SaleOrderItem {
  id: string;
  order: string;
  product: Product;
  quantity: number;
  unit_price: string;
}

export interface SaleOrder {
  id: string;
  client: Client;
  branch: string;
  sold_by: User;
  status: string;
  required_date: string;
  shipped_date: string;
  items: SaleOrderItem[];
}

export interface RequisitionOrderItem {
  id: string;
  requisition: string;
  product: Product;
  quantity: number;
  quantity_fulfilled: number;
}

export interface RequisitionOrder {
  id: string;
  source_branch: string;
  destination_branch: string;
  created_by: User;
  approved_by: User;
  status: string;
  notes: string;
  items: RequisitionOrderItem[];
}

export interface Client {
  id: string;
  user: User;
  first_name: string;
  last_name: string;
  company: string;
  branch: string;
  client_type: string;
  company_name: string;
  phone: string;
  is_active: boolean;
}

export interface Vendor {
  id: string;
  user: User;
  company: string;
  first_name: string;
  last_name: string;
  vendor_type: string;
  vendor_company: string;
  primary_phone: string;
  secondary_phone: string;
  website: string;
  is_active: boolean;
}
