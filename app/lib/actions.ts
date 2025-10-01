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

// const ProductFormSchema = z.object({
//     id: z.string(),
//     name: z.string({
//         invalid_type_error: "Vui lòng nhập tên sản phẩm."
//     }),
//     code: z.string({
//         invalid_type_error: "Vui lòng nhập mã sản phẩm."
//     }),
//     quantity: z.coerce
//         .number()
//         .gt(0, { message: "Vui lòng nhập số lượng lớn hơn 0." }),
//     note: z.string().optional()
// })

// const UpdateProductFormSchema = z.object({
//     id: z.string(),
//     name: z.string({
//         invalid_type_error: "Vui lòng nhập tên sản phẩm."
//     }),
//     code: z.string({
//         invalid_type_error: "Vui lòng nhập mã sản phẩm."
//     }),
//     quantity: z.coerce
//         .number()
//         .gt(0, { message: "Vui lòng nhập số lượng lớn hơn 0." }),
//     note: z.string().optional()
// })

// Schema for a single product
const ProductSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Vui lòng nhập tên hàng hóa.' })
        .max(100, { message: 'Tên hàng hóa không được vượt quá 100 ký tự.' }),
    quantity: z.coerce
        .number()
        .int()
        .gt(0, { message: 'Vui lòng nhập số lượng lớn hơn 0.' }),
    note: z.string().max(500, { message: 'Ghi chú không được vượt quá 500 ký tự.' }).optional(),
});

// Schema for the entire form
const CreateProductFormSchema = z.object({
    code: z
        .string({
            invalid_type_error: "Vui lòng nhập mã sản phẩm."
        }),
    products: z
        .array(ProductSchema)
        .min(1, { message: 'Phải có ít nhất một hàng hóa.' })
        .max(10, { message: 'Không được thêm quá 10 hàng hóa.' }),
}).refine(
    (data) => new Set(data.products.map((p) => p.name)).size === data.products.length,
    {
        message: 'Tên hàng hóa phải là duy nhất trong cùng một container.',
        path: ['products'],
    }
);

const UpdateProductSchema = z.object({
    code: z.string({
        invalid_type_error: "Vui lòng nhập mã sản phẩm."
    }),
    name: z.string({
        invalid_type_error: "Vui lòng nhập tên sản phẩm."
    }),
    quantity: z.coerce.number().int().gt(0, { message: 'Vui lòng nhập số lượng lớn hơn 0.' }),
    note: z.string().optional()
});

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

// const CreateProduct = ProductFormSchema.omit({ id: true })
// const UpdateProduct = UpdateProductFormSchema.omit({ id: true })

// const CreateProduct = CreateProductFormSchema.omit({ id: true })
// const UpdateProduct = CreateProductFormSchema.omit({ id: true })

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

// export type ProductState = {
//     errors?: {
//         code?: string[];
//         name?: string[];
//         quantity?: string[];
//         note?: string[];
//     };
//     message?: string | null;
// }

export type ProductState = {
    errors?: {
        code?: string[];
        products?: {
            name?: string[];
            quantity?: string[];
            note?: string[]
        }[]
    };
    message?: string | null;
}

export type UpdateProductState = {
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
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/invoices');
    revalidatePath('/dashboard/customers');
    revalidatePath('/dashboard/products');
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

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/invoices')
    revalidatePath('/dashboard/customers')
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
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/invoices')
    revalidatePath('/dashboard/invoices/create')
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
    revalidatePath('/dashboard/invoices')
    revalidatePath('/dashboard/invoices/create')
    redirect('/dashboard/customers')
}

export async function createProduct(prevState: ProductState, formData: FormData): Promise<ProductState> {
    const data: { code: string; products: { name: string; quantity: string; note: string }[] } = {
        code: formData.get('code')?.toString() || '',
        products: []
    };
    let index = 0
    while (formData.get(`products[${index}][name]`)) {
        data.products.push({
            name: formData.get(`products[${index}][name]`)?.toString() || '',
            quantity: formData.get(`products[${index}][quantity]`)?.toString() || '',
            note: formData.get(`products[${index}][note]`)?.toString() || '',
        })
        index++;
    }

    // Validate form data
    const validatedFields = CreateProductFormSchema.safeParse(data);
    if (!validatedFields.success) {
        const fieldErrors = validatedFields.error.flatten().fieldErrors;
        return {
            message: 'Dữ liệu không hợp lệ. Không thể tạo sản phẩm.',
            errors: {
                code: fieldErrors.code,
                products: fieldErrors.products
                    ? fieldErrors.products.map((error) =>
                        typeof error === 'string'
                            ? { name: [error] }
                            : error
                    )
                    : undefined,
            },
        };
    }

    const { code: validatedCode, products: validatedProducts } = validatedFields.data;

    // Insert data into the database
    try {
        await sql.begin(async (sql) => {
            for (const product of validatedProducts) {
                const { name, quantity, note } = product;
                await sql`
                    INSERT INTO products (code, name, quantity, note)
                    VALUES (${validatedCode}, ${name}, ${quantity}, ${note || ''})
                `;
            }
        })
    } catch (error) {
        console.log(error)
        return {
            message: 'Không thể tạo sản phẩm do lỗi cơ sở dữ liệu.',
            errors: {},
        };
    }

    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/invoices')
    revalidatePath('/dashboard/invoices/create')
    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
}

export async function updateProduct(
    id: string,
    prevState: UpdateProductState,
    formData: FormData
): Promise<UpdateProductState> {
    const validatedFields = UpdateProductSchema.safeParse({
        code: formData.get('code')?.toString() || '',
        name: formData.get('name')?.toString() || '',
        quantity: formData.get('quantity')?.toString() || '',
        note: formData.get('note')?.toString() || '',
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
        console.error('Database error:', error);
        return {
            message: 'Không thể cập nhật sản phẩm do lỗi cơ sở dữ liệu.',
            errors: {},
        };
    }


    revalidatePath('/dashboard/products')
    revalidatePath('/dashboard/invoices')
    revalidatePath('/dashboard/invoices/create')
    redirect('/dashboard/products')
}

export async function deleteProduct(id: string) {
    await sql`DELETE FROM products WHERE id = ${id}`;
    revalidatePath('/dashboard/products')
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
    revalidatePath('/dashboard')
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
    revalidatePath('/dashboard')
    redirect('/dashboard/costs')
}
