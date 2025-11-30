import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchProducts } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
  const products = await fetchProducts();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'HÓA ĐƠN BÁN HÀNG', href: '/dashboard/invoices' },
          {
            label: 'TẠO HÓA ĐƠN',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} products={products} />
    </main>
  );
}