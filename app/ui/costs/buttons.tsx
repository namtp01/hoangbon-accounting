'use client'

import { deleteCost } from "@/app/lib/actions";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useRef } from "react";

export function CreateCost() {
  return (
    <Link
      href="/dashboard/costs/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">TẠO CHI PHÍ</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateCost({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/costs/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteCost({ id }: { id: string }) {
  const deleteCostWithId = deleteCost.bind(null, id);

  const [showModal, setShowModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="rounded-md border p-2 hover:bg-gray-100"
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <p className="mb-4 font-medium">Bạn có chắc muốn xóa dòng này không?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={() => formRef.current?.submit()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden form for POST request */}
      <form
        ref={formRef}
        action={deleteCostWithId}
        style={{ display: 'none' }}
      />
    </>
  );
}