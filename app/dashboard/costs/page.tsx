import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { CostsTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import Table from "@/app/ui/costs/table"
import { fetchCostsPages } from "@/app/lib/data";
import Pagination from "@/app/ui/costs/pagination";
import { Metadata } from 'next'
import { CreateCost } from "@/app/ui/costs/buttons";

export const metadata: Metadata = {
  title: 'Chi Phí',
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
  const totalPages = await fetchCostsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          CHI PHÍ
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search costs..." />
        <CreateCost />
      </div>
      <Suspense key={query + currentPage} fallback={<CostsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}