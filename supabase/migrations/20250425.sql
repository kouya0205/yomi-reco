-- 投稿テーブル
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  book_id TEXT REFERENCES books(book_id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('reading', 'finished', 'want_to_read')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- いいねテーブル
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- コメントテーブル
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- インデックスの作成
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_book_id ON posts(book_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_posts_likes_count ON posts(likes_count);
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX idx_post_comments_user_id ON post_comments(user_id);

-- いいねカウントを増やす関数
CREATE OR REPLACE FUNCTION increment_likes_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET likes_count = likes_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- いいねカウントを減らす関数
CREATE OR REPLACE FUNCTION decrement_likes_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- コメントカウントを増やす関数
CREATE OR REPLACE FUNCTION increment_comments_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET comments_count = comments_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- コメントカウントを減らす関数
CREATE OR REPLACE FUNCTION decrement_comments_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- 投稿にコメントが追加されたときのトリガー
CREATE OR REPLACE FUNCTION on_comment_added() 
RETURNS TRIGGER AS $$
BEGIN
  PERFORM increment_comments_count(NEW.post_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_added_trigger
AFTER INSERT ON post_comments
FOR EACH ROW EXECUTE FUNCTION on_comment_added();

-- コメントが削除されたときのトリガー
CREATE OR REPLACE FUNCTION on_comment_deleted() 
RETURNS TRIGGER AS $$
BEGIN
  PERFORM decrement_comments_count(OLD.post_id);
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_deleted_trigger
AFTER DELETE ON post_comments
FOR EACH ROW EXECUTE FUNCTION on_comment_deleted();

-- Row Level Security (RLS) ポリシーの設定
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- 投稿テーブルのRLSポリシー
CREATE POLICY "誰でも投稿を閲覧可能" ON posts FOR SELECT USING (true);
CREATE POLICY "認証済みユーザーのみ投稿可能" ON posts FOR INSERT WITH CHECK (auth.uid()::text = (SELECT id FROM users WHERE user_id = posts.user_id));
CREATE POLICY "自分の投稿のみ更新可能" ON posts FOR UPDATE USING (auth.uid()::text = (SELECT id FROM users WHERE user_id = posts.user_id));
CREATE POLICY "自分の投稿のみ削除可能" ON posts FOR DELETE USING (auth.uid()::text = (SELECT id FROM users WHERE user_id = posts.user_id));

-- いいねテーブルのRLSポリシー
CREATE POLICY "誰でもいいねを閲覧可能" ON post_likes FOR SELECT USING (true);
CREATE POLICY "認証済みユーザーのみいいね可能" ON post_likes FOR INSERT WITH CHECK (auth.uid()::text = (SELECT id FROM users WHERE user_id = post_likes.user_id));
CREATE POLICY "自分のいいねのみ削除可能" ON post_likes FOR DELETE USING (auth.uid()::text = (SELECT id FROM users WHERE user_id = post_likes.user_id));

-- コメントテーブルのRLSポリシー
CREATE POLICY "誰でもコメントを閲覧可能" ON post_comments FOR SELECT USING (true);
CREATE POLICY "認証済みユーザーのみコメント可能" ON post_comments FOR INSERT WITH CHECK (auth.uid()::text = (SELECT id FROM users WHERE user_id = post_comments.user_id));
CREATE POLICY "自分のコメントのみ更新可能" ON post_comments FOR UPDATE USING (auth.uid()::text = (SELECT id FROM users WHERE user_id = post_comments.user_id));
CREATE POLICY "自分のコメントのみ削除可能" ON post_comments FOR DELETE USING (auth.uid()::text = (SELECT id FROM users WHERE user_id = post_comments.user_id));
