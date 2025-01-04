import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { user_id, book_id, status } = body;
    console.log('book_id', book_id);
    console.log('user_id', user_id);
    console.log('status', status);

    const { error } = await supabase
      .from('user_book')
      .update({ status })
      .match({ user_id, book_id });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
