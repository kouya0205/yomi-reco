import { AvatarList } from '@/components/avatarList';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';

export default async function Timeline() {
  // supabaseの定義
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth');
  }

  // ユーザーの一覧（自分を除く）を取得
  const { data: users, error } = await supabase.from('users').select('*').neq('user_id', user.id);

  console.log('users:', users);
  // 本の一覧（最新10件）を取得
  const { data: books } = await supabase
    .from('user_book')
    .select('*, books(*)')
    .order('created_at', { ascending: false })
    .limit(10);

  console.log('latest_books:', books);

  if (error) {
    console.error('Error fetching users:', error);
    // 必要に応じてエラーハンドリング
    return notFound();
  }
  return (
    <main className="p-4">
      {/* 取得したデータを渡す */}
      <AvatarList users={users ?? []} />
      <div>
        <div className="m-12">
          <div className="text-2xl font-bold">今週のランキングTop10</div>
          <div className="m-4">
            <Carousel>
              <CarouselContent>
                {books?.map((book, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          {book.books.cover_image ? (
                            <Image
                              src={book.books.cover_image}
                              alt={`${book.title}`}
                              width={64 * 1.8}
                              height={96 * 1.8}
                              layout="full"
                              className="object-cover rounded-2xl"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 rounded-2xl flex items-center justify-center">
                              <span className="text-gray-500">No Image</span>
                            </div>
                          )}
                          <div className="flex flex-col m-4 gap-2 flex-1 min-w-0">
                            <div className="font-bold text-md h-12 line-clamp-2">
                              {book.books.title}
                            </div>
                            <div className="font-thin text-sm overflow-hidden text-gray-400">
                              {book.books.author}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    </main>
  );
}
