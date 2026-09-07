import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OVR Calculating Tool - FIFA Online 4',
  description: 'Công cụ tính & tối ưu đào tạo chỉ số cầu thủ FIFA Online 4 / FC Online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}