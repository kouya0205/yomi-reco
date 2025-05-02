'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toggleFollow } from '@/app/profile/[id]/actions';

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing: boolean;
  isOwnProfile: boolean; // 自分のプロフィールかどうか
}

export function FollowButton({
  targetUserId,
  initialIsFollowing,
  isOwnProfile,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await toggleFollow(targetUserId);
      if (result.error) {
        // エラーハンドリング（例: トースト表示など）
        console.error(result.error);
        // UIの状態を元に戻す（オプション）
        // setIsFollowing(initialIsFollowing);
      } else if (result.success !== undefined) {
        setIsFollowing(result.isFollowing ?? false);
      }
    });
  };

  // 自分のプロフィールではボタンを非表示にする
  if (isOwnProfile) {
    return null;
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      variant={isFollowing ? 'outline' : 'default'}
      size="sm">
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {isFollowing ? 'フォロー中' : 'フォローする'}
    </Button>
  );
}
