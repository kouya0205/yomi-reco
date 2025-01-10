'use client';

import BookDetailDrawer from '@/components/search/searchDetailDrawer';
import SearchForm from '@/components/search/searchForm';
import SearchResults from '@/components/search/searchResult';
import { useState } from 'react';
import { User } from 'types';
import { Book, BookStatus, UserBook } from 'types/types';

export default function SearchClient({
  user_book,
  user,
}: {
  user_book: UserBook[] | null;
  user: User | null;
}) {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 検索実行
  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    setError('');
    setBooks([]);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const responseBody = await response.text();
      if (!response.ok) {
        const { error } = JSON.parse(responseBody);
        throw new Error(error || 'Fetch Error');
      }
      const data = JSON.parse(responseBody);

      // 例: handleSearch後
      setBooks(
        data.items.map((item: any) => {
          const existing = user_book?.find((ub) => ub.book_id === item.id);
          return {
            id: item.id,
            title: item.volumeInfo.title,
            author: item.volumeInfo.authors?.join(', ') || '著者不明',
            publisher: item.volumeInfo.publisher || '',
            coverImage: item.volumeInfo.imageLinks?.thumbnail || '',
            status: existing ? existing.status : BookStatus.WantToRead,
          };
        }),
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // BookCardクリック時
  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsDrawerOpen(true);
  };

  // ステータス変更 (とりあえずローカルの books ステートを更新するのみ)
  const handleStatusChange = async (bookId: string, status: BookStatus) => {
    // userId を持っているか、あるいはサーバーコンポーネントでUser情報を渡すなど工夫
    if (!user?.id) {
      setError('ユーザー情報がありません');
      return;
    }

    try {
      const response = await fetch(`/api/search/updateStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          book: books.find((b) => b.id === bookId),
          status,
        }),
      });
      const responseBody = await response.text();
      if (!response.ok) {
        const { error } = JSON.parse(responseBody);
        throw new Error(error || 'Fetch Error');
      }
      // 成功したらローカルStateも更新
      setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, status } : b)));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (book: Book) => {
    console.log('Edit Book:', book);
  };

  const handleDelete = (id: string) => {
    console.log('Delete book with ID:', id);
  };

  return (
    <div className="p-4">
      <h1>書籍検索</h1>

      {/* 検索フォーム */}
      <SearchForm query={query} setQuery={setQuery} onSearch={handleSearch} isLoading={isLoading} />

      {isLoading && <p>検索中...</p>}
      {error && <p className="bg-red-500">エラーが発生しました: {error}</p>}

      {/* 検索結果 */}
      <SearchResults
        books={books}
        onBookClick={handleBookClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      {/* ドロワー (モーダル) */}
      <BookDetailDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        selectedBook={selectedBook}
      />
    </div>
  );
}
