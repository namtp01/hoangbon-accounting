import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import Form from "@/app/ui/products/create-form";

export default async function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Hàng Hóa', href: '/dashboard/products'},
                    {
                        label: 'Tạo Hàng Mới',
                        href: '/dashboard/products/create',
                        active: true,
                    }
                ]}
            />
            <Form />
        </main>
    )
}