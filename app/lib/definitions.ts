// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  product_id: string;
  quantity: number;
  amount: number; // this is price
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
  note: string;
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  // image_url: string;
  // email: string;
  quantity: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string; // customer name
  product_id: string;
  product_code: string;
  product_name: string;
  quantity: number;
  date: string;
  amount: number; // this is price
  status: 'pending' | 'paid';
  note: string;
};

export type CustomersTableType = {
  id: string;
  name: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type ProductsTableType = {
  id: string;
  code: string;
  name: string;
  quantity: number;
  note: string;
};

export type CostsTableType = {
  id: string;
  name: string;
  amount: number;
  date: string;
  note: string;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type CustomerForm = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  product_id: string;
  quantity: number;
  amount: number; // this is price
  status: 'pending' | 'paid';
  date: string;
  note: string;
};

export type Product = {
  id: string;
  code: string;
  name: string;
  quantity: number;
  note: string;
}

export type ProductField = {
  id: string;
  code: string;
  name: string;
  quantity: number;
  note: string;
};

export type ProductForm = {
  id: string;
  code: string;
  name: string;
  quantity: number;
  note: string;
};

export type Cost = {
  id: string;
  name: string;
  amount: number;
  date: string;
  note: string;
};

export type CostField = {
  id: string;
  name: string;
  amount: number;
  date: string;
  note: string;
};

export type CostForm = {
  id: string;
  name: string;
  amount: number;
  date: string;
  note: string;
};


