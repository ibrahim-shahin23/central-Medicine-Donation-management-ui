import type { Metadata } from 'next';
import Header from '@/components/Header';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'MediDonate - Medicine Donation Management System',
  description: 'Central platform for managing medicine donations and hospital requests',
  icons:{
    icon:'tab-logo.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}