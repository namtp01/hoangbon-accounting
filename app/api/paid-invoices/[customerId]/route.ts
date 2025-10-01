import { NextResponse } from "next/server";
import { fetchPaidInvoicesByCustomer } from "@/app/lib/data";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const customerId = url.pathname.split('/').pop();
    try {
        const data = await fetchPaidInvoicesByCustomer(customerId ?? "");
        return NextResponse.json(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error("Failed to fetch paid invoices:", error);
        return NextResponse.json([], { status: 500 });
    }
}