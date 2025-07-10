import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Hoang Bon',
    default: 'Hoang Bon'
  },
  description: 'Hoang Bon Company Accounting Software',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh')
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>{children}</body>
    </html>
  );
}
