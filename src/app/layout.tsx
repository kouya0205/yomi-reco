import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import FooterNav from '@/components/footerNav';
import PcSideNav from '@/components/pcSideNav';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'よみれこ',
  description: '積読を管理し、本を共有するサービス',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ヘッダー (小画面のみ表示) */}
        <div className="block lg:hidden">
          <Header />
        </div>

        <div className="flex min-h-screen">
          {/* サイドナビ (大画面のみ表示) */}
          <div className="hidden lg:block w-[240px] bg-[#ffeedd]">
            <PcSideNav />
          </div>

          {/* メインコンテンツ */}
          <main className="flex-1 bg-[#fff3e9]">{children}</main>
        </div>

        {/* フッター (小画面のみ表示) */}
        <div className="block lg:hidden">
          <FooterNav />
        </div>
      </body>
    </html>
  );
}
