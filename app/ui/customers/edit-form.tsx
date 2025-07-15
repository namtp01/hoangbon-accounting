'use client';

import { CustomerForm } from '@/app/lib/definitions';
import {
    IdentificationIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateCustomer, CustomerState } from '@/app/lib/actions';
import { useActionState } from 'react';
import 'react-datepicker/dist/react-datepicker.css'



export default function EditInvoiceForm({
    customer
}: {
    customer: CustomerForm;
}) {
    const initialState: CustomerState = { message: null, errors: {} }
    const updateCustomerWithId = updateCustomer.bind(null, customer.id)
    const [state, formAction] = useActionState(updateCustomerWithId, initialState)

    return (
        <form action={formAction}>
            <div className='rounded-md bg-gray-50 p-4 md:p-6'>
                {/* --- Name --- */}
                <div className='mb-4'>
                    <label htmlFor='name' className='mb-2 block text-sm font-medium'>
                        Nhập tên khách hàng
                    </label>
                    <div className='relative'>
                        <input
                            id='name'
                            name='name'
                            type='text'
                            defaultValue={customer.name}
                            placeholder='Nhập tên khách hàng'
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
            <div className="mt-6 flex justify-start gap-4">
                <Link
                    href="/dashboard/customers"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    HỦY
                </Link>
                <Button type="submit">CHỈNH SỬA</Button>
            </div>
        </form>
    );
}
