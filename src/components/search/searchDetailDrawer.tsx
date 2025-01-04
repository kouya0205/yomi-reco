'use client';

import Image from 'next/image';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Book, BookStatus } from 'types/types';
import Link from 'next/link';

export const statusOptions: BookStatus[] = [
  BookStatus.WantToRead,
  BookStatus.Reading,
  BookStatus.Read,
];

type Props = {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  selectedBook: Book | null;
};

export default function BookDetailDrawer({ isDrawerOpen, setIsDrawerOpen, selectedBook }: Props) {
  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle></DrawerTitle>
        </DrawerHeader>
        {selectedBook && (
          <div className="p-4 text-center">
            <Image
              src={selectedBook.coverImage || '/images/no-image.png'}
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

            {/* 通販リンクなど */}
            <div className="m-6">
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
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
