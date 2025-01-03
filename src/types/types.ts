// src/types/types.ts

// ステータスの列挙型
export enum BookStatus {
  WantToRead = 0,
  Reading = 1,
  Read = 2,
}

// アフィリエイトリンクのインタフェース
export interface AffiliateLinks {
  amazon?: string;
  rakuten?: string;
  yodobashi?: string;
  honto?: string;
}

// 本の情報を格納するインタフェース
export interface Book {
  id: string; // ユニークな識別子
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  coverImage?: string; // カバー画像のURL
  status: BookStatus;
  affiliateLinks?: AffiliateLinks;
  createdAt: Date;
  updatedAt: Date;
}
