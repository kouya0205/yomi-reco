'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { BookOpen, Star } from 'lucide-react';
import { toggleLike } from '@/app/timeline/actions';
import CommentDialog from './CommentDialog';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Icon } from '@mdi/react';
import { mdiHeart, mdiChatOutline, mdiHeartOutline } from '@mdi/js';

// 投稿データの型定義
export type Post = {
  id: string;
  user_id: string;
  unique_id: string;
  username: string;
  user_avatar: string | null;
  content: string;
  book_id?: string;
  book_title?: string;
  book_cover?: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  has_liked?: boolean;
  status?: 'reading' | 'finished' | 'want_to_read';
  rating?: number;
};

// 読書ステータスを日本語に変換
const statusText = {
  reading: '読書中',
  finished: '読了',
  want_to_read: '積読',
};

interface PostCardProps {
  post: Post;
  onCommentClick?: (postId: string) => void;
}

export default function PostCard({ post, onCommentClick }: PostCardProps) {
  const [liked, setLiked] = useState(post.has_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCommentAnimating, setIsCommentAnimating] = useState(false);

  // post.has_likedが変更されたときにliked状態を更新
  useEffect(() => {
    setLiked(post.has_liked || false);
  }, [post.has_liked]);

  // post.likes_countが変更されたときにlikesCount状態を更新
  useEffect(() => {
    setLikesCount(post.likes_count);
  }, [post.likes_count]);

  // 相対時間の表示（例：「3時間前」）
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ja,
  });

  // いいねの切り替え処理
  const handleLikeToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setIsAnimating(true);

    try {
      const newLikedState = !liked;
      // 次の値を先に計算
      const nextCount = newLikedState ? likesCount + 1 : likesCount - 1;

      // 楽観的UI更新
      setLiked(newLikedState);
      setLikesCount(nextCount);

      // APIでいいねを更新
      const response = await toggleLike(post.id);
      if (response.error) {
        // エラーの場合は元に戻す
        setLiked(liked);
        setLikesCount(post.likes_count);
        console.error('いいねの更新に失敗しました', response.error);
      }
    } catch (error) {
      // エラー時は元に戻す
      setLiked(liked);
      setLikesCount(post.likes_count);
      console.error('いいねの処理中にエラーが発生しました', error);
    } finally {
      setIsLoading(false);
      // アニメーション完了までの時間を確保
      setTimeout(() => {
        setIsAnimating(false);
      }, 600);
    }
  };

  // コメントボタンのアニメーション
  const handleCommentClick = () => {
    console.log('[handleCommentClick] Comment icon clicked.');
    setIsCommentAnimating(true);
    setShowComments(true);

    if (onCommentClick) {
      console.log('[handleCommentClick] onCommentClick provided, calling it.');
      onCommentClick(post.id);
    } else {
      console.log('[handleCommentClick] onCommentClick NOT provided.');
    }

    // アニメーション完了までの時間を確保
    setTimeout(() => {
      setIsCommentAnimating(false);
    }, 600);
  };

  // ★ログ追加: レンダリング時の状態を確認
  console.log('[PostCard Render] showComments state:', showComments);

  return (
    <>
      <Card className="mb-4 overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            {/* ユーザーアバター */}
            <Link href={`/profile/${post.unique_id}`} className="shrink-0">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={post.user_avatar ?? undefined}
                  alt={post.username || 'ユーザー'}
                />
                <AvatarFallback>{post.username?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    href={`/profile/${post.unique_id}`}
                    className="font-semibold hover:underline">
                    {post.username}
                  </Link>
                  <p className="text-xs text-muted-foreground">{timeAgo}</p>
                </div>

                {/* 読書ステータスの表示 */}
                {post.status && (
                  <div className="rounded px-2 py-1 text-xs bg-orange-100 text-orange-800 flex items-center gap-1">
                    {post.status === 'reading' && <BookOpen className="h-3 w-3" />}
                    {post.status === 'finished' && <Star className="h-3 w-3" />}
                    {statusText[post.status]}
                  </div>
                )}
              </div>

              {/* 投稿コンテンツ */}
              <p className="mt-1 whitespace-pre-line">{post.content}</p>

              {/* 本の情報（あれば） */}
              {post.book_id && (
                <Link
                  href={`/book/${post.book_id}`}
                  className="mt-3 flex items-center gap-3 p-2 rounded border border-muted hover:bg-muted/50 transition-colors">
                  {post.book_cover ? (
                    <img
                      src={post.book_cover}
                      alt={post.book_title || '本の表紙'}
                      className="h-16 w-12 object-cover"
                    />
                  ) : (
                    <div className="h-16 w-12 bg-muted flex items-center justify-center text-xs">
                      表紙なし
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{post.book_title}</p>
                    {post.rating !== undefined && post.rating !== null && (
                      <div className="flex items-center text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 fill-current"
                            opacity={i < post.rating! ? 1 : 0.3}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t px-6 py-3">
          <div className="flex items-center justify-between w-full">
            {/* いいねボタン */}
            <Button
              variant="ghost"
              className={cn(
                'text-muted-foreground relative group',
                liked ? 'text-pink-500' : 'hover:text-pink-400',
                'hover:bg-inherit',
                'p-2',
              )}
              onClick={handleLikeToggle}
              disabled={isLoading}>
              {/* ハートアイコン */}
              <div className="relative">
                {liked ? (
                  <motion.div
                    initial={{ scale: isAnimating ? 0.8 : 1 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 15,
                    }}
                    className="relative z-10">
                    <Icon path={mdiHeart} className="mr-1 h-4 w-4 fill-current" color="#f472b6" />
                    <div className="absolute h-4 w-4 inset-0 rounded-full bg-pink-100/0 group-hover:bg-pink-100/80 transition-colors duration-200 scale-150 z-[-1]" />
                    {isAnimating && liked && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-pink-200 z-[-1]"
                        initial={{ scale: 0.1, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                      />
                    )}
                  </motion.div>
                ) : (
                  <div className="relative z-10">
                    <Icon path={mdiHeartOutline} className="h-4 w-4 group-hover:text-pink-400" />
                    <div className="absolute h-4 w-4 inset-0 rounded-full bg-pink-100/0 group-hover:bg-pink-100/80 transition-colors duration-200 scale-150 z-[-1]" />
                  </div>
                )}
              </div>

              {/* いいねカウンター */}
              <div className="ml-1 overflow-hidden h-4 relative inline-flex justify-center w-4">
                <AnimatePresence mode="popLayout" initial={false}>
                  {likesCount > 0 && (
                    <motion.div
                      key={likesCount}
                      className="absolute flex items-center justify-center"
                      initial={{
                        y: 16,
                        opacity: 0,
                        rotateX: 45,
                      }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        rotateX: 0,
                      }}
                      exit={{
                        y: -16,
                        opacity: 0,
                        rotateX: -45,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                      }}
                      style={{
                        transformOrigin: 'center center',
                        transformStyle: 'preserve-3d',
                      }}>
                      <span
                        className={cn(
                          liked ? 'text-pink-500' : 'text-muted-foreground',
                          'group-hover:text-pink-400',
                        )}>
                        {likesCount}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Button>

            {/* コメントボタン */}
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-blue-500 relative group p-2 hover:bg-inherit"
              onClick={handleCommentClick}>
              <div className="relative z-10">
                <Icon path={mdiChatOutline} className="h-4 w-4 group-hover:text-blue-500" />
                <div className="absolute h-4 w-4 inset-0 rounded-full bg-blue-100/0 group-hover:bg-blue-100/80 transition-colors duration-200 scale-150 z-[-1]" />
                {isCommentAnimating && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-200 z-[-1]"
                    initial={{ scale: 0.1, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </div>

              {/* コメントカウンター */}
              {post.comments_count > 0 && (
                <div className="ml-1 overflow-hidden h-4 relative inline-flex justify-center w-4">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={post.comments_count}
                      className="absolute flex items-center justify-center"
                      initial={{
                        y: isCommentAnimating ? 16 : 0,
                        opacity: isCommentAnimating ? 0 : 1,
                        rotateX: isCommentAnimating ? 45 : 0,
                      }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        rotateX: 0,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                      }}
                      style={{
                        transformOrigin: 'center center',
                        transformStyle: 'preserve-3d',
                      }}>
                      <span className="group-hover:text-blue-500">{post.comments_count}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* コメントダイアログ */}
      {console.log('[PostCard Render] Rendering CommentDialog? showComments is:', showComments)}
      <CommentDialog post={post} isOpen={showComments} onClose={() => setShowComments(false)} />
    </>
  );
}
