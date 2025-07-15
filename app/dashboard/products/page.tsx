import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { ProductsTableSkeleton } from "@/app/ui/skeletons";
import { Metadata } from "next";
import { Suspense } from "react";
import Table from "@/app/ui/products/table"
import Pagination from "@/app/ui/customers/pagination"
import { fetchCustomersPages } from "@/app/lib/data";
import { CreateProducts } from "@/app/ui/products/buttons";


export const metadata: Metadata = {
  title: 'Products'
}

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchCustomersPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl font-bold`}>
          HÀNG HÓA
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." />
        <CreateProducts />
      </div>
      <Suspense key={query + currentPage} fallback={<ProductsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}