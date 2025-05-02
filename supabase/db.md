# データベース設計

## テーブル一覧

### users（ユーザー情報）

| カラム名   | 型          | 制約                   | 説明                 |
| ---------- | ----------- | ---------------------- | -------------------- |
| user_id    | uuid        | PRIMARY KEY            | ユーザーID           |
| name       | text        | NOT NULL               | ユーザー名           |
| email      | text        | NOT NULL               | メールアドレス       |
| avatar_url | text        |                        | プロフィール画像URL  |
| created_at | timestamptz | NOT NULL DEFAULT now() | 作成日時             |
| updated_at | timestamptz | NOT NULL DEFAULT now() | 更新日時             |
| is_public  | bool        | NOT NULL DEFAULT true  | プロフィール公開設定 |
| id         | text        |                        | ユニークID           |
| bio        | text        |                        | 自己紹介             |

### books（書籍情報）

| カラム名       | 型          | 制約                   | 説明                         |
| -------------- | ----------- | ---------------------- | ---------------------------- |
| book_id        | text        | PRIMARY KEY            | 書籍ID                       |
| title          | text        | NOT NULL               | タイトル                     |
| author         | text        |                        | 著者                         |
| cover_image    | text        |                        | 表紙画像URL                  |
| created_at     | timestamptz | NOT NULL DEFAULT now() | 作成日時                     |
| updated_at     | timestamptz | NOT NULL DEFAULT now() | 更新日時                     |
| publisher      | text        |                        | 出版社                       |
| isbn           | text        |                        | ISBN                         |
| am_al          | text        |                        | Amazonアフェリエイトリンク   |
| rak_al         | text        |                        | 楽天アフェリエイトリンク     |
| yodo_al        | text        |                        | ヨドバシアフェリエイトリンク |
| honto_al       | text        |                        | hontoアフェリエイトリンク    |
| description    | text        |                        | 説明                         |
| published_date | date        |                        | 出版日                       |
| page_count     | int4        |                        | ページ数                     |
| language       | text        |                        | 言語                         |

### user_book（ユーザーの本棚）

| カラム名     | 型          | 制約                      | 説明             |
| ------------ | ----------- | ------------------------- | ---------------- |
| user_id      | uuid        | REFERENCES users(user_id) | ユーザーID       |
| book_id      | text        | REFERENCES books(book_id) | 書籍ID           |
| status       | text        | NOT NULL                  | 読書状態         |
| is_public    | bool        | NOT NULL DEFAULT true     | 公開設定         |
| created_at   | timestamptz | NOT NULL DEFAULT now()    | 作成日時         |
| updated_at   | timestamptz | NOT NULL DEFAULT now()    | 更新日時         |
| rating       | int4        |                           | 評価（5段階）    |
| review       | text        |                           | レビュー         |
| started_at   | timestamptz |                           | 読み始めた日時   |
| finished_at  | timestamptz |                           | 読み終わった日時 |
| last_read_at | timestamptz |                           | 最後に読んだ日時 |
| read_count   | int4        |                           | 読書回数         |

### notifications（通知）

| カラム名   | 型          | 制約                      | 説明                   |
| ---------- | ----------- | ------------------------- | ---------------------- |
| id         | uuid        | PRIMARY KEY               | 通知ID                 |
| user_id    | uuid        | REFERENCES users(user_id) | 通知を受けるユーザーID |
| message    | text        |                           | 内容                   |
| type       | text        | NOT NULL                  | 通知タイプ             |
| is_read    | bool        | NOT NULL DEFAULT false    | 既読状態               |
| created_at | timestamptz | NOT NULL DEFAULT now()    | 作成日時               |
| updated_at | timestamptz | NOT NULL DEFAULT now()    | 更新日時               |

### user_follows（ユーザーフォロー）

| カラム名     | 型          | 制約                      | 説明                     |
| ------------ | ----------- | ------------------------- | ------------------------ |
| id           | int4        | PRIMARY KEY               | ID                       |
| follower_id  | uuid        | REFERENCES users(user_id) | フォローするユーザーID   |
| following_id | uuid        | REFERENCES users(user_id) | フォローされるユーザーID |
| created_at   | timestamptz | NOT NULL DEFAULT now()    | 作成日時                 |

### book_similarity（本の類似性）

| カラム名         | 型          | 制約                      | 説明         |
| ---------------- | ----------- | ------------------------- | ------------ |
| id               | int4        | PRIMARY KEY               | ID           |
| book_id          | text        | REFERENCES books(book_id) | 書籍ID       |
| similar_book_id  | text        | REFERENCES books(book_id) | 類似書籍ID   |
| similarity_score | float8      | NOT NULL                  | 類似度スコア |
| created_at       | timestamptz | NOT NULL DEFAULT now()    | 作成日時     |

### genres（ジャンル）

| カラム名    | 型          | 制約                   | 説明       |
| ----------- | ----------- | ---------------------- | ---------- |
| id          | SERIAL      | PRIMARY KEY            | ジャンルID |
| name        | text        | NOT NULL UNIQUE        | ジャンル名 |
| description | text        |                        | 説明       |
| created_at  | timestamptz | NOT NULL DEFAULT now() | 作成日時   |

