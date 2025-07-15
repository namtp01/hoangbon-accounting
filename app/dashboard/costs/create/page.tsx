import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import Form from "@/app/ui/costs/create-form";

export default async function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'CHI PHÍ', href: '/dashboard/costs'},
                    {
                        label: 'TẠO CHI PHÍ',
                        href: '/dashboard/costs/create',
                        active: true,
                    }
                ]}
            />
            <Form />
        </main>
    )
}