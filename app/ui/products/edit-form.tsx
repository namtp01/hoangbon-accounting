'use client';

import { ProductForm } from '@/app/lib/definitions';
import {
    IdentificationIcon,
    QrCodeIcon,
    ScaleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateProduct, ProductState } from '@/app/lib/actions';
import { useActionState } from 'react';
import 'react-datepicker/dist/react-datepicker.css'

export default function EditProductForm({
    product
}: {
    product: ProductForm;
}) {
    const initialState: ProductState = { message: null, errors: {} }
    const updateProductWithId = updateProduct.bind(null, product.id)
    const [state, formAction] = useActionState(updateProductWithId, initialState)

    return (
        <form action={formAction}>
            <div className='rounded-md bg-gray-50 p-4 md:p-6'>
                <div className='flex flex-col md:flex-row md:gap-4'>
                    {/* --- Customer picker --- */}
                    <div className='mb-4 md:w-1/2'>
                        <label
                            htmlFor='code'
                            className='mb-2 block text-sm font-medium'
                        >
                            Nhập Mã
                        </label>
                        <div className='relative'>
                            <input
                                id='code'
                                name='code'
                                type='text'
                                defaultValue={product.code}
                                placeholder='Nhập mã hàng hóa'
                                className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500 outline-2'
                            />
                            <QrCodeIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
                        </div>
                        <div id='code-error' aria-live='polite' aria-atomic='true'>
                            {state.errors?.code?.map((error: string) => (
                                <p key={error} className='mt-2 text-sm text-red-500'>
                                    {error}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* --- Product picker --- */}
                    <div className='mb-4 md:w-1/2'>
                        <label
                            htmlFor='name'
                            className='mb-2 block text-sm font-medium'
                        >
                            Nhập tên hàng hóa
                        </label>
                        <div className='relative'>
                            <input
                                id='name'
                                name='name'
                                type='text'
                                defaultValue={product.name}
                                placeholder='Nhập tên hàng hóa'
                                className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500 outline-2'
                            />
                            <IdentificationIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
                        </div>
                        <div id='name-error' aria-live='polite' aria-atomic='true'>
                            {state.errors?.name?.map((error: string) => (
                                <p key={error} className='mt-2 text-sm text-red-500'>
                                    {error}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- Quantity --- */}
                <div className='mb-4'>
                    <label htmlFor='quantity' className='mb-2 block text-sm font-medium'>
                        Nhập số lượng
                    </label>
                    <div className='relative'>
                        <input
                            id='quantity'
                            name='quantity'
                            type='number'
                            step='1'
                            defaultValue={product.quantity}
                            placeholder='Nhập số lượng'
                            className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500 outline-2'
                        />
                        <ScaleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
                    </div>
                    <div id='quantity-error' aria-live='polite' aria-atomic='true'>
                        {state.errors?.quantity?.map((error: string) => (
                            <p key={error} className='mt-2 text-sm text-red-500'>
                                {error}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Note Field */}
                <div className='mb-4'>
                    <label htmlFor='note' className='mb-2 block text-sm font-medium'>
                        Ghi chú
                    </label>
                    <div className='relative'>
                        <textarea
                            id='note'
                            name='note'
                            defaultValue={product.note || ''}
                            placeholder='Nhập ghi chú (tùy chọn)'
                            className='peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-2'
                            rows={4}
                        />
                    </div>
                    <div id='note-error' aria-live='polite' aria-atomic='true'>
                        {state.errors?.note?.map((error: string) => (
                            <p key={error} className='mt-2 text-sm text-red-500'>
                                {error}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-start gap-4">
                <Link
                    href="/dashboard/products"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    HỦY
                </Link>
                <Button type="submit">CHỈNH SỬA</Button>
            </div>
        </form>
    );
}
