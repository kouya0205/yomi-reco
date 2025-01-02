'use client';
import { BookCard } from '@/components/bookCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Book, BookStatus } from 'types/types';

const statusOptions: BookStatus[] = [BookStatus.WantToRead, BookStatus.Reading, BookStatus.Read];

export default function Search() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

      <div className="m-2">
        {books.length > 0 &&
          books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              statusOptions={statusOptions}
            />
          ))}
      </div>
    </div>
  );
}
