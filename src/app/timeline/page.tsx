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

  if (error) {
    console.error('Error fetching users:', error);
    // 必要に応じてエラーハンドリング
    return notFound();
  }

  return (
    <div className="p-4">
      {/* 取得したデータを渡す */}
      <AvatarList users={users ?? []} />
      <div>
        <div className="m-12">
          <div className="text-2xl font-bold">今週のランキングTop10</div>
          <div className="m-4">
            <Carousel>
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <span className="text-3xl font-semibold">{index + 1}</span>
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

          <div className="text-2xl font-bold">今月のランキングTop10</div>
          <div className="m-4">
            <Carousel>
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <span className="text-3xl font-semibold">{index + 1}</span>
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
    </div>
  );
}
