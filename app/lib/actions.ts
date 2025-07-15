'use server'

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: "Vui lòng nhập khách hàng."
    }),
    productId: z.string({
        invalid_type_error: "Vui lòng nhập sản phẩm."
    }),
    quantity: z.coerce
        .number()
        .gt(0, { message: "Vui lòng nhập số lượng lớn hơn 0." }),
    amount: z.coerce
        .number()
        .gt(0, { message: "Vui lòng nhập số tiền lớn hơn 0." }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: "Vui lòng chọn trạng thái."
    }),
    date: z.string().refine(
        // Simple YYYY-MM-DD format check
        (date) => /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date)),
        { message: 'Invalid date format' }
    ),
    note: z.string().optional()
})

const CustomerFormSchema = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: "Vui lòng nhập tên khách hàng."
    }),
})

const ProductFormSchema = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: "Vui lòng nhập tên sản phẩm."
    }),
    code: z.string({
        invalid_type_error: "Vui lòng nhập mã sản phẩm."
    }),
    quantity: z.coerce
        .number()
        .gt(0, { message: "Vui lòng nhập số lượng lớn hơn 0." }),
    note: z.string().optional()
})

const CostFormSchema = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: "Vui lòng nhập tên sản phẩm."
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: "Vui lòng nhập số tiền lớn hơn 0." }),
    date: z.string().refine(
        // Simple YYYY-MM-DD format check
        (date) => /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date)),
        { message: 'Invalid date format' }
    ),
    note: z.string().optional()
})

const CreateInvoice = FormSchema.omit({ id: true })
const UpdateInvoice = FormSchema.omit({ id: true })

const CreateCustomer = CustomerFormSchema.omit({ id: true })
const UpdateCustomer = CustomerFormSchema.omit({ id: true })

const CreateProduct = ProductFormSchema.omit({ id: true })
const UpdateProduct = ProductFormSchema.omit({ id: true })

const CreateCost = CostFormSchema.omit({ id: true })
const UpdateCost = CostFormSchema.omit({ id: true })

export type State = {
    errors?: {
        customerId?: string[];
        productId?: string[];
        quantity?: string[];
        amount?: string[];
        status?: string[];
        date?: string[];
        note?: string[];
    };
    message?: string | null;
};

export type CustomerState = {
    errors?: {
        name?: string[];
    };
    message?: string | null;
}

export type ProductState = {
    errors?: {
        code?: string[];
        name?: string[];
        quantity?: string[];
        note?: string[];
    };
    message?: string | null;
}

export type CostState = {
    errors?: {
        name?: string[];
        amount?: string[];
        date?: string[];
        note?: string[];
    };
    message?: string | null;
}

