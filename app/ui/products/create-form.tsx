'use client'

import { createProduct, ProductState } from "@/app/lib/actions"
import { IdentificationIcon, QrCodeIcon, ScaleIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { useActionState } from "react"
import { Button } from "@/app/ui/button"

export default function Form() {
    const inititalState: ProductState = { message: null, errors: {} }
    const [state, formAction] = useActionState(createProduct, inititalState)

    return (
        <form action={formAction}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <div className="mb-4">
                    <label htmlFor="code" className="mb-2 block text-sm font-medium">
                        Nhập mã hàng hóa
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="code"
                                name="code"
                                type="text"
                                placeholder="Nhập mã hàng hóa"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                            <QrCodeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    <div id='code-error' aria-live='polite' aria-atomic='true'>
                        {state.errors?.code?.map((error: string) => (
                            <p key={error} className='mt-2 text-sm text-red-500'>
                                {error}
                            </p>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        Nhập tên hàng hóa
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Nhập tên hàng hóa"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                            <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    <div id='name-error' aria-live='polite' aria-atomic='true'>
                        {state.errors?.name?.map((error: string) => (
                            <p key={error} className='mt-2 text-sm text-red-500'>
                                {error}
                            </p>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
                        Nhập số lượng
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="quantity"
                                name="quantity"
                                type="number"
                                placeholder="Nhập số lượng"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                            <ScaleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    <div id='quantity-error' aria-live='polite' aria-atomic='true'>
                        {state.errors?.quantity?.map((error: string) => (
                            <p key={error} className='mt-2 text-sm text-red-500'>
                                {error}
                            </p>
                        ))}
                    </div>
                </div>
                <div className='mb-4'>
                    <label htmlFor='note' className='mb-2 block text-sm font-medium'>
                        Ghi chú
                    </label>
                    <div className='relative'>
                        <textarea
                            id='note'
                            name='note'
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
                <Button type="submit">TẠO</Button>
            </div>
        </form>
    )
}