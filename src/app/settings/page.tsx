'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { signOut } from '@/hooks/useActions';
import { createClient } from '@/utils/supabase/client';
import { Link2, Link2Icon, LinkIcon, SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Settings() {
  const [userId, setUserID] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserID(user.id);
    };
    fetchUser();
  }, []);
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">yomireco</h1>
        <p className="text-sm text-gray-500">ver.alpha</p>
      </div>

      {/* Account Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>アカウント</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">ユーザーID</p>
            <p className="text-sm text-gray-500">サポート時などに使用します</p>
            <p className="mt-1 text-sm">{userId}</p>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium">ログアウト</p>
            <p className="text-sm text-gray-500">
              このデバイスからログアウトして、トップページに戻ります
            </p>
            <form action={signOut}>
              <Button type="submit" variant="outline" className="mt-2">
                ログアウト
              </Button>
            </form>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium">退会</p>
            <p className="text-sm text-gray-500">アカウントを削除して退会します</p>
            <Button variant="destructive" className="mt-2">
              アカウントを削除
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card>
        <CardHeader>
          <CardTitle>サポート</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">お問い合わせ</p>
            <p className="text-sm text-gray-500">サービスのバグや報告 / お問い合わせはこちら</p>
            <Link href={'/'}>
              <Button type="submit" variant="outline" className="mt-2">
                <div className="flex flex-row items-center gap-2">
                  <div>お問い合わせ</div>
                  <SquareArrowOutUpRight />
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>プライバシーポリシー</p>
        <p>© 2025 yomireco</p>
      </div>
    </div>
  );
}
