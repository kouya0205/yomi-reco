'use client';

import Image from 'next/image';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Book, BookStatus } from 'types/types';

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
  );
}
