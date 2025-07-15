'use client'

import { CostState, createCost } from "@/app/lib/actions"
import { CalendarIcon, CurrencyDollarIcon, UserCircleIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { useActionState, useState } from "react"
import { Button } from "@/app/ui/button"
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css'

export default function Form() {
    const inititalState: CostState = { message: null, errors: {} }
    const [state, formAction] = useActionState(createCost, inititalState)

    /* Date picker state */
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    return (
        <form action={formAction}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        Nhập tên chi phí
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Nhập tên chi phí"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
                <div className='mb-4'>
                    <label htmlFor='amount' className='mb-2 block text-sm font-medium'>
                        Nhập Số Tiền
                    </label>
                    <div className='relative'>
                        <input
                            id='amount'
                            name='amount'
                            type='number'
                            placeholder='Nhập tên chi phí'
                            className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500 outline-2'
                        />
                        <CurrencyDollarIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
                    </div>
                    <div id='amount-error' aria-live='polite' aria-atomic='true'>
                        {state.errors?.amount?.map((error: string) => (
                            <p key={error} className='mt-2 text-sm text-red-500'>
                                {error}
                            </p>
                        ))}
                    </div>
                </div>
                <div className='mb-4'>
                    <label htmlFor='date' className='mb-2 block text-sm font-medium'>
                        Chọn ngày
                    </label>
                    <div className='relative'>
                        <DatePicker
                            id='date'
                            name='date'
                            selected={selectedDate}
                            onChange={(date: Date | null) => setSelectedDate(date)}
                            placeholderText='yyyy-MM-dd'
                            dateFormat='yyyy-MM-dd'
                            className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-2'
                        />
                        <CalendarIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
                    </div>
                    <div id='date-error' aria-live='polite' aria-atomic='true'>
                        {state.errors?.date?.map((error: string) => (
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
                    href="/dashboard/costs"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    HỦY
                </Link>
                <Button type="submit">TẠO</Button>
            </div>
        </form>
    )
}