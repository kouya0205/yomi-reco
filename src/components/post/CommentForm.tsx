'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { addComment } from '@/app/timeline/actions';
import { Post } from './postCard';
import { useToast } from '@/components/hooks/use-toast';

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
}

export default function CommentForm({ post, isOpen, onClose, onCommentAdded }: CommentFormProps) {
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>コメントを追加</DialogTitle>
          <DialogDescription>{post.username}さんの投稿にコメントを追加します</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>コメント</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="コメントを入力してください..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                キャンセル
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    送信中...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    送信
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
