'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { BookData } from '@/components/bookShelfClient';
import Link from 'next/link';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: BookData | null; // 選択された書籍情報
  onStatusChange: (status: string) => void;
};

export default function BookDetailDialog({ open, onOpenChange, book, onStatusChange }: Props) {
  if (!book) return null;

  const handleStatusChange = (status: string) => {
    onStatusChange(status);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-6 md:max-w-xl"
        // md未満なら下からフェードインするようにshadcn/uiのクラスなどを調整
      >
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">{book.books.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <Image
            src={book.books.cover_image ?? '/noimage.jpg'}
            alt={book.books.title}
            width={150}
            height={220}
          />
          <p>著者: {book.books.author}</p>
          <p>出版社: {book.books.publisher}</p>

          {/* ステータスボタン */}
          <div className="flex items-center space-x-2 mt-2">
            <Button
              variant={book.status === 'want' ? 'default' : 'outline'}
              onClick={() => handleStatusChange('want')}>
              読みたい
            </Button>
            <Button
              variant={book.status === 'reading' ? 'default' : 'outline'}
              onClick={() => handleStatusChange('reading')}>
              読んでる
            </Button>
            <Button
              variant={book.status === 'done' ? 'default' : 'outline'}
              onClick={() => handleStatusChange('done')}>
              読んだ
            </Button>
          </div>

          {/* 通販リンクなど */}
          <div className="flex flex-col space-y-2 mt-4">
            <Button variant="outline" asChild>
              <Link href="https://www.amazon.co.jp" target="_blank">
                Amazon
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="https://www.rakuten.co.jp" target="_blank">
                Rakuten
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="https://www.yodobashi.com" target="_blank">
                ヨドバシ.com
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="https://honto.jp" target="_blank">
                honto
              </Link>
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>閉じる</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
