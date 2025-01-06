import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { CircleChevronRight } from 'lucide-react';
import Link from 'next/link';
import { FC, useActionState, useEffect } from 'react';

import { authConfig } from '@/config/auth';
import { signupSchema } from '@/config/schema';
import { signup } from '@/hooks/useActions';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separate } from '@/components/separate';

export const SignupForm = ({ handleNext }: { handleNext: () => void }) => {
  const [lastResult, action, isPending] = useActionState(signup, undefined);
  const [form, fields] = useForm({
    // 前回の送信結果を同期
    lastResult,

    // クライアントでバリデーション・ロジックを再利用する
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signupSchema });
    },

    // blurイベント発生時にフォームを検証する
    shouldValidate: 'onBlur',
  });

  // ★↓↓ サインアップ成功時にステップを進めたい場合はここで判定
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
            <Label htmlFor="email">{authConfig.signup.email.label}</Label>
            <Input
              id="email"
              type="email"
              placeholder={authConfig.signup.email.placeholder}
              className="focus:border-[#ffeedd] focus:ring-[#ffeedd]"
              key={fields.email.key}
              name={fields.email.name}
              defaultValue={fields.email.initialValue}
            />
            <div className="text-xs text-red-600">{fields.email.errors}</div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">{authConfig.signup.password.label}</Label>
            <Input
              id="password"
              type="password"
              placeholder={authConfig.signup.password.placeholder}
              className="focus:border-[#ffeedd] focus:ring-[#ffeedd]"
              key={fields.password.key}
              name={fields.password.name}
              defaultValue={fields.password.initialValue}
            />
            <div className="text-xs text-red-600">{fields.password.errors}</div>
          </div>
          {/* checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              className="focus:border-[#349BD1] focus:ring-[#349BD1]"
              key={fields.acceptCheckbox.key}
              name={fields.acceptCheckbox.name}
              defaultChecked={fields.acceptCheckbox.initialValue === 'on'}
            />
            <Label htmlFor="terms" className="font-thin">
              <Link
                href="https://dot-scallop-d45.notion.site/5103947e446548ca8a9d7191fa512be7"
                target="_blank"
                className="text-[#bd7328] hover:underline">
                利用規約
              </Link>
              に同意します。
            </Label>
          </div>
          <div className="text-xs text-red-600">{fields.acceptCheckbox.errors}</div>
        </CardContent>
        <CardFooter className="flex flex-col py-0">
          <Button
            className="w-full bg-[#ffb061] text-white font-bold hover:bg-[#ffc890]"
            disabled={isPending}>
            {isPending ? 'ログイン中...' : authConfig.signup.button}{' '}
            <CircleChevronRight className="ml-1 h-4 w-4" />
          </Button>
          <Separate />
        </CardFooter>
      </form>
    </>
  );
};
