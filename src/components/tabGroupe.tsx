'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Bookmark, BookmarkCheck, BookOpen } from 'lucide-react';

type Props = {
  currentTab: string;
  onTabChange: (tab: string) => void;
};

export default function TabGroup({ currentTab, onTabChange }: Props) {
  return (
    <Tabs value={currentTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="flex w-full rounded-full">
        <TabsTrigger value="want" className="flex-1 text-center rounded-full">
          <div className="flex gap-2 items-center">
            <div>読みたい</div>
            <Bookmark />
          </div>
        </TabsTrigger>
        <TabsTrigger value="reading" className="flex-1 text-center rounded-full">
          <div className="flex gap-2 items-center">
            <div>読んでる</div>
            <BookOpen />
          </div>
        </TabsTrigger>
        <TabsTrigger value="done" className="flex-1 text-center rounded-full">
          <div className="flex gap-2 items-center">
            <div>読んだ</div>
            <BookmarkCheck />
          </div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="want" />
      <TabsContent value="reading" />
      <TabsContent value="done" />
    </Tabs>
  );
}
