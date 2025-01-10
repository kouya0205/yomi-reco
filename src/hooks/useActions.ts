'use server';

import { parseWithZod } from '@conform-to/zod';
import { Provider } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { decode } from 'base64-arraybuffer';

import { supabaseErrorMessages } from '@/config/errorMessage';
import { loginSchema, signupSchema, userIdSchema } from '@/config/schema';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function emailLogin(prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const submission = parseWithZod(formData, {
    schema: loginSchema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    const errorMessage = error.code
      ? supabaseErrorMessages[error.code]
      : '不明なエラーが発生しました';
    return submission.reply({
      formErrors: [errorMessage],
    });
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = await supabase.from('users').select('id').eq('user_id', user?.id).maybeSingle();

  if (user?.id !== userId.data?.id) {
    return redirect('/bookshelf');
  }

  return submission.reply();
}

export async function signup(prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const submission = parseWithZod(formData, {
    schema: signupSchema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const email = formData.get('email') as string;
  const name = formData.get('username') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        // name: name,
        email: email,
      },
    },
  });

  if (error) {
    const errorMessage = error.code
      ? supabaseErrorMessages[error.code]
      : '不明なエラーが発生しました';
    return submission.reply({
      formErrors: [errorMessage],
    });
  }
  return submission.reply();
}

export async function userId(prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const submission = parseWithZod(formData, {
    schema: userIdSchema,
  });

  // バリデーションエラーならそのまま返す
  if (submission.status !== 'success') {
    return submission.reply();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/auth');
  }
  const { data: Id } = await supabase.from('users').select('id').eq('user_id', user.id);

  const name = formData.get('username') as string;
  const id = formData.get('id') as string;
  if (Id && Id?.[0]?.id === id) {
    const { error: nameError } = await supabase
      .from('users')
      .update({ name })
      .match({ user_id: user.id });
    if (nameError) {
      return submission.reply({ formErrors: ['更新に失敗しました'] });
    }
    return redirect('/settings');
  }

  // ここで再度 重複チェックしておくとベター
  const { data: existing, error: checkError } = await supabase
    .from('users')
    .select('id')
    .eq('id', id)
    .maybeSingle();

  if (checkError) {
    // DBエラーの場合は submission.reply() で返してもOK
    return submission.reply({ formErrors: ['サーバーエラーが発生しました'] });
  }

  if (existing) {
    // すでに使われていたらエラーを返す
    return submission.reply({
      fieldErrors: {
        id: ['このIDは既に使われています'],
      },
    });
  }

  // ユニークID & ユーザーネームを DB に挿入
  const { error } = await supabase.from('users').update({ id, name }).match({ user_id: user.id });

  if (error) {
    return submission.reply({ formErrors: ['挿入に失敗しました'] });
  }

  // 成功時は success を返す
  return redirect('/bookshelf');
}

export async function socialSignIn(provider: Provider) {
  const getURL = (path: string) => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ??
      process?.env?.NEXT_PUBLIC_VERCEL_URL ??
      'http://localhost:3000/';
    url = url.startsWith('http') ? url : `https://${url}`;
    url = url.endsWith('/') ? url : `${url}/`;
    path = path.replace(/^\//, '');
    return path ? `${url}${path}` : url;
  };

  if (!provider) {
    return redirect('/auth');
  }
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
      redirectTo: getURL('/auth/callback'),
    },
  });
  console.log(data);
  if (error) {
    return { success: false, message: 'OAuth認証に失敗しました' };
  }
  return redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth');
}

export async function updateImg(base64Image: any) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', user?.id)
      .single();
    let avatar_url = profile?.avatar_url;

    if (base64Image) {
      const matches = base64Image.base64Image.match(/^data:(.+);base64,(.+)$/);

      if (!matches || matches.length !== 3) {
        return { error: 'Invalid image' };
      }

      const contentType = matches[1];
      const base64Data = matches[2];

      const fileExt = contentType.split('/')[1];

      const fileName = `${uuidv4()}.${fileExt}`;
      console.log('fileName:', fileName);

      const { error: storageError } = await supabase.storage
        .from('avatars')
        .upload(`${profile?.user_id}/${fileName}`, decode(base64Data), {
          contentType,
        });
      if (storageError) {
        return { error: 'Failed to upload image' };
      }
      if (avatar_url) {
        const fileName = avatar_url.split('/').slice(-1)[0];

        await supabase.storage.from('avatars').remove([`${profile?.user_id}/${fileName}`]);
      }

      const { data: urlData } = await supabase.storage
        .from('avatars')
        .getPublicUrl(`${profile?.user_id}/${fileName}`, {});

      avatar_url = urlData?.publicUrl;
      console.log('avatar_url', avatar_url);
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url })
      .match({ user_id: user?.id });

    if (updateError) {
      return { error: 'Failed to update image' };
    }
    return { message: 'Image updated successfully' };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to update image' };
  }
}
