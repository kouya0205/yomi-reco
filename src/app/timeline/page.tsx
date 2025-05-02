import { AvatarList } from '@/components/profile/avatarList';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { User } from 'types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import PostList from '@/components/post/postList';
import { getPosts } from './actions';
import { CreatePostDialog } from '@/components/post/CreatePostDialog';
import { Post } from '@/components/post/postCard';

// 型定義を更新
type FollowingBook = {
  user_id: string;
  book_id: string;
  status: string;
  created_at: string;
  username: string;
  avatar_url: string;
  title: string;
  author: string;
  cover_image: string;
};

type RankingBook = {
  book_id: string;
  title: string;
  author: string;
  cover_image: string;
  total_adds: number;
  avg_rating: number;
  popularity_score: number;
};

type RecommendationBook = {
  book_id: string;
  title: string;
  author: string;
  cover_image: string;
  description: string;
  genre_name: string;
  recommendation_score: number;
};

type GenreBook = {
  book_id: string;
  title: string;
  author: string;
  cover_image: string;
  genre_name: string;
  total_adds: number;
  avg_rating: number;
  popularity_score: number;
};

type UserGenre = {
  genre_id: number;
  genre_name: string;
  book_count: number;
  avg_rating: number;
};

export const metadata: Metadata = {
  title: 'タイムライン',
  description:
    'フォローしているユーザーの本棚やユーザーの人気ランキングや評価の高い本を確認できます。',
};

// ローディングコンポーネント
const LoadingCard = () => (
  <div className="p-1">
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <Skeleton className="h-40 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  </div>
);

