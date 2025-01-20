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
  title: {
    template: '%s | ヨミレコ',
    default: '積読を記録し、本棚を共有できるサービス',
  },
  description: '積読を記録し、本棚を共有できるサービス',
  metadataBase: new URL('https://yomi-reco.vercel.app/'),
  openGraph: {
    title: 'ヨミレコ',
    description: '積読を記録し、本棚を共有できるサービス',
    url: 'https://yomi-reco.vercel.app/',
    images: [
      {
        url: 'https://yomi-reco.vercel.app/ogp.png',
        width: 1200,
        height: 630,
        alt: 'ヨミレコ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@your_twitter_account',
    title: 'Twitterカード用のタイトル',
    description: 'Twitterカード用の説明文',
    images: ['https://yomi-reco.vercel.app/ogp.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ヘッダー (小画面のみ表示) */}
        <div className="block lg:hidden">
          <Header />
        </div>

        <div className="lg:flex min-h-screen">
          {/* サイドナビ (大画面のみ表示) */}
          <div className="hidden lg:block w-[240px] bg-[#ffeedd]">
            <PcSideNav />
          </div>

          {/* メインコンテンツ */}
          <main className="bg-[#fff3e9] min-h-screen w-full">{children}</main>
        </div>

        {/* フッター (小画面のみ表示) */}
        <div className="block lg:hidden">
          <FooterNav />
        </div>
      </body>
    </html>
  );
}
