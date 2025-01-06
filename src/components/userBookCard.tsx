'use client';

import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookData } from '@/components/bookShelfClient';
import { Bookmark, BookOpen, SquareCheck } from 'lucide-react';
import { BookStatus } from 'types/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { User } from 'types';

type Props = {
  book: BookData;
  onClick: () => void; // クリックでモーダル/ダイアログを開くコールバック
  user: User;
};

export default function UserBookCard({ book, onClick, user }: Props) {
  const { books, status } = book;
  const [error, setError] = useState('');
  const router = useRouter();
  const updateStatus = async (book: BookData, status: BookStatus) => {
    if (!user?.id) {
      setError('ユーザ情報がありません');
      return;
    }

    try {
      const response = await fetch(`/api/bookshelf/updateStatus`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          book_id: book.book_id,
          status,
        }),
      });
      const responseBody = await response.text();
      if (!response.ok) {
        const { error } = JSON.parse(responseBody);
        throw new Error(error || 'Fetch Error');
      }
      // 成功したらリフレッシュ
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:opacity-80 shadow-md rounded-xl pt-6 bg-orange-100">
      <CardContent className="flex flex-row gap-4">
        <div className="w-32 h-44 flex-shrink-0">
          {books.cover_image ? (
            <Image
              src={books.cover_image}
              alt={`${books.title}`}
              width={64 * 1.8}
              height={96 * 1.8}
              className="object-cover rounded-2xl"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-2xl flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
        <div className="flex flex-col m-4 gap-2 flex-1 min-w-0">
          <div className="font-bold text-md h-12 line-clamp-2">{books.title}</div>
          <div className="font-thin text-sm overflow-hidden text-gray-400">{books.author}</div>
          <div className="flex flex-row gap-4">
            {/* <div className="cursor-pointer "> */}
            {/* 読みたいアイコン */}
            <div
              className={`cursor-pointer ${status === 'want' ? 'text-orange-400' : 'text-gray-400'}`}
              onClick={(e) => {
                e.stopPropagation();
                updateStatus(book, BookStatus.WantToRead);
              }}>
              <Bookmark className="w-6 h-6" fill={status === 'want' ? 'currentColor' : 'none'} />
            </div>

            {/* 読んでる */}
            <div
              className={`cursor-pointer ${status === 'reading' ? 'text-orange-400' : 'text-gray-400'}`}
              onClick={(e) => {
                e.stopPropagation();
                updateStatus(book, BookStatus.Reading);
              }}>
              <BookOpen className="w-6 h-6" fill={status === 'reading' ? 'currentColor' : 'none'} />
            </div>

            {/* 読んだ */}
            <div
              className={`cursor-pointer ${status === 'done' ? 'text-orange-400' : 'text-gray-400'}`}
              onClick={(e) => {
                e.stopPropagation();
                updateStatus(book, BookStatus.Read);
              }}>
              <SquareCheck className="w-6 h-6" fill={status === 'done' ? 'currentColor' : 'none'} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
