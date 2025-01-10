'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authConfig } from '@/config/auth';
import { userIdSchema } from '@/config/schema';
import { userId } from '@/hooks/useActions';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { CircleChevronRight } from 'lucide-react';
import { useActionState, useCallback, useEffect, useState } from 'react';
import debounce from 'debounce';

export default function UserIdForm({ Id }: { Id: string | null }) {
  const [lastResult, action, isPending] = useActionState(userId, undefined);
  const [form, fields] = useForm({
    // 前回の送信結果を同期
    lastResult,

    // クライアントでバリデーション・ロジックを再利用する
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: userIdSchema });
    },

    // blurイベント発生時にフォームを検証する
    shouldValidate: 'onInput',
  });

  const [uniqueIdInput, setUniqueIdInput] = useState(fields.id.initialValue ?? '');
  const [isTaken, setIsTaken] = useState<boolean | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

  // デバウンス付きのチェック関数
  const checkUniqueId = useCallback(
    debounce(async (value: string) => {
      if (!value) {
        setIsTaken(null);
        return;
      }
      try {
        const res = await fetch('/api/checkUserId', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: value, oldId: Id }),
        });
        const { isTaken, error } = await res.json();
        if (error) {
          setCheckError(error);
          setIsTaken(null);
          return;
        }
        setIsTaken(isTaken);
        setCheckError(null);
      } catch (err: any) {
        setCheckError(err.message);
        setIsTaken(null);
      }
    }, 300), // 0.3秒待ってからリクエスト
    [],
  );

  // 入力が変わるたびにデバウンス付き関数を呼び出す
  useEffect(() => {
    checkUniqueId(uniqueIdInput);
  }, [uniqueIdInput, checkUniqueId]);

  const onChangeIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUniqueIdInput(value);
    // Conform 用にも値を同期したいならfields.idを使う
  };

  return (
    <>
      <Card className="min-w-[400px]">
        <CardHeader>
          <h2 className="text-xl font-bold">{authConfig.userId.title}</h2>
        </CardHeader>
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
          <CardContent className="space-y-2">
            <div id={form.errorId} className="text-xs text-red-600">
              {form.errors}
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">{authConfig.userId.username.label}</Label>
              <Input
                id="username"
                type="username"
                placeholder={authConfig.userId.username.placeholder}
                className="focus:border-[#ffeedd] focus:ring-[#ffeedd]"
                key={fields.username.key}
                name={fields.username.name}
                defaultValue={fields.username.initialValue}
              />
              <div className="text-xs text-red-600">{fields.username.errors}</div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="id">{authConfig.userId.id.label}</Label>
              <Input
                id="id"
                type="text"
                placeholder={authConfig.userId.id.placeholder}
                className="focus:border-[#ffeedd] focus:ring-[#ffeedd]"
                key={fields.id.key}
                name={fields.id.name} // ← Conform 用に必要
                defaultValue={fields.id.initialValue}
                value={uniqueIdInput}
                onChange={onChangeIdInput}
              />
              <div className="text-xs text-red-600">{fields.id.errors}</div>

              {checkError && <p className="text-xs text-red-600">{checkError}</p>}

              {isTaken === false && <p className="text-xs text-green-600">このIDは使用できます</p>}
              {isTaken === true && (
                <p className="text-xs text-red-600">このIDは既に使われています</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              className="w-full bg-[#ffb061] text-white font-bold hover:bg-[#ffc890]"
              disabled={isPending}>
              {isPending ? '設定中...' : authConfig.userId.button}{' '}
              <CircleChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
