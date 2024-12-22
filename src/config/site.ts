import { SiteConfig } from 'types';

export const siteConfig: SiteConfig = {
  title: 'Yomi Reco',
  description: 'ヨミレコは、自身の読書記録を管理し、本を共有するためのサービスです。',
  url: 'https://yomi-reco.vercel.app',
  header: {
    title: 'Yomi Reco',
    logo: '/images/icon-512x512.webp',
    icons: [
      { src: '/images/suzu.webp', alt: '鈴のアイコン' },
      { src: '/images/hito.webp', alt: '人のアイコン' },
      { src: '/images/menu.webp', alt: 'メニューのアイコン' },
    ],
  },
  auth: {
    title: 'ログイン | 新規登録',
    description: 'ヨミレコにログインするか、新規登録してください。',
    url: 'https://yomi-reco.vercel.app/auth',
  },
};
