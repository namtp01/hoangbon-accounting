import Form from '@/app/ui/costs/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCostById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {

    const params = await props.params;
    const id = params.id;
    const [cost] = await Promise.all([
        fetchCostById(id),
    ]);

    if (!cost) {
        notFound()
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'KHÁCH HÀNG', href: '/dashboard/customers' },
                    {
                        label: 'CHỈNH SỬA THÔNG TIN KHÁCH HÀNG',
                        href: `/dashboard/customers/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form cost={cost} />
        </main>
    );
}