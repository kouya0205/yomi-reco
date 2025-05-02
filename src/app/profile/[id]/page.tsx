import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata, ResolvingMetadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { FollowButton } from '@/components/profile/followButton';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const supabase = await createClient();
  const id = params.id;

  const { data: user } = await supabase.from('users').select('name').eq('id', id).single();

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: user ? `${user.name}のプロフィール` : 'プロフィール',
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const supabase = await createClient();
  const targetUserId = params.id;

  const { data: profileUser, error: profileUserError } = await supabase
    .from('users')
    .select('user_id, id, name, email, avatar_url, bio')
    .eq('id', targetUserId)
    .single();

  if (profileUserError || !profileUser) {
    notFound();
  }

  const {
    data: { user: loggedInUser },
  } = await supabase.auth.getUser();

  let isFollowing = false;
  let isOwnProfile = false;

  if (loggedInUser) {
    isOwnProfile = loggedInUser.id === profileUser.user_id;

    if (!isOwnProfile) {
      const { data: followStatus, error: followCheckError } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', loggedInUser.id)
        .eq('following_id', profileUser.user_id)
        .maybeSingle();

      if (followCheckError) {
        console.error('Error checking follow status:', followCheckError);
      } else {
        isFollowing = !!followStatus;
      }
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={profileUser.avatar_url ?? undefined}
              alt={profileUser.name ?? 'User Avatar'}
            />
            <AvatarFallback>{profileUser.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl">{profileUser.name}</CardTitle>
            <p className="text-sm text-muted-foreground">@{profileUser.id}</p>
          </div>
          {loggedInUser && (
            <FollowButton
              targetUserId={profileUser.id}
              initialIsFollowing={isFollowing}
              isOwnProfile={isOwnProfile}
            />
          )}
        </CardHeader>
        <CardContent>
          {profileUser.bio ? (
            <p>{profileUser.bio}</p>
          ) : (
            <p className="text-muted-foreground">自己紹介はありません。</p>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">本棚</h2>
        <p className="text-muted-foreground">（ここに本棚が表示されます）</p>
      </div>
    </div>
  );
}
