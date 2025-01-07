import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: 'Userid is required' }, { status: 400 });
    }

    const supabase = await createClient();
    // 例: users テーブルを参照 (実際のテーブル名に置き換えてください)
    const { data, error } = await supabase.from('users').select('id').eq('id', id).maybeSingle();

    // DB エラー時
    if (error) {
      console.error(error);
      return NextResponse.json({ isTaken: false, error: error.message });
    }

    // data が存在すれば重複とみなす
    const isTaken = Boolean(data);
    return NextResponse.json({ isTaken });
  } catch (err: any) {
    // エラー処理
    return NextResponse.json({ isTaken: false, error: err.message });
  }
}
