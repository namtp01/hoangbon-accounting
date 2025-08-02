'use client'

import { createProduct, ProductState } from "@/app/lib/actions"
import { IdentificationIcon, PlusIcon, QrCodeIcon, ScaleIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { useActionState, useState } from "react"
import { Button } from "@/app/ui/button"

export default function Form() {
    const inititalState: ProductState = { message: null, errors: {} }
    const [state, formAction] = useActionState(createProduct, inititalState)
    const [products, setProducts] = useState([{ name: '', quantity: '', note: '' }])

    const addProduct = () => {
        if (products.length < 10) {
            setProducts([...products, { name: '', quantity: '', note: '' }])
        }
    }

    const removeProduct = (index: number) => {
        if (products.length > 1) {
            setProducts(products.filter((_, i) => i !== index))
        }
    }

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
                {products.map((product, index) => (
                    <div key={index} className="mb-6 border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-medium">Hàng hóa {index + 1}</h3>
                            {products.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeProduct(index)}
                                    className="text-sm text-red-500 hover:text-red-700"
                                >
                                    Xóa
                                </button>
                            )}
                        </div>
                        {/* Merchandise Name */}
                        <div className="mb-4">
                            <label htmlFor={`name_${index}`} className="mb-2 block text-sm font-medium">
                                Nhập tên hàng hóa
                            </label>
                            <div className="relative mt-2 rounded-md">
                                <div className="relative">
                                    <input
                                        id={`product_name_${index}`}
                                        name={`products[${index}][name]`}
                                        type="text"
                                        placeholder="Nhập tên hàng hóa"
                                        value={product.name}
                                        onChange={(e) =>
                                            setProducts(
                                                products.map((p, i) =>
                                                    i === index ? { ...p, name: e.target.value } : p
                                                )
                                            )
                                        }
                                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    />
                                    <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                            <div id={`name_${index}-error`} aria-live="polite" aria-atomic="true">
                                {state.errors?.products?.[index]?.name?.map((error: string) => (
                                    <p key={error} className="mt-2 text-sm text-red-500">
                                        {error}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mb-4">
                            <label htmlFor={`quantity_${index}`} className="mb-2 block text-sm font-medium">
                                Nhập số lượng
                            </label>
                            <div className="relative mt-2 rounded-md">
                                <div className="relative">
                                    <input
                                        id={`quantity_${index}`}
                                        name={`products[${index}][quantity]`}
                                        type="number"
                                        placeholder="Nhập số lượng"
                                        value={product.quantity}
                                        onChange={(e) =>
                                            setProducts(
                                                products.map((p, i) =>
                                                    i === index ? { ...p, quantity: e.target.value } : p
                                                )
                                            )
                                        }
                                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    />
                                    <ScaleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                            <div id={`quantity_${index}-error`} aria-live="polite" aria-atomic="true">
                                {state.errors?.products?.[index]?.quantity?.map((error: string) => (
                                    <p key={error} className="mt-2 text-sm text-red-500">
                                        {error}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* Note */}
                        <div className="mb-4">
                            <label htmlFor={`note_${index}`} className="mb-2 block text-sm font-medium">
                                Ghi chú
                            </label>
                            <div className="relative">
                                <textarea
                                    id={`note_${index}`}
                                    name={`products[${index}][note]`}
                                    placeholder="Nhập ghi chú (tùy chọn)"
                                    value={product.note}
                                    onChange={(e) =>
                                        setProducts(
                                            products.map((p, i) =>
                                                i === index ? { ...p, note: e.target.value } : p
                                            )
                                        )
                                    }
                                    className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-2"
                                    rows={4}
                                />
                            </div>
                            <div id={`note_${index}-error`} aria-live="polite" aria-atomic="true">
                                {state.errors?.products?.[index]?.note?.map((error: string) => (
                                    <p key={error} className="mt-2 text-sm text-red-500">
                                        {error}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                {/* Add Additional Product Button */}
                {products.length < 10 && (
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={addProduct}
                            className="flex items-center rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-200 transition-colors"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Thêm hàng hóa khác (Tối đa 10)
                        </button>
                    </div>
                )}
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