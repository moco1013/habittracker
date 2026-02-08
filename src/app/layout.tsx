import type { Metadata } from "next";
import { BIZ_UDPGothic } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const bizUDPGothic = BIZ_UDPGothic({
  weight: ["400", "700"],
  variable: "--font-bizudp-gothic",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "習慣トラッカー",
  description: "毎日の習慣を記録して、継続を可視化しよう",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${bizUDPGothic.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
