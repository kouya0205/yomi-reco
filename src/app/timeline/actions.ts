'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Post } from '@/components/post/postCard';

// 投稿作成
export async function createPost(data: {
  content: string;
  book_id?: string;
  status?: 'reading' | 'finished' | 'want_to_read';
  rating?: number;
  book_title?: string; // 本のタイトル情報も受け取るように
  book_author?: string; // 本の著者情報も受け取るように
  book_cover?: string; // 本の表紙情報も受け取るように
}) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'ログインが必要です' };
    }

    const user_id = user.id;

    // 本IDがある場合は、本の情報をbooksテーブルに登録
    if (data.book_id && data.book_title) {
      // 本が既に存在するか確認
      const { data: existingBook } = await supabase
        .from('books')
        .select('book_id')
        .eq('book_id', data.book_id)
        .single();

      if (!existingBook) {
        // 本が存在しない場合は登録
        const bookData = {
          book_id: data.book_id,
          title: data.book_title,
          author: data.book_author || '不明な著者',
          cover_image: data.book_cover || null,
        };

        const { error: bookError } = await supabase.from('books').insert([bookData]);

        if (bookError) {
          console.error('本の登録エラー:', bookError);
          return { error: '本の登録に失敗しました。もう一度お試しください。' };
        }
      }
    }

    const postData = {
      user_id,
      content: data.content,
      book_id: data.book_id || null,
      status: data.status || null,
      rating: data.rating || null,
    };

    const { data: post, error } = await supabase.from('posts').insert([postData]).select().single();

    if (error) {
      console.error('投稿作成エラー:', error);
      return { error: '投稿の作成に失敗しました' };
    }

    // タイムラインを再検証
    revalidatePath('/timeline');
    return { post };
  } catch (error) {
    console.error('投稿作成中にエラーが発生しました:', error);
    return { error: '投稿の作成中にエラーが発生しました' };
  }
}

