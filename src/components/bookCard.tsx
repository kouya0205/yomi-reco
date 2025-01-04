'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Book, BookStatus } from 'types/types';
import Image from 'next/image';

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
        <div className="flex-shrink-0">
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
        <div className="flex flex-col m-4 gap-2 flex-1 min-w-0">
          <div className="font-bold text-md h-12 line-clamp-2">{book.title}</div>
          <div className="font-thin text-sm overflow-hidden text-gray-400">{book.author}</div>
          <div className="flex flex-row gap-4">
            <div className="w-12 h-12 bg-red-300"></div>
            <div className="w-12 h-12 bg-blue-300"></div>
            <div className="w-12 h-12 bg-green-300"></div>
          </div>
          {/* <div className="flex flex-row">{book.status}</div> */}
        </div>
      </CardContent>
    </Card>
  );
};
