'use client';

import { useState } from 'react';
import PostCard, { Post } from './postCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getPosts } from '@/app/timeline/actions';

interface PostListProps {
  initialPosts: Post[];
  initialPage: number;
  totalPages: number;
  filter?: 'all' | 'following' | 'recommended';
}

export default function PostList({
  initialPosts,
  initialPage,
  totalPages,
  filter = 'all',
}: PostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(page < totalPages);

  // 投稿の表示内容 - ここでコメント表示などのイベントを処理
  const handleCommentClick = (postId: string) => {
    // コメント表示処理（まだ実装されていない）
  };

  // 投稿をさらに読み込む処理
  const loadMorePosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await getPosts({ page: nextPage, limit: 10, filter });

      if ('error' in response) {
        console.error('投稿の読み込みに失敗しました', response.error);
        return;
      }

      // Postの型に合わせてデータを変換
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

      const newPosts = 'posts' in response ? mapToPosts(response.posts) : [];
      setPosts((prev) => [...prev, ...newPosts]);
      setPage(nextPage);

      // total件数と1ページあたりの件数からページ数を計算
      const total = 'total' in response ? response.total : 0;
      const maxPage = Math.ceil(total / 10); // 10はlimitの値
      setHasMore(nextPage < maxPage);
    } catch (error) {
      console.error('投稿の読み込み中にエラーが発生しました', error);
    } finally {
      setLoading(false);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">表示できる投稿がありません。</div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onCommentClick={handleCommentClick} />
      ))}

      {hasMore && (
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={loadMorePosts} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                読み込み中...
              </>
            ) : (
              'もっと見る'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
