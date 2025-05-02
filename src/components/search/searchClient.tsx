'use client';

import BookDetailDrawer from '@/components/search/searchDetailDrawer';
import SearchForm from '@/components/search/searchForm';
import SearchResults from '@/components/search/searchResult';
import SearchLoading from '@/components/skelton/searchLoading';
import { useState, useEffect, useRef, useCallback } from 'react';
import { User } from 'types';
import { Book, BookStatus, UserBook } from 'types/types';
import { Loader2 } from 'lucide-react';

const SEARCH_TIMEOUT = 10000; // 10秒

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
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearchTimeout, setIsSearchTimeout] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastBookElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore || isSearchTimeout) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          handleSearch(currentPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoadingMore, hasMore, currentPage, isSearchTimeout],
  );

  // 検索実行
  const handleSearch = async (page: number = 1) => {
    if (!query) return;
    setIsLoading(page === 1);
    setIsLoadingMore(page > 1);
    setError('');
    setIsSearchTimeout(false);

    try {
      const searchParams = new URLSearchParams();
      searchParams.append('q', query);
      searchParams.append('page', page.toString());
      searchParams.append('perPage', '20');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        setIsSearchTimeout(true);
        setIsLoading(false);
        setIsLoadingMore(false);
        setError('検索に時間がかかりすぎました。もう一度お試しください。');
      }, SEARCH_TIMEOUT);

      const response = await fetch(`/api/search?${searchParams.toString()}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fetch Error');
      }

      if (!data.items || data.items.length === 0) {
        setHasMore(false);
        if (page === 1) {
          setBooks([]);
          setError('検索結果が見つかりませんでした。');
        }
        return;
      }

      const newBooks = data.items.map((item: any) => {
        const existing = user_book?.find((ub) => ub.book_id === item.id);
        return {
          id: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors?.join(', ') || '不明',
          publisher: item.volumeInfo.publisher || '不明',
          coverImage: item.volumeInfo.imageLinks?.thumbnail || '',
          publishedDate: item.volumeInfo.publishedDate || '',
          canonicalVolumeLink: item.volumeInfo.canonicalVolumeLink || '',
          isbn:
            item.volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')
              ?.identifier ||
            item.volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_10')
              ?.identifier ||
            '',
          status: existing ? existing.status : BookStatus.WantToRead,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });

      if (page === 1) {
        setBooks(newBooks);
      } else {
        setBooks((prevBooks) => [...prevBooks, ...newBooks]);
      }

      setCurrentPage(page);
      setHasMore(data.items.length === 20);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // BookCardクリック時
  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsDrawerOpen(true);
  };

  // ステータス変更
  const handleStatusChange = async (bookId: string, status: BookStatus) => {
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
      setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, status } : b)));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (book: Book) => {};

  const handleDelete = (id: string) => {};

  return (
    <div className="p-4">
      <h1>書籍検索</h1>

      {/* 検索フォーム */}
      <SearchForm
        query={query}
        setQuery={setQuery}
        onSearch={() => handleSearch(1)}
        isLoading={isLoading}
      />

      {error && <p className="bg-red-500 text-white p-2 rounded">{error}</p>}
      {isLoading && <SearchLoading />}

      {/* 検索結果 */}
      <SearchResults
        books={books}
        onBookClick={handleBookClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        lastBookElementRef={lastBookElementRef}
      />

      {/* ローディング表示 */}
      {isLoadingMore && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      )}

      {/* ドロワー (モーダル) */}
      <BookDetailDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        selectedBook={selectedBook}
      />
    </div>
  );
}
