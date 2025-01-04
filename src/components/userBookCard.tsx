'use client';

import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookData } from '@/components/bookShelfClient';

type Props = {
  book: BookData;
  onClick: () => void; // クリックでモーダル/ダイアログを開くコールバック
};

export default function UserBookCard({ book, onClick }: Props) {
  const { books, status } = book;

  return (
    <Card onClick={onClick} className="cursor-pointer hover:opacity-80">
      <CardHeader>
        <Image
          src={books.cover_image ?? '/noimage.jpg'}
          alt={books.title}
          width={120}
          height={180}
        />
        <CardTitle>{books.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{books.author}</p>
        <p>ステータス: {status}</p>
      </CardContent>
    </Card>
  );
}
