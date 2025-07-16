import postgres from 'postgres';
import {
  CostField,
  CostsTableType,
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  ProductField,
  ProductsTableType,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, invoices.quantity, customers.name, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(Number(invoice.quantity) * Number(invoice.amount)),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount * quantity ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount * quantity ELSE 0 END) AS "pending"
         FROM invoices`;
    const totalCostPromise = sql`SELECT SUM(amount * 100) AS total_cost FROM costs`;

    const data = await Promise.all([
      customerCountPromise,
      invoiceStatusPromise,
      totalCostPromise,
    ]);

    const numberOfCustomers = Number(data[0][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[1][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[1][0].pending ?? '0');
    const totalCosts = formatCurrency(data[2][0].total_cost ?? '0');

    return {
      numberOfCustomers,
      totalPaidInvoices,
      totalPendingInvoices,
      totalCosts,
    };    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}



const ITEMS_PER_PAGE = 10;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.quantity,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        products.name AS product_name,
        products.code AS product_code
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      JOIN products ON invoices.product_id = products.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.product_id,
        invoices.quantity,
        invoices.amount,
        invoices.status,
        invoices.date,
        invoices.note
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount * invoices.quantity ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount * invoices.quantity ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name
		ORDER BY customers.name ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchCustomersPages(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM customers
      WHERE
        customers.name ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to fetch total number of customers');
  }
}

export async function fetchProducts() {
  try {
    const products = await sql<ProductField[]>`
      SELECT
        id,
        code,
        name
      FROM products
      ORDER BY name ASC
    `;

    return products;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all products.');
  }
}

export async function fetchFilteredProducts(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  try {
    const products = await sql<ProductsTableType[]>`
		SELECT
		  products.id,
		  products.name,
      products.code,
      products.quantity,
      products.note
		FROM products
		WHERE
		  products.name ILIKE ${`%${query}%`} OR
      products.code ILIKE ${`%${query}%`}
		GROUP BY products.id, products.name
		ORDER BY products.name ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `;

    return products;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch product table.');
  }
}

export async function fetchProductById(id: string) {
  try {
    const data = await sql<ProductField[]>`
      SELECT
        id,
        code,
        name,
        quantity,
        note
      FROM products
      WHERE id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product.');
  }
}

export async function fetchCustomerById(id: string) {
  try {
    const data = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      WHERE id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer.');
  }
}

export async function fetchCosts() {
  try {
    const costs = await sql<CostField[]>`
      SELECT
        id,
        name,
        amount,
        note
      FROM costs
      ORDER BY name ASC
    `;

    return costs;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all products.');
  }
}

export async function fetchCostsPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM costs
    WHERE
      name ILIKE ${`%${query}%`} OR
      amount::text ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of costs.');
  }
}

export async function fetchFilteredCosts(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const costs = await sql<CostsTableType[]>`
      SELECT
        costs.id,
        costs.name,
        costs.amount,
        costs.note,
        costs.date
      FROM costs
      WHERE
        costs.name ILIKE ${`%${query}%`} OR
        costs.date::text ILIKE ${`%${query}%`}
      ORDER BY costs.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return costs;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch costs.');
  }
}

export async function fetchCostById(id: string) {
  try {
    const data = await sql<CostField[]>`
      SELECT
        id,
        name,
        amount,
        date,
        note
      FROM costs
      WHERE id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch cost.');
  }
}