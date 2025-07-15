// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
  },
];

const customers = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'Hoa',
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Phượng',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Dũng',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    name: 'Linh',
  },
  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    name: 'Danh',
  },
  {
    id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
    name: 'Văn',
  },
  {
    name: 'Huyền',
  },
];

const products = [
  {
    id: '13D12715-C99E-5627-B013-F9D3EF4E0FDH',
    code: '000001',
    name: 'Táo',
    quantity: 2110,
    note: ''
  },
  {
    id: '14D97715-C59A-7111-L014-F2E6ET4E0BDF',
    code: '000002',
    name: 'Lê',
    quantity: 2110,
    note: ''
  },
  {
    id: '11D16215-C88E-5627-B013-A9D4EF6A2PBH',
    code: '000003',
    name: 'Quýt',
    quantity: 2110,
    note: ''
  }
]

const invoices = [
  {
    customer_id: customers[0].id,
    product_id: products[0].id,
    quantity: 10,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
    note: '',
  },
  {
    customer_id: customers[1].id,
    product_id: products[0].id,
    quantity: 15,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
    note: '',
  },
  {
    customer_id: customers[4].id,
    product_id: products[0].id,
    quantity: 20,
    amount: 3040,
    status: 'paid',
    date: '2022-10-29',
    note: '',
  },
  {
    customer_id: customers[3].id,
    product_id: products[1].id,
    quantity: 10,
    amount: 44800,
    status: 'paid',
    date: '2023-09-10',
    note: '',
  },
  {
    customer_id: customers[5].id,
    product_id: products[0].id,
    quantity: 5,
    amount: 34577,
    status: 'pending',
    date: '2023-08-05',
    note: '',
  },
  {
    customer_id: customers[2].id,
    product_id: products[0].id,
    quantity: 10,
    amount: 54246,
    status: 'pending',
    date: '2023-07-16',
    note: '',
  },
  {
    customer_id: customers[0].id,
    product_id: products[1].id,
    quantity: 10,
    amount: 666,
    status: 'pending',
    date: '2023-06-27',
    note: '',
  },
  {
    customer_id: customers[3].id,
    product_id: products[1].id,
    quantity: 20,
    amount: 32545,
    status: 'paid',
    date: '2023-06-09',
    note: '',
  },
  {
    customer_id: customers[4].id,
    product_id: products[1].id,
    quantity: 10,
    amount: 1250,
    status: 'paid',
    date: '2023-06-17',
    note: '',
  },
  {
    customer_id: customers[5].id,
    product_id: products[1].id,
    quantity: 10,
    amount: 8546,
    status: 'paid',
    date: '2023-06-07',
    note: '',
  },
  {
    customer_id: customers[1].id,
    product_id: products[1].id,
    quantity: 10,
    amount: 500,
    status: 'paid',
    date: '2023-08-19',
    note: '',
  },
  {
    customer_id: customers[5].id,
    product_id: products[2].id,
    quantity: 10,
    amount: 8945,
    status: 'paid',
    date: '2023-06-03',
    note: '',
  },
  {
    customer_id: customers[2].id,
    product_id: products[2].id,
    quantity: 10,
    amount: 1000,
    status: 'paid',
    date: '2022-06-05',
    note: '',
  },
];

const revenue = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
];

export { users, customers, products, invoices, revenue };
