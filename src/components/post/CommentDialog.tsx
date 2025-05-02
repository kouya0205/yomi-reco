'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, X, ImageIcon, Gift, ListFilter, Smile, Calendar, MapPin } from 'lucide-react';
import { addComment } from '@/app/timeline/actions';
import type { Post } from './postCard';
import { useToast } from '@/components/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// フォームのスキーマ
const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'コメントを入力してください')
    .max(1000, '1000文字以内で入力してください'),
});

type CommentFormValues = z.infer<typeof commentSchema>;

interface CommentFormProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onCommentAdded?: () => void;
  currentUserAvatar?: string;
}

export default function CommentForm({
  post,
  isOpen,
  onClose,
  onCommentAdded,
  currentUserAvatar = '/placeholder.svg?height=40&width=40',
}: CommentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // フォームの初期化
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  });

  // コメントを追加
  const onSubmit = async (data: CommentFormValues) => {
    setIsLoading(true);
    try {
      const response = await addComment(post.id, data.content);
      if ('error' in response) {
        console.error('コメント追加エラー:', response.error);
        toast({
          title: 'エラー',
          description: 'コメントの追加に失敗しました',
          variant: 'destructive',
        });
        return;
      }

      // フォームをリセット
      form.reset();

      // 成功メッセージ
      toast({
        title: '成功',
        description: 'コメントを追加しました',
      });

      // コールバック実行
      if (onCommentAdded) {
        onCommentAdded();
      }

      // モーダルを閉じる
      onClose();
    } catch (error) {
      console.error('コメント追加中にエラーが発生しました:', error);
      toast({
        title: 'エラー',
        description: 'コメントの追加中にエラーが発生しました',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date || new Date().toISOString());
    return `${d.toLocaleDateString('en-US', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 flex flex-row items-center justify-between border-b">
          <DialogTitle />
        </DialogHeader>

        <div className="p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              {post.user_avatar ? (
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={post.user_avatar || '/placeholder.svg'} alt={post.username} />
                  <AvatarFallback>{post.username?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback>{post.username?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className="font-bold">{post.username}</span>
                <span className="text-gray-500">・{formatDate(post.created_at || '')}</span>
              </div>
              <div className="mt-1">{post.content}</div>
              <div className="mt-3 text-blue-500 text-sm">Replying to @{post.username}</div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={currentUserAvatar || '/placeholder.svg'} alt="Your avatar" />
                    <AvatarFallback>Y</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Post your reply"
                            className="min-h-[100px] border-none resize-none text-xl placeholder:text-gray-500 focus-visible:ring-0 p-0"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-2 border-t">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 rounded-full h-9 w-9">
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 rounded-full h-9 w-9">
                    <Gift className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 rounded-full h-9 w-9">
                    <ListFilter className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 rounded-full h-9 w-9">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 rounded-full h-9 w-9">
                    <Calendar className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 rounded-full h-9 w-9">
                    <MapPin className="h-5 w-5" />
                  </Button>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !form.watch('content')}
                  className="rounded-full bg-gray-500 hover:bg-gray-600 text-white px-6">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      送信中...
                    </>
                  ) : (
                    'Reply'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
