'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Book } from 'types/types';

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
      const response = await fetch(`/api/serchBooks?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Fetch Error');
      }
      const data = await response.json();

      // Google Books APIのレスポンスから books 配列を取り出す
      setBooks(data.items || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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

      {/* <div className="m-2">
        {books.length > 0 && books.map(book) => {
          const { booksInfo } = book;
          return (

          )
        }}
      </div> */}
    </div>
  );
}
