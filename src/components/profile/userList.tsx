'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';
import { toggleFollow } from '@/app/profile/[id]/actions';
import { FollowUser } from '@/app/profile/[id]/actions';

interface UserListProps {
  users: FollowUser[];
  loading?: boolean;
  currentUserId?: string;
  showFollowButton?: boolean;
  emptyMessage?: string;
}

export default function UserList({
  users,
  loading = false,
  currentUserId,
  showFollowButton = true,
  emptyMessage = 'ユーザーがいません。',
}: UserListProps) {
  const [followStatus, setFollowStatus] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  // 初期値を設定
  if (users.length > 0 && Object.keys(followStatus).length === 0) {
    const initialStatus: Record<string, boolean> = {};
    users.forEach((user) => {
      initialStatus[user.id] = user.is_following ?? false;
    });
    setFollowStatus(initialStatus);
  }

  const handleToggleFollow = (userId: string) => {
    if (isPending) return;

    startTransition(async () => {
      const result = await toggleFollow(userId);
      if (result.success) {
        setFollowStatus((prev) => ({
          ...prev,
          [userId]: result.isFollowing ?? !prev[userId],
        }));
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return <p className="text-center text-muted-foreground py-8">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-4">
      {users.map((user) => {
        const isOwnProfile = currentUserId === user.user_id;
        const isFollowing = followStatus[user.id] ?? user.is_following ?? false;

        return (
          <Card key={user.id} className="overflow-hidden hover:bg-muted/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Link href={`/profile/${user.id}`} className="shrink-0">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar_url ?? undefined} alt={user.name || 'ユーザー'} />
                    <AvatarFallback>{user.name?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/profile/${user.id}`}
                    className="font-semibold hover:underline block truncate">
                    {user.name}
                  </Link>
                  <p className="text-sm text-muted-foreground truncate">@{user.id}</p>
                </div>
                {showFollowButton && !isOwnProfile && (
                  <Button
                    onClick={() => handleToggleFollow(user.id)}
                    disabled={isPending}
                    variant={isFollowing ? 'outline' : 'default'}
                    size="sm">
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isFollowing ? 'フォロー中' : 'フォローする'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
