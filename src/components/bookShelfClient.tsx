'use client';

import { useEffect, useState } from 'react';
import TabGroup from '@/components/tabGroupe';
import BookDetailDialog from '@/components/bookDetailDialog';
import UserBookCard from '@/components/userBookCard';
import { User } from 'types';
import { useRouter } from 'next/navigation';

// APIから取得したデータの型例
export type BookData = {
  book_id: number;
  status: string;
  books: {
    title: string;
    author: string;
    publisher: string;
    cover_image: string | undefined;
  };
};

type Props = {
  books: BookData[];
  user: User;
};

export default function BookshelfClient({ books, user }: Props) {
  const [currentTab, setCurrentTab] = useState<'want' | 'reading' | 'done'>('want');
  const [filteredBooks, setFilteredBooks] = useState<BookData[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  // タブ切り替え
  const handleTabChange = (tab: string) => {
    // string を BookData["status"] などに合わせて型変換する例
    setCurrentTab(tab as 'want' | 'reading' | 'done');
  };

  // 書籍ステータスフィルタや検索
  useEffect(() => {
    const filtered = books
      .filter((b) => b.status === currentTab) // タブにあったステータスのみ
      .filter((b) => {
        if (!searchText.trim()) return true;
        const title = b.books.title ?? '';
        return title.includes(searchText);
      });
    setFilteredBooks(filtered);
  }, [books, currentTab, searchText]);

  // 書籍カードクリック
  const handleBookClick = (book: BookData) => {
    setSelectedBook(book);
    setDialogOpen(true);
  };

  // ステータス更新
  const updateStatus = async (status: string) => {
    console.log('updateStatus:', status);
    if (!selectedBook) return;
    try {
      const res = await fetch('/api/bookshelf', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          book_id: selectedBook.book_id,
          newStatus: status,
        }),
      });
      const data = await res.json();
      if (data.error) {
        console.error(data.error);
        return;
      }
      // 更新に成功したら、ローカル状態を更新
      // 例: books の中で該当書籍のstatusを変更
      const newBooks = books.map((b) =>
        b.book_id === selectedBook.book_id ? { ...b, status } : b,
      );
      // 全体の books ステートがあるならそちらを更新し直す。
      // 今回は props から受け取ったものなので、非同期再取得か、
      // 親が useState で管理していればそちらを更新など。
      // ここでは簡易的に再描画用にsetFilteredBooksだけ更新例:
      setSelectedBook((prev) => (prev ? { ...prev, status } : null));
      // 再フィルタ
      const filtered = newBooks
        .filter((b) => b.status === currentTab)
        .filter((b) => {
          if (!searchText.trim()) return true;
          const title = b.books.title ?? '';
          return title.includes(searchText);
        });
      setFilteredBooks(filtered);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* タブ */}
      <TabGroup currentTab={currentTab} onTabChange={handleTabChange} />

      {/* 検索バー (shadcn/ui Input などを利用) */}
      <div className="my-4">
        <input
          className="border rounded p-2 w-full"
          placeholder="タイトルの一部"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* 書籍表示 */}
      <div className="flex flex-col space-y-4">
        <p className="text-sm text-gray-600">{filteredBooks.length}冊</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBooks.map((book, index) => (
            <UserBookCard key={index} book={book} onClick={() => handleBookClick(book)} />
          ))}
        </div>
      </div>

      {/* 詳細Dialog / Modal */}
      <BookDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        book={selectedBook}
        onStatusChange={updateStatus}
      />
    </div>
  );
}