export async function createInvoice(prevState: State, formData: FormData) {
    // Validate from using Zod
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        productId: formData.get('productId'),
        quantity: formData.get('quantity'),
        amount: formData.get('amount'),
        status: formData.get('status'),
        date: formData.get('date'),
        note: formData.get('note') || '',
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice'
        }
    }

    // Prepare data for insertion into the database
    const { customerId, productId, quantity, amount, status, date, note } = validatedFields.data;

    const amountInCents = amount * 100;
    const safeNote = note ?? '';
    // const date = new Date().toISOString().split('T')[0];

    // Insert data into the database
    try {
        await sql`
            INSERT INTO invoices (customer_id, product_id, quantity, amount, status, date, note)
            VALUES (${customerId}, ${productId}, ${quantity}, ${amountInCents}, ${status}, ${date}, ${safeNote})
        `;
    } catch (error) {
        console.log(error)
    }

    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData
) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        productId: formData.get('productId'),
        quantity: formData.get('quantity'),
        amount: formData.get('amount'),
        status: formData.get('status'),
        date: formData.get('date'),
        note: formData.get('note') || '',
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice'
        }
    }

    const { customerId, productId, quantity, amount, status, date, note } = validatedFields.data;

    const amountInCents = amount * 100;
    const safeNote = note ?? '';

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, product_id = ${productId}, quantity = ${quantity}, amount = ${amountInCents}, status = ${status}, date = ${date}, note = ${safeNote}
            WHERE id = ${id}
        `;
    } catch (error) {
        console.log(error);
        return { message: 'Database error: Failed to Update Invoice' }
    }


    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices')
}

export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices')
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function createCustomer(prevState: CustomerState, formData: FormData) {
    // Validate from using Zod
    const validatedFields = CreateCustomer.safeParse({
        name: formData.get('name'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice'
        }
    }

    // Prepare data for insertion into the database
    const { name } = validatedFields.data;


    // Insert data into the database
    try {
        await sql`
            INSERT INTO customers (name)
            VALUES (${name})
        `;
    } catch (error) {
        console.log(error)
    }

    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

export async function updateCustomer(
    id: string,
    prevState: CustomerState,
    formData: FormData
) {
    const validatedFields = UpdateCustomer.safeParse({
        name: formData.get('name'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice'
        }
    }

    const { name } = validatedFields.data;

    try {
        await sql`
            UPDATE customers
            SET name = ${name}
            WHERE id = ${id}
        `;
    } catch (error) {
        console.log(error);
        return { message: 'Database error: Failed to Update Product' }
    }


    revalidatePath('/dashboard/customers')
    redirect('/dashboard/customers')
}

export async function createProduct(prevState: ProductState, formData: FormData) {
    // Validate from using Zod
    const validatedFields = CreateProduct.safeParse({
        code: formData.get('code'),
        name: formData.get('name'),
        quantity: formData.get('quantity'),
        note: formData.get('note') || '',
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice'
        }
    }

    // Prepare data for insertion into the database
    const { code, name, quantity, note } = validatedFields.data;

    const safeNote = note ?? '';

    // Insert data into the database
    try {
        await sql`
            INSERT INTO products (code, name, quantity, note)
            VALUES (${code}, ${name}, ${quantity}, ${safeNote})
        `;
    } catch (error) {
        console.log(error)
    }

    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
}

export async function updateProduct(
    id: string,
    prevState: State,
    formData: FormData
) {
    const validatedFields = UpdateProduct.safeParse({
        code: formData.get('code'),
        name: formData.get('name'),
        quantity: formData.get('quantity'),
        note: formData.get('note') || '',
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice'
        }
    }

    const { code, name, quantity, note } = validatedFields.data;

    const safeNote = note ?? '';

    try {
        await sql`
            UPDATE products
            SET code = ${code}, name = ${name}, quantity = ${quantity}, note = ${safeNote}
            WHERE id = ${id}
        `;
    } catch (error) {
        console.log(error);
        return { message: 'Database error: Failed to Update Product' }
    }


    revalidatePath('/dashboard/products')
    redirect('/dashboard/products')
}

export async function createCost(prevState: CostState, formData: FormData) {
    // Validate from using Zod
    const validatedFields = CreateCost.safeParse({
        name: formData.get('name'),
        amount: formData.get('amount'),
        date: formData.get('date'),
        note: formData.get('note') || '',
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice'
        }
    }

    // Prepare data for insertion into the database
    const { name, amount, date, note } = validatedFields.data;

    const safeNote = note ?? '';


    // Insert data into the database
    try {
        await sql`
            INSERT INTO costs (name, amount, date, note)
            VALUES (${name}, ${amount}, ${date}, ${safeNote})
        `;
    } catch (error) {
        console.log(error)
    }

    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/costs');
    redirect('/dashboard/costs');
}

export async function deleteCost(id: string) {
    await sql`DELETE FROM costs WHERE id = ${id}`;
    revalidatePath('/dashboard/costs')
}

export async function updateCost(
    id: string,
    prevState: CostState,
    formData: FormData
) {
    const validatedFields = UpdateCost.safeParse({
        name: formData.get('name'),
        amount: formData.get('amount'),
        date: formData.get('date'),
        note: formData.get('note') || '',
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Cost'
        }
    }

    const { name, amount, date, note } = validatedFields.data;

    const safeNote = note ?? '';

    try {
        await sql`
            UPDATE costs
            SET name = ${name}, amount = ${amount}, date = ${date}, note = ${safeNote}
            WHERE id = ${id}
        `;
    } catch (error) {
        console.log(error);
        return { message: 'Database error: Failed to Update Cost' }
    }


    revalidatePath('/dashboard/costs')
    redirect('/dashboard/costs')
}
