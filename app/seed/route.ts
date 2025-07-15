import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { invoices, customers, products, revenue, users } from '../lib/placeholder-data';
import { Invoice } from '../lib/definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedProducts() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      code VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      note TEXT,
    );
  `;

  const sanitizedProducts = products.map((product) => ({
    ...product,
    note: typeof product.note === 'string' ? product.note : null,
  }));

  const insertedProducts = await Promise.all(
    sanitizedProducts.map(
      (product) => sql`
        INSERT INTO products (code, name, quantity, note)
        VALUES (${product.code}, ${product.name}, ${product.quantity}, ${product.note})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedProducts;
}


async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      product_id UUID NOT NULL,
      quantity INT NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      note TEXT
    );
  `;

  // Filter and sanitize invoices
  const sanitizedInvoices = invoices
    .filter((invoice): invoice is Invoice => {
      return (
        typeof invoice.customer_id === 'string' &&
        typeof invoice.product_id === 'string' &&
        typeof invoice.quantity === 'number' &&
        typeof invoice.amount === 'number' &&
        typeof invoice.status === 'string' &&
        typeof invoice.date === 'string'
      );
    })
    .map((invoice) => ({
      ...invoice,
      note: typeof invoice.note === 'string' ? invoice.note : null,
    }));

  const insertedInvoices = await Promise.all(
    sanitizedInvoices.map((invoice) => sql`
      INSERT INTO invoices (
        customer_id, product_id, quantity, amount, status, date, note
      ) VALUES (
        ${invoice.customer_id},
        ${invoice.product_id},
        ${invoice.quantity},
        ${invoice.amount},
        ${invoice.status},
        ${invoice.date},
        ${invoice.note}
      ) ON CONFLICT (id) DO NOTHING;
    `)
  );

  return insertedInvoices;
}


async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
    );
  `;

  const sanitizedCustomers = customers.map((customer) => {
    if (!customer.id || !customer.name) {
      throw new Error('Customer must have both id and name');
    }
    return customer;
  });

  const insertedCustomers = await Promise.all(
    sanitizedCustomers.map(
      (customer) => sql`
        INSERT INTO customers (id, name)
        VALUES (${customer.id}, ${customer.name})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

export async function GET() {
  try {
    await sql.begin(() => [
      seedUsers(),
      seedCustomers(),
      seedProducts(),
      seedInvoices(),
      seedRevenue(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
