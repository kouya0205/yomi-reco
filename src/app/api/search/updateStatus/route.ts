// /search/updateStatus/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { user_id, book, status } = body; // フロントから送られる想定
    console.log('book', book);

    // user_id, book_id をユニークキーにしている場合 (あるいは複合一意キー)
    // なければINSERT、有ればUPDATEを行う
    // 先にbooksに登録されているか確認し、なければ登録する
    const { error: bookError } = await supabase.from('books').upsert({
      book_id: book.id,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      cover_image: book.coverImage,
    });
    const { error } = await supabase.from('user_book').upsert({
      user_id,
      book_id: book.id,
      status, // 変更したいステータスをセット
      is_public: false, // 必要に応じてデフォルト値など
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
