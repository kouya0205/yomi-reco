import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { id } = (await request.json()) as { id?: string };
    if (!id) {
      return NextResponse.json({ error: 'Userid is required' }, { status: 400 });
    }

    const supabase = await createClient();
    // 例: users テーブルを参照 (実際のテーブル名に置き換えてください)
    const { data, error } = await supabase.from('users').select('id').eq('id', id).single();

    if (error) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // 既にデータがあれば exists: true
    if (data) {
      return NextResponse.json({ exists: true }, { status: 200 });
    } else {
      return NextResponse.json({ exists: false }, { status: 200 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
