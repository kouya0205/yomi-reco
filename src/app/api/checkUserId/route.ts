import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, oldId } = body;
    if (!id) {
      return NextResponse.json({ error: 'Userid is required' }, { status: 400 });
    }

    if (oldId && oldId === id) {
      return NextResponse.json({ isTaken: false });
    }

    const supabase = await createClient();
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
