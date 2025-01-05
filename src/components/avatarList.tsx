import { ScrollBar } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Link } from 'lucide-react';
import { User } from 'types';

interface AvatarListProps {
  users: User[];
}

export const AvatarList: React.FC<AvatarListProps> = ({ users }: AvatarListProps) => {
  return (
    // アバターリスト
    <div className="w-full flex flex-row gap-2 m-4">
      <ScrollArea className="w-full rounded-md overflow-x-auto">
        <div className="flex gap-4 p-4">
          {users.map((user, index) => (
            <div>
              <Link href={`/bookshelf/${user.id}`} key={index}>
                <div className="flex flex-col items-center space-y-2 cursor-pointer">
                  <Avatar className="w-20 h-20 ring-2 ring-offset-2 ring-blue-500 hover:ring-offset-blue-300 transition-all">
                    <AvatarImage src={user.avatar_url || ''} />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </Link>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
