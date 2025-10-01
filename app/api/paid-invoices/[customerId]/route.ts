import { NextResponse } from "next/server";
import { fetchPaidInvoicesByCustomer } from "@/app/lib/data";

export async function GET(request: Request, context: { params: { customerId: string }}) {
    const { customerId } = await context.params; 
    try {
        const data = await fetchPaidInvoicesByCustomer(customerId);
        return NextResponse.json(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error("Failed to fetch paid invoices:", error);
        return NextResponse.json([], { status: 500 });
    }
}