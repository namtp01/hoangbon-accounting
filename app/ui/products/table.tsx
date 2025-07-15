import { fetchFilteredProducts } from '@/app/lib/data';
import { DeleteProduct, UpdateProduct } from '../invoices/buttons';
import { formatCurrency, formatNumber } from '../../lib/utils';

export default async function ProductsTable({
    query,
    currentPage
}: {
    query: string;
    currentPage: number;
}) {
    const products = await fetchFilteredProducts(query, currentPage);

    return (
        <div className="w-full">
            <div className="mt-6 flow-root">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
                            <div className="md:hidden">
                                {products?.map((product) => (
                                    <div
                                        key={product.id}
                                        className="mb-2 w-full rounded-md bg-white p-4 border-2 border-neutral-600"
                                    >

                                        <div className="flex items-center justify-between border-b pb-4">
                                            <div>
                                                <div className="mb-2 flex items-center">
                                                    <div className="flex items-center gap-3">
                                                        <p>{product.name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex w-full items-center justify-between border-b py-5">
                                            <div className="flex w-1/2 flex-col">
                                                <p className="text-xs">Số Lượng</p>
                                                <p className="font-medium">{formatNumber(product.quantity)}</p>
                                            </div>
                                            <div className="flex w-1/2 flex-col">
                                                <p className="text-xs">Ghi chú</p>
                                                <p className="font-medium">{product.note}</p>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                            <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                                    <tr>
                                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                            Mã
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Tên Hàng
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Số Lượng
                                        </th>
                                        <th scope="col" className="px-4 py-5 font-medium">
                                            Ghi Chú
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 text-gray-900">
                                    {products.map((product) => (
                                        <tr key={product.id} className="group">
                                            <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                                                <div className="flex items-center gap-3">

                                                    <p>{product.code}</p>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                                                <div className="flex items-center gap-3">

                                                    <p>{product.name}</p>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                                {formatNumber(product.quantity)}
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-2 py-5 text-sm">
                                                {product.note}
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-3 pl-6 py-3">
                                                <div className="flex justify-end gap-3">
                                                    <UpdateProduct id={product.id} />
                                                    <DeleteProduct id={product.id} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
