'use client';
import { BookCard } from '@/components/bookCard';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Book, BookStatus } from 'types/types';

const statusOptions: BookStatus[] = [BookStatus.WantToRead, BookStatus.Reading, BookStatus.Read];

export default function Search() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSerch = async () => {
    if (!query) return;
    setIsLoading(true);
    setError('');
    setBooks([]);

    try {
      const response = await fetch(`/api/searchBooks?q=${encodeURIComponent(query)}`);

      const responseBody = await response.text(); // レスポンスボディを一時保存
      // console.log('Response Status:', response.status);
      console.log('Response Text:', responseBody);
      if (!response.ok) {
        const { error } = JSON.parse(responseBody);
        throw new Error(error || 'Fetch Error');
      }
      const data = JSON.parse(responseBody);

      // Google Books APIのレスポンスから books 配列を取り出す
      // setBooks(data.items || []);

      setBooks(
        data.items.map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors?.join(', ') || '著者不明',
          coverImage: item.volumeInfo.imageLinks?.thumbnail || '',
          status: BookStatus.WantToRead, // デフォルトのステータス
        })),
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsDrawerOpen(true);
  };

  const handleEdit = (book: Book) => {
    console.log('Edit Book:', book);
  };

  const handleDelete = (id: string) => {
    console.log('Delete book with ID:', id);
  };

  const handleStatusChange = (id: string, status: BookStatus) => {
    setBooks(books.map((book) => (book.id === id ? { ...book, status } : book)));
  };

  return (
    <div className="m-4">
      <h1>書籍検索</h1>
      <div>
        <div>Input</div>
        <Input
          type="text"
          placeholder="ISBN またはキーワード"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-96"
        />
        <Button onClick={handleSerch} disabled={isLoading}>
          検索
        </Button>
      </div>

      {isLoading && <p>検索中...</p>}
      {error && <p className="bg-red-500">エラーが発生しました: {error}</p>}

      <div className="m-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {books.length > 0 &&
          books.map((book) => (
            <div className="cursor-pointer" onClick={() => handleBookClick(book)}>
              <BookCard
                key={book.id}
                book={book}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                statusOptions={statusOptions}
              />
            </div>
          ))}
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          {selectedBook && (
            <div className="p-4 text-center">
              <Image
                src={selectedBook.coverImage}
                alt={`${selectedBook.title}`}
                width={64 * 1.8}
                height={96 * 1.8}
                className="mx-auto w-40 h-60 rounded-md m-4"
              />
              <h2 className="text-lg font-bold">{selectedBook.title}</h2>
              <p className="text-sm text-gray-600">{selectedBook.author}</p>
              <p className="text-sm text-gray-600">{selectedBook.publisher}</p>

              <div className="mt-4 flex justify-center gap-4">
                {statusOptions.map((status) => (
                  <Button
                    key={status}
                    variant={selectedBook.status === status ? 'default' : 'outline'}
                    onClick={() => console.log(`Status changed to: ${status}`)}>
                    {status === BookStatus.WantToRead && '読みたい'}
                    {status === BookStatus.Reading && '読んでる'}
                    {status === BookStatus.Read && '読んだ'}
                  </Button>
                ))}
              </div>

              <div className="m-6">
                <h3 className="text-lg font-bold">通販で購入する</h3>
                <div className="justify-center gap-4 m-4 grid grid-cols-2">
                  <div className="bg-gray-200 rounded-md">Amazon</div>
                  <div className="bg-gray-200 rounded-md">Rakuten</div>
                  <div className="bg-gray-200 rounded-md">ヨドバシ</div>
                  <div className="bg-gray-200 rounded-md">honto</div>
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
