'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import UserList from './userList';
import { FollowUser, getFollowing, getFollowers } from '@/app/profile/[id]/actions';

interface FollowTabsProps {
  userId: string;
  currentUserId?: string;
}

// 投稿データの型定義
type Post = {
  id: string;
  user_id: string;
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

// コメントの型定義
type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  username: string;
  user_avatar: string | null;
  content: string;
  created_at: string;
};

export default function FollowTabs({ userId, currentUserId }: FollowTabsProps) {
  const [activeTab, setActiveTab] = useState('following');
  const [followingUsers, setFollowingUsers] = useState<FollowUser[]>([]);
  const [followersUsers, setFollowersUsers] = useState<FollowUser[]>([]);
  const [followingTotal, setFollowingTotal] = useState(0);
  const [followersTotal, setFollowersTotal] = useState(0);
  const [followingPage, setFollowingPage] = useState(1);
  const [followersPage, setFollowersPage] = useState(1);
  const [followingTotalPages, setFollowingTotalPages] = useState(0);
  const [followersTotalPages, setFollowersTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // フォロー中のユーザーを取得
  const fetchFollowing = async (page: number = 1) => {
    setLoading(true);
    try {
      const result = await getFollowing(userId, page);
      if ('error' in result) {
        setError(result.error);
      } else {
        if (page === 1) {
          setFollowingUsers(result.users);
        } else {
          setFollowingUsers((prev) => [...prev, ...result.users]);
        }
        setFollowingTotal(result.total);
        setFollowingPage(result.currentPage);
        setFollowingTotalPages(result.totalPages);
      }
    } catch (err) {
      setError('フォロー中のユーザーを読み込み中にエラーが発生しました。');
      console.error('Error fetching following users:', err);
    } finally {
      setLoading(false);
    }
  };

  // フォロワーを取得
  const fetchFollowers = async (page: number = 1) => {
    setLoading(true);
    try {
      const result = await getFollowers(userId, page);
      if ('error' in result) {
        setError(result.error);
      } else {
        if (page === 1) {
          setFollowersUsers(result.users);
        } else {
          setFollowersUsers((prev) => [...prev, ...result.users]);
        }
        setFollowersTotal(result.total);
        setFollowersPage(result.currentPage);
        setFollowersTotalPages(result.totalPages);
      }
    } catch (err) {
      setError('フォロワーを読み込み中にエラーが発生しました。');
      console.error('Error fetching followers:', err);
    } finally {
      setLoading(false);
    }
  };

  // タブ変更時のデータ取得
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'following' && followingUsers.length === 0) {
      fetchFollowing();
    } else if (value === 'followers' && followersUsers.length === 0) {
      fetchFollowers();
    }
  };

  // 初回レンダリング時にフォロー中のユーザーを取得
  useEffect(() => {
    fetchFollowing();
  }, [userId]);

  // 「もっと見る」ボタンのハンドラー
  const handleLoadMore = () => {
    if (activeTab === 'following' && followingPage < followingTotalPages) {
      fetchFollowing(followingPage + 1);
    } else if (activeTab === 'followers' && followersPage < followersTotalPages) {
      fetchFollowers(followersPage + 1);
    }
  };

  return (
    <Tabs defaultValue="following" onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="following" className="flex items-center gap-2">
          フォロー中
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {followingTotal}
          </span>
        </TabsTrigger>
        <TabsTrigger value="followers" className="flex items-center gap-2">
          フォロワー
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {followersTotal}
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="following" className="pt-2">
        <UserList
          users={followingUsers}
          loading={loading && followingUsers.length === 0}
          currentUserId={currentUserId}
          emptyMessage="フォロー中のユーザーはいません。"
        />
        {followingPage < followingTotalPages && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={loading}
              className="w-full">
              {loading ? '読み込み中...' : 'もっと見る'}
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="followers" className="pt-2">
        <UserList
          users={followersUsers}
          loading={loading && followersUsers.length === 0}
          currentUserId={currentUserId}
          emptyMessage="フォロワーはいません。"
        />
        {followersPage < followersTotalPages && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={loading}
              className="w-full">
              {loading ? '読み込み中...' : 'もっと見る'}
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
