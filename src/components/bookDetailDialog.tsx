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
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-6 md:max-w-xl"
        // md未満なら下からフェードインするようにshadcn/uiのクラスなどを調整
      >
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl"></DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <Image
            src={book.books.cover_image ?? '/noimage.jpg'}
            alt={book.books.title}
            width={64 * 1.8}
            height={96 * 1.8}
            className="mx-auto w-40 h-60 rounded-md m-4"
          />
          <div className="text-lg font-bold text-center">{book.books.title}</div>
          <p className="text-sm text-gray-600">著者: {book.books.author}</p>
          <p className="text-sm text-gray-600">出版社: {book.books.publisher}</p>

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
          <div className="grid grid-cols-2 gap-4">
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
