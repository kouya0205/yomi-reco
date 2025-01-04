// src/types/types.ts

// ステータスの列挙型
export enum BookStatus {
  WantToRead = 'want',
  Reading = 'reading',
  Read = 'done',
}

// アフィリエイトリンクのインタフェース
export interface AffiliateLinks {
  amazon?: string;
  rakuten?: string;
  yodobashi?: string;
  honto?: string;
}

export interface UserBook {
  book_id: string;
  status: BookStatus;
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
