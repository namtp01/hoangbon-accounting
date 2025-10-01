'use client';

import { formatCurrency, formatDateToLocal } from "@/app/lib/utils";
import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import InvoiceStatus from "../invoices/status";
import { InvoicesTable } from "@/app/lib/definitions";

export function CreateCustomer() {
    return (
        <Link
            href="/dashboard/customers/create"
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
            <span className="hidden md:block">THÊM KHÁCH HÀNG</span>{' '}
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    )
}

export function UpdateCustomer({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/customers/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function InvoicePendingDetail ({ id }: { id: string }) {
  const [showModal, setShowModal] = useState(false);
  const [pendingInvoices, setPendingInvoices] = useState<InvoicesTable[]>([])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showModal) {
      setLoading(true);
      fetch(`/api/pending-invoices/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setPendingInvoices(Array.isArray(data) ? data : []);
        })
        .finally(() => setLoading(false));
    }
  }, [showModal, id]);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="rounded-md border p-2 hover:bg-gray-100"
      >
        (Chi tiết)
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 overflow-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              x
            </button>
            <h2 className="text-lg font-bold mb-4">Danh sách hóa đơn chưa thanh toán</h2>
            {loading ? (
              <div>Đang tải...</div>
            ) : (
              <table className="min-w-full text-gray-900">
                <thead className="rounded-lg text-center text-sm font-normal border-b-2 border-gray-800">
                  <tr>
                    <th className="px-4 py-3 font-medium sm:pl-6">Khách Hàng</th>
                    <th className="px-3 py-3 font-medium">Mã</th>
                    <th className="px-3 py-3 font-medium">Tên Hàng</th>
                    <th className="px-3 py-3 font-medium">Số Lượng</th>
                    <th className="px-3 py-3 font-medium">Giá Tiền</th>
                    <th className="px-3 py-3 font-medium">Tổng Tiền</th>
                    <th className="px-3 py-3 font-medium">Ngày</th>
                    <th className="px-3 py-3 font-medium">Trạng Thái</th>
                    <th className="px-3 py-3 font-medium">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {pendingInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-4 text-gray-500">
                        Không có hóa đơn nào đang chờ thanh toán.
                      </td>
                    </tr>
                  ) : (
                    pendingInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="text-center border-b py-3 text-sm last-of-type:border-none"
                      >
                        <td className="whitespace-nowrap py-3 pl-6 pr-3">{invoice.name}</td>
                        <td className="whitespace-nowrap px-3 py-3">{invoice.product_code}</td>
                        <td className="whitespace-nowrap px-3 py-3">{invoice.product_name}</td>
                        <td className="whitespace-nowrap px-3 py-3">{invoice.quantity}</td>
                        <td className="whitespace-nowrap px-3 py-3">{formatCurrency(invoice.amount)}</td>
                        <td className="whitespace-nowrap px-3 py-3">{formatCurrency(invoice.amount * invoice.quantity)}</td>
                        <td className="whitespace-nowrap px-3 py-3">{formatDateToLocal(invoice.date)}</td>
                        <td className="whitespace-nowrap px-3 py-3">
                          <InvoiceStatus status={invoice.status} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">{invoice.note}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* {showModal && (
        <table className="fixed inset-0 z-50 m-auto h-1/2 w-1/2 bg-white p-6 rounded shadow-md overflow-y-auto">
          <thead className="absolute justify-between items-center top-0 left-0 w-full bg-white">
            <tr>
              <th scope="col">Ma</th>
              <th scope="col">Ten</th>
            </tr>
          </thead>
        </table>
      )} */}
    </>
  )
}

export function InvoicePaidDetail ({ id }: { id: string }) {
  const [showModal, setShowModal] = useState(false);
  const [paidInvoices, setPaidInvoices] = useState<InvoicesTable[]>([])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showModal) {
      setLoading(true);
      fetch(`/api/paid-invoices/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setPaidInvoices(Array.isArray(data) ? data : []);
        })
        .finally(() => setLoading(false));
    }
  }, [showModal, id]);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="rounded-md border p-2 hover:bg-gray-100"
      >
        (Chi tiết)
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 overflow-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              x
            </button>
            <h2 className="text-lg font-bold mb-4">Danh sách hóa đơn đã thanh toán</h2>
            {loading ? (
              <div>Đang tải...</div>
            ) : (
              <table className="min-w-full text-gray-900">
                <thead className="rounded-lg text-center text-sm font-normal border-b-2 border-gray-800">
                  <tr>
                    <th className="px-4 py-3 font-medium sm:pl-6">Khách Hàng</th>
                    <th className="px-3 py-3 font-medium">Mã</th>
                    <th className="px-3 py-3 font-medium">Tên Hàng</th>
                    <th className="px-3 py-3 font-medium">Số Lượng</th>
                    <th className="px-3 py-3 font-medium">Giá Tiền</th>
                    <th className="px-3 py-3 font-medium">Tổng Tiền</th>
                    <th className="px-3 py-3 font-medium">Ngày</th>
                    <th className="px-3 py-3 font-medium">Trạng Thái</th>
                    <th className="px-3 py-3 font-medium">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {paidInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-4 text-gray-500">
                        Không có hóa đơn nào đã thanh toán.
                      </td>
                    </tr>
                  ) : (
                    paidInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="text-center border-b py-3 text-sm last-of-type:border-none"
                      >
                        <td className="whitespace-nowrap py-3 pl-6 pr-3">{invoice.name}</td>
                        <td className="whitespace-nowrap px-3 py-3">{invoice.product_code}</td>
                        <td className="whitespace-nowrap px-3 py-3">{invoice.product_name}</td>
                        <td className="whitespace-nowrap px-3 py-3">{invoice.quantity}</td>
                        <td className="whitespace-nowrap px-3 py-3">{formatCurrency(invoice.amount)}</td>
                        <td className="whitespace-nowrap px-3 py-3">{formatCurrency(invoice.amount * invoice.quantity)}</td>
                        <td className="whitespace-nowrap px-3 py-3">{formatDateToLocal(invoice.date)}</td>
                        <td className="whitespace-nowrap px-3 py-3">
                          <InvoiceStatus status={invoice.status} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">{invoice.note}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* {showModal && (
        <table className="fixed inset-0 z-50 m-auto h-1/2 w-1/2 bg-white p-6 rounded shadow-md overflow-y-auto">
          <thead className="absolute justify-between items-center top-0 left-0 w-full bg-white">
            <tr>
              <th scope="col">Ma</th>
              <th scope="col">Ten</th>
            </tr>
          </thead>
        </table>
      )} */}
    </>
  )
}