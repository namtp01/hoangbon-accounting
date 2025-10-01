import { NextResponse } from "next/server";
import { fetchPendingInvoicesByCustomer } from "@/app/lib/data";

export async function GET(request: Request, context: { params: { customerId: string }}) {
    const { customerId } = await context.params; 
    try {
        const data = await fetchPendingInvoicesByCustomer(customerId);
        return NextResponse.json(Array.isArray(data) ? data : []);
    } catch (error) {
        return NextResponse.json([], { status: 500 });
    }
}