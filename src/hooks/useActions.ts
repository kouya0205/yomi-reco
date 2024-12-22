'use server';

import { parseWithZod } from '@conform-to/zod';
import { Provider } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

import { supabaseErrorMessages } from '@/config/errorMessage';
import { loginSchema, signupSchema } from '@/config/schema';

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

  redirect('/');
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
        name: name,
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

  redirect('/');
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
  if (error) {
    return { success: false, message: 'OAuth認証に失敗しました' };
  }
  return redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
