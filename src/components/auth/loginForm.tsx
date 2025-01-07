'use client';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { CircleChevronRight } from 'lucide-react';
import Link from 'next/link';
import { FC, ReactEventHandler, useActionState, useEffect, useState } from 'react';

import { authConfig } from '@/config/auth';
import { loginSchema } from '@/config/schema';
import { emailLogin } from '@/hooks/useActions';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Separate } from '@/components/separate';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/passwordInput';

export const LoginForm = ({ handleNext }: { handleNext: () => void }) => {
  const [password, setPassword] = useState('');
  const [lastResult, action, isPending] = useActionState(emailLogin, undefined);
  const [form, fields] = useForm({
    // 前回の送信結果を同期
    lastResult,

    // クライアントでバリデーション・ロジックを再利用する
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema });
    },

    // blurイベント発生時にフォームを検証する
    shouldValidate: 'onInput',
  });

  useEffect(() => {
    if (lastResult?.status === 'success') {
      // サインアップに成功したので、stepを進める
      console.log('サインアップに成功しました');
      handleNext();
    }
  }, [lastResult, handleNext]);

  return (
    <>
      <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
        <CardContent className="space-y-2">
          <div id={form.errorId} className="text-xs text-red-600">
            {form.errors}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">{authConfig.login.email.label}</Label>
            <Input
              key={fields.email.key}
              name={fields.email.name}
              defaultValue={fields.email.initialValue}
              id="email"
              type="email"
              placeholder={authConfig.login.email.placeholder}
              className="focus:border-[#ffeedd] focus:ring-[#ffeedd]"
            />
            <div className="text-xs text-red-600">{fields.email.errors}</div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">{authConfig.login.password.label}</Label>
            {/* <Input
              id="password"
              type="password"
              placeholder={authConfig.login.password.placeholder}
              className="focus:border-[#ffeedd] focus:ring-[#ffeedd]"
              key={fields.password.key}
              name={fields.password.name}
              defaultValue={fields.password.initialValue}
            /> */}
            <PasswordInput
              id="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder={authConfig.login.password.placeholder}
              className="focus:border-[#ffeedd] focus:ring-[#ffeedd]"
              key={fields.password.key}
              name={fields.password.name}
              defaultValue={fields.password.initialValue}
            />
            <div className="text-xs text-red-600">{fields.password.errors}</div>
          </div>
          <div className="space-y-1">
            <Link href="/auth/forgot-password" className="text-xs text-[#bd7328] hover:underline">
              パスワードを忘れた方はこちら
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col py-0">
          <Button
            className="w-full bg-[#ffb061] text-white font-bold hover:bg-[#ffc890]"
            disabled={isPending}>
            {isPending ? 'ログイン中...' : authConfig.login.button}{' '}
            <CircleChevronRight className="ml-1 h-4 w-4" />
          </Button>
          <Separate />
        </CardFooter>
      </form>
    </>
  );
};
