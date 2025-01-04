'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type Props = {
  currentTab: string;
  onTabChange: (tab: string) => void;
};

export default function TabGroup({ currentTab, onTabChange }: Props) {
  return (
    <Tabs value={currentTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="flex w-full rounded-full">
        <TabsTrigger value="want" className="flex-1 text-center rounded-full">
          読みたい
        </TabsTrigger>
        <TabsTrigger value="reading" className="flex-1 text-center rounded-full">
          読んでる
        </TabsTrigger>
        <TabsTrigger value="done" className="flex-1 text-center rounded-full">
          読んだ
        </TabsTrigger>
      </TabsList>
      <TabsContent value="want" />
      <TabsContent value="reading" />
      <TabsContent value="done" />
    </Tabs>
  );
}