// エラーコンポーネント
const ErrorAlert = ({ message }: { message: string }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>エラー</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

export default async function Timeline() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth');
  }

  // 1. フォロー中のユーザーの本棚を取得
  const { data: followingBooks, error: followingError } = await supabase
    .rpc('get_following_books', { current_user_id: user.id, limit_count: 20 })
    .returns<FollowingBook[]>();

  // 2. 今週の人気ランキングを取得
  const { data: weeklyRanking, error: weeklyError } = await supabase
    .rpc('get_weekly_popular_books', { limit_count: 10 })
    .returns<RankingBook[]>();

  // 3. 今月の人気ランキングを取得
  const { data: monthlyRanking, error: monthlyError } = await supabase
    .rpc('get_monthly_popular_books', { limit_count: 10 })
    .returns<RankingBook[]>();

  // 4. おすすめ本を取得
  // const { data: recommendations, error: recoError } = await supabase
  //   .rpc('get_genre_based_recommendations', { current_user_id: user.id, limit_count: 10 })
  //   .returns<RecommendationBook[]>();

  // 5. ユーザーの好みのジャンルを取得
  const { data: userGenres, error: genreError } = await supabase
    .rpc('get_user_preferred_genres', { current_user_id: user.id, limit_count: 5 })
    .returns<UserGenre[]>();

  // 6. 投稿フィード用のデータ取得
  const allPostsResult = await getPosts({ page: 1, limit: 10, filter: 'all' });
  const followingPostsResult = await getPosts({ page: 1, limit: 10, filter: 'following' });
  const trendingPostsResult = await getPosts({ page: 1, limit: 10, filter: 'recommended' });

  // エラーハンドリング
  if (
    followingError ||
    weeklyError ||
    monthlyError ||
    genreError ||
    'error' in allPostsResult ||
    'error' in followingPostsResult ||
    'error' in trendingPostsResult
  ) {
    console.error('Error fetching data:', {
      followingError,
      weeklyError,
      monthlyError,
      genreError,
      allPostsError: 'error' in allPostsResult ? allPostsResult.error : null,
      followingPostsError: 'error' in followingPostsResult ? followingPostsResult.error : null,
      trendingPostsError: 'error' in trendingPostsResult ? trendingPostsResult.error : null,
    });
    return <ErrorAlert message="データの取得中にエラーが発生しました。" />;
  }

  // 投稿データの準備
  const mapToPosts = (data: any[]): Post[] => {
    return data.map((post) => ({
      id: post.id,
      user_id: post.user_id,
      unique_id: post.unique_id,
      username: post.username,
      user_avatar: post.avatar_url,
      content: post.content,
      book_id: post.book_id,
      book_title: post.book_title,
      book_cover: post.book_cover,
      created_at: post.created_at,
      likes_count: post.likes_count,
      comments_count: post.comments_count,
      has_liked: post.is_liked,
      status: post.status,
      rating: post.rating,
    }));
  };

  const allPosts = 'posts' in allPostsResult ? mapToPosts(allPostsResult.posts) : [];
  const followingPosts =
    'posts' in followingPostsResult ? mapToPosts(followingPostsResult.posts) : [];
  const trendingPosts = 'posts' in trendingPostsResult ? mapToPosts(trendingPostsResult.posts) : [];

  // total件数からページ数を計算
  const calculateTotalPages = (total: number, limit: number = 10) => Math.ceil(total / limit);

  const allPostsTotalPages =
    'total' in allPostsResult ? calculateTotalPages(allPostsResult.total) : 0;
  const followingPostsTotalPages =
    'total' in followingPostsResult ? calculateTotalPages(followingPostsResult.total) : 0;
  const trendingPostsTotalPages =
    'total' in trendingPostsResult ? calculateTotalPages(trendingPostsResult.total) : 0;

  return (
    <div className="p-4">
      {/* フォロー中のユーザー */}
      <Suspense fallback={<div>Loading...</div>}>
        <AvatarList
          users={(followingBooks ?? []).map(
            (book: FollowingBook) =>
              ({
                id: book.user_id,
                name: book.username,
                avatar_url: book.avatar_url,
              }) as User,
          )}
        />
      </Suspense>

      {/* 投稿フィード (新しく追加) */}
      <div className="my-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">読書アクティビティ</h2>
          <CreatePostDialog />
        </div>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">すべて</TabsTrigger>
            <TabsTrigger value="following">フォロー中</TabsTrigger>
            <TabsTrigger value="recommended">人気</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <PostList
              initialPosts={allPosts}
              initialPage={1}
              totalPages={allPostsTotalPages}
              filter="all"
            />
          </TabsContent>

          <TabsContent value="following" className="mt-4">
            <PostList
              initialPosts={followingPosts}
              initialPage={1}
              totalPages={followingPostsTotalPages}
              filter="following"
            />
          </TabsContent>

          <TabsContent value="recommended" className="mt-4">
            <PostList
              initialPosts={trendingPosts}
              initialPage={1}
              totalPages={trendingPostsTotalPages}
              filter="recommended"
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* タブ付きのランキング表示 */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">本のランキング</h2>
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weekly">週間ランキング</TabsTrigger>
            <TabsTrigger value="monthly">月間ランキング</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly">
            <div className="text-2xl font-bold mb-4">今週のランキングTop10</div>
            <Carousel>
              <CarouselContent>
                {(weeklyRanking ?? []).map((book: RankingBook, index: number) => (
                  <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <span className="text-xl font-semibold mb-2">{index + 1}</span>
                          {book.cover_image ? (
                            <img
                              src={book.cover_image}
                              alt={book.title}
                              className="w-full h-40 object-cover mb-2"
                            />
                          ) : (
                            <div className="w-full h-40 bg-gray-200 flex items-center justify-center mb-2">
                              表紙なし
                            </div>
                          )}
                          <span className="text-sm text-center line-clamp-1">{book.title}</span>
                          <span className="text-xs text-gray-500">
                            評価: {book.avg_rating.toFixed(1)}
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </TabsContent>
          <TabsContent value="monthly">
            <div className="text-2xl font-bold mb-4">今月のランキングTop10</div>
            <Carousel>
              <CarouselContent>
                {(monthlyRanking ?? []).map((book: RankingBook, index: number) => (
                  <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <span className="text-xl font-semibold mb-2">{index + 1}</span>
                          {book.cover_image ? (
                            <img
                              src={book.cover_image}
                              alt={book.title}
                              className="w-full h-40 object-cover mb-2"
                            />
                          ) : (
                            <div className="w-full h-40 bg-gray-200 flex items-center justify-center mb-2">
                              表紙なし
                            </div>
                          )}
                          <span className="text-sm text-center line-clamp-1">{book.title}</span>
                          <span className="text-xs text-gray-500">
                            評価: {book.avg_rating.toFixed(1)}
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </TabsContent>
        </Tabs>

        {/* おすすめ本の表示 */}
        <div className="mt-8">
          <div className="text-2xl font-bold mb-4">あなたへのおすすめ</div>
          <Carousel>
            <CarouselContent>
              {/* {(recommendations ?? []).map((book: RecommendationBook, index: number) => (
                <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        {book.cover_image ? (
                          <img
                            src={book.cover_image}
                            alt={book.title}
                            className="w-full h-40 object-cover mb-2"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-200 flex items-center justify-center mb-2">
                            表紙なし
                          </div>
                        )}
                        <span className="text-sm text-center line-clamp-1">{book.title}</span>
                        <span className="text-xs text-gray-500">{book.genre_name}</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))} */}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* ユーザーの好みのジャンル */}
        <div className="mt-8">
          <div className="text-2xl font-bold mb-4">あなたの好みのジャンル</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {(userGenres ?? []).map((genre: UserGenre) => (
              <Card key={genre.genre_id}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{genre.genre_name}</h3>
                  <p className="text-sm text-gray-500">読んだ本: {genre.book_count}冊</p>
                  <p className="text-sm text-gray-500">平均評価: {genre.avg_rating.toFixed(1)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