### book_genres（本とジャンルの関連）

| カラム名   | 型          | 制約                      | 説明       |
| ---------- | ----------- | ------------------------- | ---------- |
| id         | SERIAL      | PRIMARY KEY               | ID         |
| book_id    | text        | REFERENCES books(book_id) | 書籍ID     |
| genre_id   | int4        | REFERENCES genres(id)     | ジャンルID |
| created_at | timestamptz | NOT NULL DEFAULT now()    | 作成日時   |

### book_features（本の特徴ベクトル）

| カラム名       | 型          | 制約                      | 説明         |
| -------------- | ----------- | ------------------------- | ------------ |
| id             | SERIAL      | PRIMARY KEY               | ID           |
| book_id        | text        | REFERENCES books(book_id) | 書籍ID       |
| feature_vector | float[]     | NOT NULL                  | 特徴ベクトル |
| created_at     | timestamptz | NOT NULL DEFAULT now()    | 作成日時     |
| updated_at     | timestamptz | NOT NULL DEFAULT now()    | 更新日時     |

### posts（投稿情報）

| カラム名       | 型          | 制約                                | 説明               |
| -------------- | ----------- | ----------------------------------- | ------------------ |
| id             | uuid        | PRIMARY KEY                         | 投稿ID             |
| user_id        | uuid        | REFERENCES users(user_id)           | 投稿者のユーザーID |
| content        | text        | NOT NULL                            | 投稿内容           |
| book_id        | text        | REFERENCES books(book_id)           | 関連書籍ID         |
| status         | text        | CHECK (...)                         | 読書状態           |
| rating         | integer     | CHECK (rating >= 1 AND rating <= 5) | 評価（5段階）      |
| likes_count    | integer     | NOT NULL DEFAULT 0                  | いいね数           |
| comments_count | integer     | NOT NULL DEFAULT 0                  | コメント数         |
| created_at     | timestamptz | NOT NULL DEFAULT now()              | 作成日時           |
| updated_at     | timestamptz | NOT NULL DEFAULT now()              | 更新日時           |

### post_likes（投稿へのいいね）

| カラム名   | 型          | 制約                      | 説明       |
| ---------- | ----------- | ------------------------- | ---------- |
| id         | uuid        | PRIMARY KEY               | いいねID   |
| post_id    | uuid        | REFERENCES posts(id)      | 投稿ID     |
| user_id    | uuid        | REFERENCES users(user_id) | ユーザーID |
| created_at | timestamptz | NOT NULL DEFAULT now()    | 作成日時   |

### post_comments（投稿へのコメント）

| カラム名   | 型          | 制約                      | 説明         |
| ---------- | ----------- | ------------------------- | ------------ |
| id         | uuid        | PRIMARY KEY               | コメントID   |
| post_id    | uuid        | REFERENCES posts(id)      | 投稿ID       |
| user_id    | uuid        | REFERENCES users(user_id) | ユーザーID   |
| content    | text        | NOT NULL                  | コメント内容 |
| created_at | timestamptz | NOT NULL DEFAULT now()    | 作成日時     |
| updated_at | timestamptz | NOT NULL DEFAULT now()    | 更新日時     |

## インデックス

```sql
-- ユーザーの本棚に関するインデックス
CREATE INDEX idx_user_book_user_id ON user_book(user_id);
CREATE INDEX idx_user_book_book_id ON user_book(book_id);
CREATE INDEX idx_user_book_created_at ON user_book(created_at);

-- フォロー関係のインデックス
CREATE INDEX idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following_id ON user_follows(following_id);

-- 本の類似性に関するインデックス
CREATE INDEX idx_book_similarity_book_id ON book_similarity(book_id);
CREATE INDEX idx_book_similarity_similar_book_id ON book_similarity(similar_book_id);

-- ジャンル関連のインデックス
CREATE INDEX idx_book_genres_book_id ON book_genres(book_id);
CREATE INDEX idx_book_genres_genre_id ON book_genres(genre_id);

-- 特徴ベクトル関連のインデックス
CREATE INDEX idx_book_features_book_id ON book_features(book_id);
```

## ユニーク制約

```sql
-- フォロー関係の重複を防ぐ
ALTER TABLE user_follows ADD CONSTRAINT unique_user_follows UNIQUE (follower_id, following_id);

-- 本の類似性の重複を防ぐ
ALTER TABLE book_similarity ADD CONSTRAINT unique_book_similarity UNIQUE (book_id, similar_book_id);

-- ジャンル名の重複を防ぐ
ALTER TABLE genres ADD CONSTRAINT unique_genre_name UNIQUE (name);

-- 本とジャンルの関連の重複を防ぐ
ALTER TABLE book_genres ADD CONSTRAINT unique_book_genre UNIQUE (book_id, genre_id);
```

## 注意事項

1. タイムスタンプはすべてタイムゾーン付き（timestamptz）を使用
2. 外部キー制約は適切に設定されている
3. 必要なインデックスが作成されている
4. ユニーク制約が適切に設定されている
