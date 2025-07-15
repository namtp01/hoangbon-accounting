import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredInvoices } from '@/app/lib/data';

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {invoices?.map((invoice) => (
              <div
                key={invoice.id}
                className="mb-2 w-full rounded-md bg-white p-4 border border-gray-500"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className='font-extrabold text-lg'>{invoice.name}</p>
                    </div>
                    {/* <p className="text-sm text-gray-500">{invoice.email}</p> */}
                  </div>
                  <InvoiceStatus status={invoice.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {invoice.quantity} ({invoice.product_code} - {invoice.product_name}) x {formatCurrency(invoice.amount)} = {formatCurrency(invoice.amount * invoice.quantity)}
                    </p>
                    <p>{formatDateToLocal(invoice.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateInvoice id={invoice.id} />
                    <DeleteInvoice id={invoice.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-center text-sm font-normal border-b-2 border-gray-800">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Khách Hàng
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Mã
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Tên Hàng
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Số Lượng
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Giá Tiền
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Tổng Tiền
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Ngày
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Trạng Thái
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Ghi chú
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only bg-green-300">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoices?.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="w-full text-center border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3 text-center">
                    <div className="items-center gap-3">
                      <p className=''>{invoice.name}</p>
                    </div>
                  </td>
                  <td className='whitespace-nowrap px-3 py-3'>
                    {invoice.product_code}
                  </td>
                  <td className='whitespace-nowrap px-3 py-3'>
                    {invoice.product_name}
                  </td>
                  <td className='whitespace-nowrap px-3 py-3'>
                    {invoice.quantity}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(invoice.amount * invoice.quantity)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(invoice.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <InvoiceStatus status={invoice.status} />
                  </td>
                  <td className='whitespace-nowrap px-3 py-3'>
                    {invoice.note}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
