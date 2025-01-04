'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Book, BookStatus } from 'types/types';
import Image from 'next/image';
import { Bookmark, BookOpen, SquareCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: BookStatus) => void;
  statusOptions: BookStatus[];
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onEdit,
  onDelete,
  onStatusChange,
  statusOptions,
}: BookCardProps) => {
  return (
    <Card className="shadow-md rounded-xl pt-6 bg-orange-100">
      <CardContent className="flex flex-row gap-4">
        <div className="">
          {book.coverImage && (
            <Image
              src={book.coverImage}
              alt={`${book.title}`}
              width={64 * 1.8}
              height={96 * 1.8}
              className="object-cover rounded-2xl"
            />
          )}
        </div>
        <div className="flex flex-col m-4 gap-2">
          <div className="font-bold text-xl">{book.title}</div>
          <div className="font-thin text-sm overflow-hidden text-gray-400">{book.author}</div>
          <div className="flex flex-row gap-4">
            <div
              onClick={() => onStatusChange(book.id, BookStatus.WantToRead)}
              className="cursor-pointer">
              <Bookmark />
            </div>

            {/* 読んでる */}
            <div
              onClick={() => onStatusChange(book.id, BookStatus.Reading)}
              className="cursor-pointer">
              <BookOpen />
            </div>

            {/* 読んだ */}
            <div
              onClick={() => onStatusChange(book.id, BookStatus.Read)}
              className="cursor-pointer">
              <SquareCheck />
            </div>
          </div>
          {/* <div className="flex flex-row">{book.status}</div> */}
        </div>
      </CardContent>
    </Card>
  );
};
