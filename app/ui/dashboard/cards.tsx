import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
  costs: ArrowDownIcon
};

export default async function CardWrapper() {
  const {
    //numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
    totalCosts,
  } = await fetchCardData();
  
  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}

      <Card title="TỔNG TIỀN ĐÃ THU" value={totalPaidInvoices} type="collected" />
      <Card title="Tổng TIỀN CHỜ THANH TOÁN" value={totalPendingInvoices} type="pending" />
      <Card title="TỔNG CHI PHÍ" value={totalCosts} type="costs" />
      <Card
        title="TỔNG SỐ KHÁCH HÀNG"
        value={numberOfCustomers}
        type="customers"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'customers' | 'pending' | 'collected' | 'costs';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-1 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
