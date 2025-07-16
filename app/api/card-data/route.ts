import { fetchCardData } from '@/app/lib/data';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await fetchCardData();
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse('Failed to fetch card data', { status: 500 });
  }
}
