// src/data/sampleBooks.ts
import { Book, BookStatus } from 'types/types';

export const sampleBooks: Book[] = [
  {
    id: '1',
    title: 'ノルウェイの森',
    author: '村上 春樹',
    isbn: '9784101010014',
    publisher: '講談社',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/81af+MCATTL.jpg',
    status: BookStatus.Read,
    affiliateLinks: {
      amazon: 'https://www.amazon.co.jp/dp/4101010015',
      rakuten: 'https://books.rakuten.co.jp/rb/4101010015/',
      yodobashi: 'https://www.yodobashi.com/product/100000001001000000.html',
      honto: 'https://honto.jp/netstore/pd-book_4101010015.html',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'ハリー・ポッターと賢者の石',
    author: 'J.K.ローリング',
    isbn: '9780747532743',
    publisher: '金の星社',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg',
    status: BookStatus.Reading,
    affiliateLinks: {
      amazon: 'https://www.amazon.co.jp/dp/0747532745',
      rakuten: 'https://books.rakuten.co.jp/rb/0747532745/',
      yodobashi: 'https://www.yodobashi.com/product/100000000000000000.html',
      honto: 'https://honto.jp/netstore/pd-book_0747532745.html',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: '沈黙',
    author: '遠藤 周作',
    isbn: '9784334031141',
    publisher: '新潮社',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/81sI9NDTFHL.jpg',
    status: BookStatus.WantToRead,
    affiliateLinks: {
      amazon: 'https://www.amazon.co.jp/dp/433403114X',
      rakuten: 'https://books.rakuten.co.jp/rb/433403114X/',
      yodobashi: 'https://www.yodobashi.com/product/100000001002000000.html',
      honto: 'https://honto.jp/netstore/pd-book_433403114X.html',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
