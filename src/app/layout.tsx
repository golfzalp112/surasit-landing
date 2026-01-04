import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "สุรสิทธิ์ นิธิวุฒิวรรักษ์ | ผู้สมัคร สส. ชลบุรี เขต 6 พรรคภูมิใจไทย",
  description: "เบอร์ 8 สุรสิทธิ์ นิธิวุฒิวรรักษ์ ผู้สมัคร สส. ชลบุรี เขต 6 พรรคภูมิใจไทย | อดีต สส. 40+ ปี | นโยบายเศรษฐกิจ 10 พลัส+ | 8 กุมภาพันธ์ 2569",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
