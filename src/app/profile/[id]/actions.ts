'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export type FollowUser = {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string | null;
  is_following?: boolean;
};

export async function toggleFollow(targetUserId: string) {
  const supabase = await createClient();

  const {
    data: { user: loggedInUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !loggedInUser) {
    return { error: '認証が必要です。' };
  }

  // 対象ユーザーのUUIDを取得 (idカラムから)
  const { data: targetUser, error: targetUserError } = await supabase
    .from('users')
    .select('user_id')
    .eq('id', targetUserId)
    .single();

  if (targetUserError || !targetUser) {
    return { error: '対象ユーザーが見つかりません。' };
  }

  const targetUserUuid = targetUser.user_id;

  // 自分自身をフォローできないようにする
  if (loggedInUser.id === targetUserUuid) {
    return { error: '自分自身をフォローすることはできません。' };
  }

  // 現在のフォロー状態を確認
  const { data: existingFollow, error: followCheckError } = await supabase
    .from('user_follows')
    .select('id')
    .eq('follower_id', loggedInUser.id)
    .eq('following_id', targetUserUuid)
    .maybeSingle(); // レコードが存在しない場合は null が返る

  if (followCheckError) {
    console.error('Error checking follow status:', followCheckError);
    return { error: 'フォロー状態の確認中にエラーが発生しました。' };
  }

  try {
    if (existingFollow) {
      // フォロー中の場合：アンフォロー（レコード削除）
      const { error: unfollowError } = await supabase
        .from('user_follows')
        .delete()
        .match({ follower_id: loggedInUser.id, following_id: targetUserUuid });

      if (unfollowError) {
        console.error('Error unfollowing user:', unfollowError);
        return { error: 'アンフォロー中にエラーが発生しました。' };
      }
    } else {
      // フォローしていない場合：フォロー（レコード挿入）
      const { error: followError } = await supabase
        .from('user_follows')
        .insert({ follower_id: loggedInUser.id, following_id: targetUserUuid });

      if (followError) {
        console.error('Error following user:', followError);
        // UNIQUE制約違反(既にフォロー済み)などの可能性
        if (followError.code === '23505') {
          // 既にフォローされている場合は特にエラーとしないか、メッセージを調整
        } else {
          return { error: 'フォロー中にエラーが発生しました。' };
        }
      }
    }

    // キャッシュをクリアしてUIを更新
    revalidatePath(`/profile/${targetUserId}`);
    return { success: true, isFollowing: !existingFollow };
  } catch (error) {
    console.error('Unexpected error during follow toggle:', error);
    return { error: '予期せぬエラーが発生しました。' };
  }
}

export async function getFollowing(userId: string, page: number = 1, limit: number = 10) {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  // ユーザーのUUIDを取得
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('user_id')
    .eq('id', userId)
    .single();

  if (userError || !userData) {
    return { error: 'ユーザーが見つかりません。' };
  }

  const userUuid = userData.user_id;

  // フォロー中のユーザーを取得
  const {
    data: followingData,
    error: followingError,
    count,
  } = await supabase
    .from('user_follows')
    .select(
      `
      following_id,
      following:following_id(
        id,
        user_id,
        name,
        avatar_url
      )
    `,
      { count: 'exact' },
    )
    .eq('follower_id', userUuid)
    .range(offset, offset + limit - 1);

  if (followingError) {
    console.error('Error fetching following users:', followingError);
    return { error: 'フォロー中のユーザー取得中にエラーが発生しました。' };
  }

  // ログインユーザーのフォロー状態を確認
  const {
    data: { user: loggedInUser },
  } = await supabase.auth.getUser();

  let followingUsers: FollowUser[] = [];

  if (followingData && followingData.length > 0) {
    // フォロー中のユーザー情報を整形
    followingUsers = followingData.map((follow) => {
      const user = follow.following as any;
      return {
        id: user.id,
        user_id: user.user_id,
        name: user.name,
        avatar_url: user.avatar_url,
      };
    });

    // ログインしている場合は、各ユーザーをフォローしているか確認
    if (loggedInUser) {
      const followingIds = followingUsers.map((user) => user.user_id);

      if (followingIds.length > 0) {
        const { data: followStatus } = await supabase
          .from('user_follows')
          .select('following_id')
          .eq('follower_id', loggedInUser.id)
          .in('following_id', followingIds);

        const followingSet = new Set((followStatus || []).map((f) => f.following_id));

        followingUsers = followingUsers.map((user) => ({
          ...user,
          is_following: followingSet.has(user.user_id),
        }));
      }
    }
  }

  return {
    users: followingUsers,
    total: count || 0,
    currentPage: page,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function getFollowers(userId: string, page: number = 1, limit: number = 10) {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  // ユーザーのUUIDを取得
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('user_id')
    .eq('id', userId)
    .single();

  if (userError || !userData) {
    return { error: 'ユーザーが見つかりません。' };
  }

  const userUuid = userData.user_id;

  // フォロワーを取得
  const {
    data: followersData,
    error: followersError,
    count,
  } = await supabase
    .from('user_follows')
    .select(
      `
      follower_id,
      follower:follower_id(
        id,
        user_id,
        name,
        avatar_url
      )
    `,
      { count: 'exact' },
    )
    .eq('following_id', userUuid)
    .range(offset, offset + limit - 1);

  if (followersError) {
    console.error('Error fetching followers:', followersError);
    return { error: 'フォロワー取得中にエラーが発生しました。' };
  }

  // ログインユーザーのフォロー状態を確認
  const {
    data: { user: loggedInUser },
  } = await supabase.auth.getUser();

  let followers: FollowUser[] = [];

  if (followersData && followersData.length > 0) {
    // フォロワーの情報を整形
    followers = followersData.map((follow) => {
      const user = follow.follower as any;
      return {
        id: user.id,
        user_id: user.user_id,
        name: user.name,
        avatar_url: user.avatar_url,
      };
    });

    // ログインしている場合は、各ユーザーをフォローしているか確認
    if (loggedInUser) {
      const followerIds = followers.map((user) => user.user_id);

      if (followerIds.length > 0) {
        const { data: followStatus } = await supabase
          .from('user_follows')
          .select('following_id')
          .eq('follower_id', loggedInUser.id)
          .in('following_id', followerIds);

        const followingSet = new Set((followStatus || []).map((f) => f.following_id));

        followers = followers.map((user) => ({
          ...user,
          is_following: followingSet.has(user.user_id),
        }));
      }
    }
  }

  return {
    users: followers,
    total: count || 0,
    currentPage: page,
    totalPages: Math.ceil((count || 0) / limit),
  };
}
