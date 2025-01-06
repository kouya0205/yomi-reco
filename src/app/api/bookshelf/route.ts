import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

// GET: 書籍一覧取得用 (サーバーコンポーネントでも利用可能)
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('user_book').select(`
      *,
      books (
        *,
      )
    `);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// PATCH: user_book.status の更新
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { user_id, book_id, newStatus } = body; // フロント側から送信される想定

    const { error } = await supabase
      .from('user_book')
      .update({ status: newStatus })
      .match({ user_id, book_id });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