// 本を検索
export async function searchBooks(query: string) {
  if (!query) {
    return { error: '検索キーワードを入力してください' };
  }

  try {
    // 実際のAPIなどを使って本を検索するロジックを追加
    // この例では簡易的な実装
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`,
    );

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return { error: '検索結果が見つかりませんでした' };
    }

    const books = data.items.map((item: any) => ({
      book_id: item.id,
      title: item.volumeInfo.title || '不明なタイトル',
      author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : '不明な著者',
      cover_image:
        item.volumeInfo.imageLinks?.thumbnail ||
        'https://placehold.co/200x300/e5e7eb/a1a1aa?text=No+Cover',
    }));

    return { books };
  } catch (error) {
    console.error('本の検索中にエラーが発生しました:', error);
    return { error: '本の検索中にエラーが発生しました' };
  }
}

// ユーザーの本棚を取得
export async function getMyBookshelf() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'ログインが必要です' };
    }

    const user_id = user.id;

    const { data: userBooks, error } = await supabase
      .from('user_books')
      .select(
        `
        id,
        book_id,
        status,
        rating,
        books:book_id (
          id,
          title,
          author,
          cover_image
        )
      `,
      )
      .eq('user_id', user_id)
      .order('updated_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('本棚の取得エラー:', error);
      return { error: '本棚の取得に失敗しました' };
    }

    const books = userBooks.map((item: any) => ({
      book_id: item.book_id,
      title: item.books?.title,
      author: item.books?.author,
      cover_image: item.books?.cover_image,
      status: item.status,
      rating: item.rating,
    }));

    return { books };
  } catch (error) {
    console.error('本棚の取得中にエラーが発生しました:', error);
    return { error: '本棚の取得中にエラーが発生しました' };
  }
}

// 投稿を取得
export async function getPosts({
  page = 1,
  limit = 10,
  filter = 'all',
}: {
  page?: number;
  limit?: number;
  filter?: 'all' | 'following' | 'recommended';
}) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      redirect('/login');
    }

    const user_id = user.id;
    const offset = (page - 1) * limit;

    let query = supabase.from('posts').select(
      `
        id,
        content,
        created_at,
        book_id,
        status,
        rating,
        likes_count,
        comments_count,
        user_id,
        profiles:user_id (
          name,
          avatar_url,
          id
        ),
        books:book_id (
          title,
          author,
          cover_image
        )
      `,
      { count: 'exact' },
    );

    // フィルタリング
    if (filter === 'following') {
      // フォローしているユーザーの投稿のみ
      const { data: followingUsers } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user_id);

      if (followingUsers && followingUsers.length > 0) {
        const followingIds = followingUsers.map((f) => f.following_id);
        query = query.in('user_id', [...followingIds, user_id]);
      } else {
        // フォローしているユーザーがいない場合は自分の投稿のみ
        query = query.eq('user_id', user_id);
      }
    } else if (filter === 'recommended') {
      // 今後の実装: レコメンデーションのロジック
      // 今はとりあえず全ての投稿を表示
    }

    // デフォルトソート (作成日時の降順) と ページネーション
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: posts, error, count } = await query;
    console.log(posts);

    if (error) {
      console.error('投稿取得エラー:', error);
      return { error: '投稿の取得に失敗しました' };
    }

    // いいね状態を取得
    const { data: userLikes } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user_id);

    const likedPostIds = new Set(userLikes?.map((like) => like.post_id) || []);

    // 投稿データを整形して返す
    // ここでTypescrptの型エラーを解消するため、anyを一時的に使用
    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      content: post.content,
      created_at: post.created_at,
      user_id: post.user_id,
      unique_id: post.profiles?.id,
      username: post.profiles?.name || '',
      avatar_url: post.profiles?.avatar_url || '',
      book_id: post.book_id,
      book_title: post.books?.title || '',
      book_author: post.books?.author || '',
      book_cover: post.books?.cover_image || '',
      status: post.status,
      rating: post.rating,
      likes_count: post.likes_count || 0,
      comments_count: post.comments_count || 0,
      is_liked: likedPostIds.has(post.id),
    }));
    console.log('formattedPosts', formattedPosts);

    return {
      posts: formattedPosts,
      total: count || 0,
      has_more: Boolean(count && offset + limit < count),
    };
  } catch (error) {
    console.error('投稿取得中にエラーが発生しました:', error);
    return { error: '投稿の取得中にエラーが発生しました' };
  }
}

// いいねを切り替え
export async function toggleLike(postId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'ログインが必要です' };
    }

    const user_id = user.id;

    // 現在のいいね状態を確認
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select()
      .eq('user_id', user_id)
      .eq('post_id', postId)
      .single();

    if (existingLike) {
      // いいねが存在する場合は削除
      const { error } = await supabase.from('post_likes').delete().eq('id', existingLike.id);

      if (error) {
        console.error('いいね削除エラー:', error);
        return { error: 'いいねの削除に失敗しました' };
      }

      // 現在の投稿データを取得してからlikes_countを更新
      const { data: postData } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      const currentLikes = postData?.likes_count || 0;

      // いいねカウントを減らす
      const { error: decError } = await supabase
        .from('posts')
        .update({ likes_count: Math.max(0, currentLikes - 1) })
        .eq('id', postId);

      if (decError) {
        console.error('いいねカウント減少エラー:', decError);
        return { error: 'いいねカウントの減少に失敗しました' };
      }

      // タイムラインを再検証
      revalidatePath('/timeline');
      return { liked: false };
    } else {
      // いいねが存在しない場合は追加
      const { error } = await supabase.from('post_likes').insert([{ user_id, post_id: postId }]);

      if (error) {
        console.error('いいね作成エラー:', error);
        return { error: 'いいねの追加に失敗しました' };
      }

      // 現在の投稿データを取得
      const { data: postData } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      const currentLikes = postData?.likes_count || 0;

      // いいねカウントを増やす
      const { error: incError } = await supabase
        .from('posts')
        .update({ likes_count: currentLikes + 1 })
        .eq('id', postId);

      if (incError) {
        console.error('いいねカウント増加エラー:', incError);
        return { error: 'いいねカウントの増加に失敗しました' };
      }

      // タイムラインを再検証
      revalidatePath('/timeline');
      return { liked: true };
    }
  } catch (error) {
    console.error('いいね操作中にエラーが発生しました:', error);
    return { error: 'いいね操作中にエラーが発生しました' };
  }
}

// コメントを追加
export async function addComment(postId: string, content: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'ログインが必要です' };
    }

    const user_id = user.id;

    // コメントを追加
    const { data: comment, error } = await supabase
      .from('post_comments')
      .insert([{ user_id, post_id: postId, content }])
      .select()
      .single();

    if (error) {
      console.error('コメント作成エラー:', error);
      return { error: 'コメントの追加に失敗しました' };
    }

    // タイムラインを再検証
    revalidatePath('/timeline');
    return { comment };
  } catch (error) {
    console.error('コメント作成中にエラーが発生しました:', error);
    return { error: 'コメントの作成中にエラーが発生しました' };
  }
}

// 投稿のコメントを取得
export async function getComments(postId: string, page = 1, limit = 10) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'ログインが必要です' };
    }

    const offset = (page - 1) * limit;

    // コメントを取得（最新順）
    const {
      data: commentsData,
      error,
      count,
    } = await supabase
      .from('post_comments')
      .select(
        `
        id,
        content,
        created_at,
        user_id,
        profiles:user_id (
          name,
          avatar_url,
          id
        )
      `,
        { count: 'exact' },
      )
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('コメント取得エラー:', error);
      return { error: 'コメントの取得に失敗しました' };
    }

    // コメントデータを整形
    const comments = commentsData.map((comment: any) => ({
      id: comment.id,
      content: comment.content,
      created_at: comment.created_at,
      user_id: comment.user_id,
      username: comment.profiles?.name || '',
      user_avatar: comment.profiles?.avatar_url || '',
      unique_id: comment.profiles?.id,
    }));

    return {
      comments,
      total: count || 0,
      has_more: Boolean(count && offset + limit < count),
    };
  } catch (error) {
    console.error('コメント取得中にエラーが発生しました:', error);
    return { error: 'コメントの取得中にエラーが発生しました' };
  }
}
