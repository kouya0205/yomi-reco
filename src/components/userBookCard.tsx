'use client';

import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookData } from '@/components/bookShelfClient';
import { Bookmark, BookOpen, SquareCheck } from 'lucide-react';

type Props = {
  book: BookData;
  onClick: () => void; // クリックでモーダル/ダイアログを開くコールバック
};

export default function UserBookCard({ book, onClick }: Props) {
  const { books, status } = book;

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
              className={`cursor-pointer ${status === 'want' ? 'text-orange-400' : 'text-gray-400'}`}>
              <Bookmark className="w-6 h-6" fill={status === 'want' ? 'currentColor' : 'none'} />
            </div>

            {/* 読んでる */}
            <div
              className={`cursor-pointer ${status === 'reading' ? 'text-orange-400' : 'text-gray-400'}`}>
              <BookOpen className="w-6 h-6" fill={status === 'reading' ? 'currentColor' : 'none'} />
            </div>

            {/* 読んだ */}
            <div
              className={`cursor-pointer ${status === 'done' ? 'text-orange-400' : 'text-gray-400'}`}>
              <SquareCheck className="w-6 h-6" fill={status === 'done' ? 'currentColor' : 'none'} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
