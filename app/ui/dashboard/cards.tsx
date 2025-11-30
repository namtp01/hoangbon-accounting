import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
  ArrowTrendingDownIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { fetchCardData } from '@/app/lib/data';
import { formatDateToLocal } from '@/app/lib/utils';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
  costs: ArrowTrendingDownIcon,
  trucks: TruckIcon,
  collected_today: BanknotesIcon,
  costs_today: ArrowTrendingDownIcon,
};

const bgMap = {
  collected: 'bg-gradient-to-br from-green-600 via-green-500 to-emerald-400',
  pending: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500',
  costs: 'bg-gradient-to-br from-red-600 via-rose-600 to-pink-600',
  customers: 'bg-cyan-300',
  trucks: 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600',
  collected_today: 'bg-gradient-to-br from-lime-400 via-green-500 to-emerald-600',
  costs_today: 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600',
}

export default async function CardWrapper() {
  const todayDateString = new Date().toISOString();

  const formattedDate = formatDateToLocal(todayDateString);

  const {
    //numberOfInvoices,
    // numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
    totalCosts,
    totalTrucks,
    totalReceivedToday,
    totalCostsToday
  } = await fetchCardData();

  const receivedTodayTitle = `THU HÔM NAY (${formattedDate})`;
  const costsTodayTitle = `CHI HÔM NAY (${formattedDate})`;
  
  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}

      <Card title="TỔNG TIỀN HÀNG ĐÃ THU" value={totalPaidInvoices} type="collected" />
      <Card title="TỔNG TIỀN HÀNG CHƯA THU" value={totalPendingInvoices} type="pending" />
      <Card title="TỔNG TIỀN CHI" value={totalCosts} type="costs" />
      {/* <Card
        title="TỔNG SỐ KHÁCH HÀNG"
        value={numberOfCustomers}
        type="customers"
      /> */}
      <Card title={receivedTodayTitle} value={totalReceivedToday} type="collected_today" />
      <Card title={costsTodayTitle} value={totalCostsToday} type="costs_today" />
      <Card title="TỔNG SỐ XE" value={totalTrucks} type="trucks" />
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
  type: 'customers' | 'pending' | 'collected' | 'costs' | 'trucks' | 'collected_today' | 'costs_today';
}) {
  const Icon = iconMap[type];
  const bgColor = bgMap[type];

  return (
    <div className={`rounded-3xl ${bgColor} p-1 shadow-sm`}>
      <div className="flex p-4">
        {Icon ? <Icon className="h-6 w-6 text-white" /> : null}
        <h3 className="ml-2 text-xl text-white font-bold whitespace-nowrap">{title}</h3>
      </div>
      <p className={` truncate rounded-3xl bg-white px-4 py-8 text-center text-2xl`}>
        {value}
      </p> 
    </div>
  );
}
