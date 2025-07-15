import { formatDateToLocal } from '@/app/lib/utils';
import { fetchFilteredCosts } from '@/app/lib/data';
import { DeleteCost, UpdateCost } from './buttons';

export default async function CostsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const costs = await fetchFilteredCosts(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {costs?.map((cost) => (
              <div
                key={cost.id}
                className="mb-2 w-full rounded-md bg-white p-4 border border-gray-500"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className='font-extrabold text-lg'>{cost.name}</p>
                    </div>
                    {/* <p className="text-sm text-gray-500">{invoice.email}</p> */}
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">{cost.amount}</p>
                    <p>{formatDateToLocal(cost.date)}</p>
                    <p className="text-xl font-medium">{cost.note}</p>

                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateCost id={cost.id} />
                    <DeleteCost id={cost.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-center text-sm font-normal border-b-2 border-gray-800">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Tên Chi Phí
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Số Tiền
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Ngày
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Ghi Chú
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only bg-green-300">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {costs?.map((cost) => (
                <tr
                  key={cost.id}
                  className="w-full text-center border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3 text-center">
                    <div className="items-center gap-3">
                      <p>{cost.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {cost.amount}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(cost.date)}
                  </td>
                  <td className='whitespace-nowrap px-3 py-3'>
                    {cost.note}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateCost id={cost.id} />
                      <DeleteCost id={cost.id} />
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
