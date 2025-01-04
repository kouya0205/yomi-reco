'use client';

import { BookCard } from '@/components/bookCard';
import { Book, BookStatus } from 'types/types';

type Props = {
  books: Book[];
  onBookClick: (book: Book) => void;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: BookStatus) => void;
};

export default function SearchResults({
  books,
  onBookClick,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) {
  return (
    <div className="m-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {books.length > 0 &&
        books.map((book) => (
          <div className="cursor-pointer" onClick={() => onBookClick(book)} key={book.id}>
            <BookCard
              key={book.id}
              book={book}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              statusOptions={[BookStatus.WantToRead, BookStatus.Reading, BookStatus.Read]}
            />
          </div>
        ))}
    </div>
  );
}
