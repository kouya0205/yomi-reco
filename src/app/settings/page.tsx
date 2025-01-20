import EditProfile from '@/components/profile/editProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { signOut } from '@/hooks/useActions';
import { createClient } from '@/utils/supabase/server';
import { SquareArrowOutUpRight } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: '設定',
  description: 'アカウントの設定やサポートについて',
};

export default async function Settings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', user?.id)
    .single();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">yomireco</h1>
        <p className="text-sm text-gray-500">ver.alpha</p>
      </div>

      {/* Account Section */}
      <Suspense fallback={<div>Loading...</div>}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>@{userData.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <div className="flex flex-row items-center gap-2">
                <Image
                  src={userData.avatar_url}
                  alt="avatar"
                  width={44}
                  height={44}
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <p>{userData.name}</p>
                  <p className="text-sm text-gray-500">{userData.email}</p>
                </div>
              </div>
              <EditProfile userData={userData} />
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium">ユーザーID</p>
              <p className="text-sm text-gray-500">サポート時などに使用します</p>
              <p className="mt-1 text-sm">{userData.user_id}</p>
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
      </Suspense>

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
