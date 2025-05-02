-- 既存の関数を削除
DROP FUNCTION IF EXISTS get_following_books(UUID, INTEGER);
DROP FUNCTION IF EXISTS get_weekly_popular_books(INTEGER);
DROP FUNCTION IF EXISTS get_monthly_popular_books(INTEGER);
DROP FUNCTION IF EXISTS get_book_recommendations(UUID, INTEGER);
DROP FUNCTION IF EXISTS get_popular_books_by_genre(INTEGER, INTEGER);
DROP FUNCTION IF EXISTS get_user_preferred_genres(UUID, INTEGER);
DROP FUNCTION IF EXISTS get_genre_based_recommendations(UUID, INTEGER);

-- 既存のテーブルを削除
DROP TABLE IF EXISTS follows;
DROP TABLE IF EXISTS book_similarity;
DROP TABLE IF EXISTS book_genres;
DROP TABLE IF EXISTS book_features;
DROP TABLE IF EXISTS genres;

-- テーブルの作成（存在しない場合）
CREATE TABLE IF NOT EXISTS genres (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS book_genres (
  id SERIAL PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(book_id),
  genre_id INTEGER NOT NULL REFERENCES genres(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(book_id, genre_id)
);

CREATE TABLE IF NOT EXISTS book_features (
  id SERIAL PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(book_id),
  feature_vector FLOAT[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS book_similarity (
  id SERIAL PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(book_id),
  similar_book_id TEXT NOT NULL REFERENCES books(book_id),
  similarity_score FLOAT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(book_id, similar_book_id)
);

CREATE TABLE IF NOT EXISTS user_follows (
  id SERIAL PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES users(user_id),
  following_id UUID NOT NULL REFERENCES users(user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_user_book_user_id ON user_book(user_id);
CREATE INDEX IF NOT EXISTS idx_user_book_book_id ON user_book(book_id);
CREATE INDEX IF NOT EXISTS idx_user_book_created_at ON user_book(created_at);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following_id ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_book_genres_book_id ON book_genres(book_id);
CREATE INDEX IF NOT EXISTS idx_book_genres_genre_id ON book_genres(genre_id);
CREATE INDEX IF NOT EXISTS idx_book_features_book_id ON book_features(book_id);
CREATE INDEX IF NOT EXISTS idx_book_similarity_book_id ON book_similarity(book_id);
CREATE INDEX IF NOT EXISTS idx_book_similarity_similar_book_id ON book_similarity(similar_book_id);

-- フォロー中のユーザーの本棚を取得
CREATE OR REPLACE FUNCTION get_following_books(
  current_user_id UUID,
  limit_count INTEGER
) RETURNS TABLE (
  user_id UUID,
  book_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  username TEXT,
  avatar_url TEXT,
  title TEXT,
  author TEXT,
  cover_image TEXT,
  rating INTEGER,
  review TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH following_users AS (
    SELECT following_id
    FROM user_follows
    WHERE follower_id = current_user_id
  )
  SELECT 
    ub.user_id,
    ub.book_id,
    ub.status,
    ub.created_at,
    u.name AS username,
    u.avatar_url,
    b.title,
    b.author,
    b.cover_image,
    ub.rating,
    ub.review
  FROM user_book ub
  INNER JOIN users u ON u.user_id = ub.user_id
  INNER JOIN books b ON b.book_id = ub.book_id
  WHERE ub.user_id IN (SELECT following_id FROM following_users)
    AND ub.is_public = true
  ORDER BY ub.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 週間ランキングを取得
CREATE OR REPLACE FUNCTION get_weekly_popular_books(
  limit_count INTEGER
) RETURNS TABLE (
  book_id TEXT,
  title TEXT,
  author TEXT,
  cover_image TEXT,
  total_adds INTEGER,
  avg_rating NUMERIC,
  popularity_score NUMERIC,
  total_reads INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.book_id,
    b.title,
    b.author,
    b.cover_image,
    COUNT(DISTINCT ub.user_id)::INTEGER AS total_adds,
    COALESCE(AVG(ub.rating), 0)::NUMERIC AS avg_rating,
    (
      COUNT(DISTINCT ub.user_id) * 0.4 + 
      COALESCE(AVG(ub.rating), 0) * 0.3 +
      SUM(ub.read_count) * 0.3
    )::NUMERIC AS popularity_score,
    SUM(ub.read_count)::INTEGER AS total_reads
  FROM books b
  INNER JOIN user_book ub ON ub.book_id = b.book_id
  WHERE ub.created_at >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY b.book_id, b.title, b.author, b.cover_image
  ORDER BY popularity_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 月間ランキングを取得
CREATE OR REPLACE FUNCTION get_monthly_popular_books(
  limit_count INTEGER
) RETURNS TABLE (
  book_id TEXT,
  title TEXT,
  author TEXT,
  cover_image TEXT,
  total_adds INTEGER,
  avg_rating NUMERIC,
  popularity_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.book_id,
    b.title,
    b.author,
    b.cover_image,
    COUNT(DISTINCT ub.user_id)::INTEGER AS total_adds,
    COALESCE(AVG(ub.rating), 0)::NUMERIC AS avg_rating,
    (COUNT(DISTINCT ub.user_id) * 0.7 + COALESCE(AVG(ub.rating), 0) * 0.3)::NUMERIC AS popularity_score
  FROM books b
  INNER JOIN user_book ub ON ub.book_id = b.book_id
  WHERE ub.created_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY b.book_id, b.title, b.author, b.cover_image
  ORDER BY popularity_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ユーザーの好みのジャンルを取得
CREATE OR REPLACE FUNCTION get_user_preferred_genres(
  current_user_id UUID,
  limit_count INTEGER
) RETURNS TABLE (
  genre_id INTEGER,
  genre_name TEXT,
  book_count INTEGER,
  avg_rating NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    g.id AS genre_id,
    g.name AS genre_name,
    COUNT(DISTINCT ub.book_id)::INTEGER AS book_count,
    COALESCE(AVG(ub.rating), 0)::NUMERIC AS avg_rating
  FROM user_book ub
  INNER JOIN book_genres bg ON bg.book_id = ub.book_id
  INNER JOIN genres g ON g.id = bg.genre_id
  WHERE ub.user_id = current_user_id
  GROUP BY g.id, g.name
  ORDER BY book_count DESC, avg_rating DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ジャンルベースのおすすめ本を取得
CREATE OR REPLACE FUNCTION get_genre_based_recommendations(
  current_user_id UUID,
  limit_count INTEGER
) RETURNS TABLE (
  book_id TEXT,
  title TEXT,
  author TEXT,
  cover_image TEXT,
  description TEXT,
  genre_name TEXT,
  recommendation_score NUMERIC
) AS $$
DECLARE
  target_user_id ALIAS FOR current_user_id;
BEGIN
  RETURN QUERY
  WITH user_genres AS (
    SELECT 
      g.id AS genre_id,
      COUNT(DISTINCT ub.book_id) AS genre_count,
      AVG(ub.rating) AS avg_genre_rating
    FROM user_book ub
    INNER JOIN book_genres bg ON bg.book_id = ub.book_id
    INNER JOIN genres g ON g.id = bg.genre_id
    WHERE ub.user_id = target_user_id
    GROUP BY g.id
  ),
  user_books AS (
    SELECT ub.book_id
    FROM user_book ub
    WHERE ub.user_id = target_user_id
  )
  SELECT DISTINCT
    b.book_id,
    b.title,
    b.author,
    b.cover_image,
    b.description,
    g.name AS genre_name,
    (
      COALESCE(ug.genre_count, 0)::NUMERIC * 0.4 +
      COALESCE(ug.avg_genre_rating, 0)::NUMERIC * 0.3 +
      COALESCE(AVG(ou.rating), 0)::NUMERIC * 0.2 +
      COUNT(DISTINCT ou.user_id)::NUMERIC * 0.1
    )::NUMERIC AS recommendation_score
  FROM books b
  INNER JOIN book_genres bg ON bg.book_id = b.book_id
  INNER JOIN genres g ON g.id = bg.genre_id
  LEFT JOIN user_genres ug ON ug.genre_id = g.id
  LEFT JOIN user_book ou ON ou.book_id = b.book_id
  WHERE b.book_id NOT IN (SELECT book_id FROM user_books)
  GROUP BY b.book_id, b.title, b.author, b.cover_image, b.description, g.name, ug.genre_count, ug.avg_genre_rating
  ORDER BY recommendation_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ジャンルごとの人気本を取得
CREATE OR REPLACE FUNCTION get_popular_by_genre(
  p_genre_id INTEGER,
  p_limit INTEGER
) RETURNS TABLE (
  book_id TEXT,
  title TEXT,
  author TEXT,
  cover_image TEXT,
  genre_name TEXT,
  total_adds INTEGER,
  avg_rating NUMERIC,
  popularity_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.book_id,
    b.title,
    b.author,
    b.cover_image,
    g.name AS genre_name,
    COUNT(DISTINCT ub.user_id)::INTEGER AS total_adds,
    COALESCE(AVG(ub.rating), 0)::NUMERIC AS avg_rating,
    (COUNT(DISTINCT ub.user_id) * 0.7 + COALESCE(AVG(ub.rating), 0) * 0.3)::NUMERIC AS popularity_score
  FROM books b
  INNER JOIN book_genres bg ON bg.book_id = b.book_id
  INNER JOIN genres g ON g.id = bg.genre_id
  LEFT JOIN user_book ub ON ub.book_id = b.book_id
  WHERE g.id = p_genre_id
  GROUP BY b.book_id, b.title, b.author, b.cover_image, g.name
  ORDER BY popularity_score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql; 