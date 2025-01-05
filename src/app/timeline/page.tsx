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
import Link from 'next/link';

export default function Timeline() {
  const avatarData = [
    { src: 'https://github.com/shadcn.png', fallback: 'CN' },
    { src: 'https://randomuser.me/api/portraits/men/1.jpg', fallback: 'M1' },
    { src: 'https://randomuser.me/api/portraits/women/2.jpg', fallback: 'W2' },
    { src: 'https://randomuser.me/api/portraits/men/3.jpg', fallback: 'M3' },
    { src: 'https://randomuser.me/api/portraits/women/4.jpg', fallback: 'W4' },
    { src: 'https://randomuser.me/api/portraits/men/5.jpg', fallback: 'M5' },
  ];
  return (
    <div>
      <div className="m-12">
        {/* アバターリスト */}
        <div className="w-full flex flex-row gap-2 m-4">
          <ScrollArea className="w-full rounded-md overflow-x-auto">
            <div className="flex gap-4 p-4">
              {avatarData.map((avatar, index) => (
                <Link href={'/bookshelf/id'}>
                  <div key={index} className="flex flex-col items-center space-y-2 cursor-pointer">
                    <Avatar className="w-20 h-20 ring-2 ring-offset-2 ring-blue-500 hover:ring-offset-blue-300 transition-all">
                      <AvatarImage src={avatar.src} />
                      <AvatarFallback>{avatar.fallback}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700">{avatar.fallback}</span>
                  </div>
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="text-2xl font-bold">今週のランキングTop10</div>
        <div className="m-4">
          <Carousel>
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
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
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
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
  );
}
