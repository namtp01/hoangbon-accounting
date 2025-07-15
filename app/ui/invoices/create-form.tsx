'use client'

import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import {
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  ClockIcon,
  CalendarIcon
} from '@heroicons/react/20/solid'
import { CheckIcon as CheckOutline } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useState } from 'react'
import clsx from 'clsx'
import { CustomerField, ProductField } from '@/app/lib/definitions'
import { Button } from '@/app/ui/button'
import { useActionState } from 'react'
import { createInvoice, State } from '@/app/lib/actions'
import diacritics from 'diacritics'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

type Props = {
  customers: CustomerField[]
  products: ProductField[]
}
export default function Form({ customers, products }: Props) {
  const initialState: State = { message: null, errors: {} }
  const [state, formAction] = useActionState(createInvoice, initialState)

  /* Combobox state for customer*/
  const [customerQuery, setCustomerQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerField | null>(null)

  /* Combobox state for product */
  const [productQuery, setProductQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<ProductField | null>(null)

  /* Date picker state */
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const normalize = (str: string) => diacritics.remove(str).toLowerCase().replace(/\s+/g, '')

  const filteredCustomers =
    customerQuery === ''
      ? customers
      : customers.filter((customer) =>
        normalize(customer.name).includes(normalize(customerQuery)),
      )

  const filteredProducts =
    productQuery === ''
      ? products
      : products.filter((product) =>
        normalize(product.name).includes(normalize(productQuery)) ||
        normalize(product.code).includes(normalize(productQuery)),
      )

  return (
    <form action={formAction}>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        <div className='flex flex-col md:flex-row md:gap-4'>
          {/* --- Customer picker --- */}
          <div className='mb-4 md:w-1/2'>
            <label
              htmlFor='customer'
              className='mb-2 block text-sm font-medium'
            >
              Chọn khách hàng
            </label>

            <Combobox
              /* The name prop auto‑creates a hidden input so the selection
                 is posted as customerId – you can remove the manual hidden
                 input if you update your Zod schema to accept the object   */
              value={selectedCustomer}
              onChange={setSelectedCustomer}
              onClose={() => setCustomerQuery('')}
            >
              {/* Input & button */}
              <div className='relative'>
                <ComboboxButton className='absolute inset-y-0 left-0 flex items-center pl-2'>
                  <ChevronDownIcon className='size-5 fill-black-500 group-data-hover:fill-gray-600' />
                </ComboboxButton>
                <ComboboxInput
                  id='customer'
                  displayValue={(customer: CustomerField) => customer?.name ?? ''}
                  onChange={(e) => setCustomerQuery(e.target.value)}
                  placeholder='Tìm và chọn khách hàng'
                  className='peer block w-full rounded-md border border-gray-200 py-2 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-2'
                />
              </div>

              {/* Dropdown */}
              <ComboboxOptions
                anchor='bottom start'
                className={clsx(
                  'w-(--input-width) max-h-60 overflow-auto rounded-lg border',
                  'bg-white p-1 shadow-lg empty:invisible',
                )}
                /* important for Tailwind data‑* modifiers */
                transition
              >
                {filteredCustomers.map((customer) => (
                  <ComboboxOption
                    key={customer.id}
                    value={customer}
                    className='group flex cursor-default items-center gap-2 rounded-md px-3 py-1.5 select-none data-focus:bg-gray-100'
                  >
                    <CheckIcon className='invisible size-4 text-blue-600 group-data-selected:visible' />
                    <span className='text-sm text-gray-900'>{customer.name}</span>
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </Combobox>

            {/* Explicit hidden input */}
            <input type='hidden' name='customerId' value={selectedCustomer?.id ?? ''} />

            {/* Validation errors */}
            <div id='customer-error' aria-live='polite' aria-atomic='true'>
              {state.errors?.customerId?.map((error: string) => (
                <p key={error} className='mt-2 text-sm text-red-500'>
                  {error}
                </p>
              ))}
            </div>
          </div>

          {/* --- Product picker --- */}
          <div className='mb-4 md:w-1/2'>
            <label
              htmlFor='product'
              className='mb-2 block text-sm font-medium'
            >
              Chọn hàng hóa
            </label>

            <Combobox
              /* The name prop auto‑creates a hidden input so the selection
                 is posted as customerId – you can remove the manual hidden
                 input if you update your Zod schema to accept the object   */
              value={selectedProduct}
              onChange={setSelectedProduct}
              onClose={() => setProductQuery('')}
            >
              {/* Input & button */}
              <div className='relative'>
                <ComboboxButton className='absolute inset-y-0 left-0 flex items-center pl-2'>
                  <ChevronDownIcon className='size-5 fill-black-500 group-data-hover:fill-gray-600' />
                </ComboboxButton>
                <ComboboxInput
                  id='product'
                  displayValue={(product: ProductField) => product?.name ?? ''}
                  onChange={(e) => setProductQuery(e.target.value)}
                  placeholder='Tìm và chọn hàng hóa'
                  className='peer block w-full rounded-md border border-gray-200 py-2 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-2'
                />
              </div>

              {/* Dropdown */}
              <ComboboxOptions
                anchor='bottom start'
                className={clsx(
                  'w-(--input-width) max-h-60 overflow-auto rounded-lg border',
                  'bg-white p-1 shadow-lg empty:invisible',
                )}
                /* important for Tailwind data‑* modifiers */
                transition
              >
                {filteredProducts.map((product) => (
                  <ComboboxOption
                    key={product.id}
                    value={product}
                    className='group flex cursor-default items-center gap-2 rounded-md px-3 py-1.5 select-none data-focus:bg-gray-100'
                  >
                    <CheckIcon className='invisible size-4 text-blue-600 group-data-selected:visible' />
                    <span className='text-sm text-gray-900'>{product.code} - {product.name}</span>
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </Combobox>

            {/* Explicit hidden input */}
            <input type='hidden' name='productId' value={selectedProduct?.id ?? ''} />

            {/* Validation errors */}
            <div id='product-error' aria-live='polite' aria-atomic='true'>
              {state.errors?.productId?.map((error: string) => (
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
              placeholder='Nhập số lượng'
              className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500 outline-2'
            />
            <ScaleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
          </div>
        </div>

        {/* --- Amount --- */}
        <div className='mb-4'>
          <label htmlFor='amount' className='mb-2 block text-sm font-medium'>
            Nhập giá tiền
          </label>
          <div className='relative'>
            <input
              id='amount'
              name='amount'
              type='number'
              step='0.01'
              placeholder='Nhập giá tiền'
              className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500 outline-2'
            />
            <CurrencyDollarIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
          </div>
        </div>

        {/* --- Date Picker --- */}
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
              placeholderText='Chọn ngày'
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

        {/* --- Status --- */}
        <fieldset>
          <legend className='mb-2 block text-sm font-medium'>Đặt trạng thái</legend>
          <div className='rounded-md border border-gray-200 bg-white px-[14px] py-3'>
            <div className='flex gap-4'>
              <label className='flex cursor-pointer items-center gap-1.5'>
                <input
                  type='radio'
                  name='status'
                  value='pending'
                  className='h-4 w-4 border-gray-300 text-gray-600'
                />
                <span className='flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600'>
                  Chưa thanh toán <ClockIcon className='h-4 w-4' />
                </span>
              </label>
              <label className='flex cursor-pointer items-center gap-1.5'>
                <input
                  type='radio'
                  name='status'
                  value='paid'
                  className='h-4 w-4 border-gray-300 text-gray-600'
                />
                <span className='flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white'>
                  Đã thanh toán <CheckOutline className='h-4 w-4' />
                </span>
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      {/* --- Actions --- */}
      <div className='mt-6 flex justify-end gap-4'>
        <Link
          href='/dashboard/invoices'
          className='flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200'
        >
          Hủy
        </Link>
        <Button type='submit'>Tạo</Button>
      </div>
    </form>
  )
}
