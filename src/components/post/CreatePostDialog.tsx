'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { SearchIcon, RotateCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { createPost, searchBooks, getMyBookshelf } from '@/app/timeline/actions';

type Book = {
  book_id: string;
  title: string;
  author: string;
  cover_image: string;
  status?: string;
  rating?: number;
};

type PostForm = {
  content: string;
  book_id?: string;
  book_title?: string;
  book_author?: string;
  book_cover?: string;
  status?: 'reading' | 'finished' | 'want_to_read';
  rating?: number;
};

export function CreatePostDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PostForm>({ content: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [bookshelf, setBookshelf] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [bookshelfLoading, setBookshelfLoading] = useState(false);
  const [error, setError] = useState('');

  // モーダルが開いたときに本棚を取得
  useEffect(() => {
    if (open) {
      fetchBookshelf();
    } else {
      // モーダルを閉じたときにフォームをリセット
      setForm({ content: '' });
      setSearchQuery('');
      setSearchResults([]);
      setError('');
    }
  }, [open]);

  // 本棚を取得
  const fetchBookshelf = async () => {
    setBookshelfLoading(true);
    try {
      const result = await getMyBookshelf();
      if (result.error) {
        toast.error(result.error);
      } else if (result.books) {
        setBookshelf(result.books);
      }
    } catch (error) {
      console.error('本棚の取得に失敗しました:', error);
    } finally {
      setBookshelfLoading(false);
    }
  };

  // 本を検索
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setError('');

    try {
      const result = await searchBooks(searchQuery);
      if (result.error) {
        setError(result.error);
      } else if (result.books && result.books.length > 0) {
        setSearchResults(result.books);
      } else {
        setSearchResults([]);
        setError('検索結果が見つかりませんでした。');
      }
    } catch (error) {
      console.error('検索中にエラーが発生しました:', error);
      setError('検索中にエラーが発生しました。');
    } finally {
      setSearchLoading(false);
    }
  };

  // 本を選択
  const selectBook = (book: Book) => {
    setForm({
      ...form,
      book_id: book.book_id,
      book_title: book.title,
      book_author: book.author,
      book_cover: book.cover_image,
      status: (book.status as any) || undefined,
      rating: book.rating,
    });
  };

  // 本の選択を解除
  const clearSelectedBook = () => {
    setForm({
      ...form,
      book_id: undefined,
      book_title: undefined,
      book_author: undefined,
      book_cover: undefined,
      status: undefined,
      rating: undefined,
    });
  };

  // 投稿を作成
  const handleSubmit = async () => {
    if (!form.content.trim()) {
      setError('投稿内容を入力してください。');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await createPost({
        content: form.content,
        book_id: form.book_id,
        status: form.status,
        rating: form.rating,
        book_title: form.book_title,
        book_author: form.book_author,
        book_cover: form.book_cover,
      });

      if (result.error) {
        setError(result.error);
      } else {
        toast.success('投稿しました！');
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error('投稿中にエラーが発生しました:', error);
      setError('投稿に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto">投稿する</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新しい投稿</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 投稿内容入力 */}
          <Textarea
            placeholder="いま読んでいる本や感想をシェアしましょう..."
            className="min-h-[100px]"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />

          {/* 選択された本の表示 */}
          {form.book_id && (
            <div className="flex items-start space-x-3 p-3 border rounded-md relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={clearSelectedBook}>
                <X className="h-4 w-4" />
              </Button>

              {form.book_cover && (
                <div className="relative w-16 h-24 flex-shrink-0">
                  <Image
                    src={form.book_cover}
                    alt={form.book_title || '本の表紙'}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}

              <div className="flex-1">
                <p className="font-medium">{form.book_title}</p>

                {/* 読書ステータス選択 */}
                <div className="mt-2">
                  <RadioGroup
                    value={form.status}
                    onValueChange={(value) =>
                      setForm({ ...form, status: value as 'reading' | 'finished' | 'want_to_read' })
                    }>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="reading" id="reading" />
                        <Label htmlFor="reading">読書中</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="finished" id="finished" />
                        <Label htmlFor="finished">読了</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="want_to_read" id="want_to_read" />
                        <Label htmlFor="want_to_read">読みたい</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* 評価入力（読了の場合のみ表示） */}
                {form.status === 'finished' && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="rating">評価:</Label>
                      <Input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        value={form.rating || ''}
                        onChange={(e) =>
                          setForm({ ...form, rating: Number(e.target.value) || undefined })
                        }
                        className="w-16"
                      />
                      <span>/5</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 本の選択 */}
          {!form.book_id && (
            <Tabs defaultValue="search" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="search">本を検索</TabsTrigger>
                <TabsTrigger value="bookshelf">本棚から選択</TabsTrigger>
              </TabsList>

              {/* 本の検索タブ */}
              <TabsContent value="search" className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="タイトルまたは著者で検索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                  />
                  <Button onClick={handleSearch} disabled={searchLoading} type="button">
                    {searchLoading ? (
                      <RotateCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <SearchIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {searchResults.length > 0 ? (
                  <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {searchResults.map((book) => (
                      <div
                        key={book.book_id}
                        className="flex items-start space-x-3 p-2 border rounded cursor-pointer hover:bg-gray-50"
                        onClick={() => selectBook(book)}>
                        {book.cover_image && (
                          <div className="relative w-12 h-16 flex-shrink-0">
                            <Image
                              src={book.cover_image}
                              alt={book.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-sm text-gray-500">{book.author}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-2 text-gray-500">
                    {searchLoading ? '検索中...' : '検索結果がここに表示されます'}
                  </div>
                )}
              </TabsContent>

              {/* 本棚からの選択タブ */}
              <TabsContent value="bookshelf" className="space-y-4">
                {bookshelfLoading ? (
                  <div className="text-center py-4">
                    <RotateCw className="h-5 w-5 animate-spin mx-auto" />
                    <p className="mt-2 text-sm text-gray-500">本棚を読み込み中...</p>
                  </div>
                ) : bookshelf.length > 0 ? (
                  <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {bookshelf.map((book) => (
                      <div
                        key={book.book_id}
                        className="flex items-start space-x-3 p-2 border rounded cursor-pointer hover:bg-gray-50"
                        onClick={() => selectBook(book)}>
                        {book.cover_image && (
                          <div className="relative w-12 h-16 flex-shrink-0">
                            <Image
                              src={book.cover_image}
                              alt={book.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-sm text-gray-500">{book.author}</p>
                          <p className="text-xs text-gray-400">
                            {book.status === 'reading' && '読書中'}
                            {book.status === 'finished' && '読了'}
                            {book.status === 'want_to_read' && '読みたい'}
                            {book.status === 'finished' && book.rating && ` • ${book.rating}/5`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>本棚に本がありません</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          {/* エラーメッセージ */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? <RotateCw className="h-4 w-4 animate-spin mr-2" /> : null}
              投稿する
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
