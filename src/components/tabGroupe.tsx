'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type Props = {
  currentTab: string;
  onTabChange: (tab: string) => void;
};

export default function TabGroup({ currentTab, onTabChange }: Props) {
  return (
    <Tabs value={currentTab} onValueChange={onTabChange}>
      <TabsList>
        <TabsTrigger value="want">読みたい</TabsTrigger>
        <TabsTrigger value="reading">読んでる</TabsTrigger>
        <TabsTrigger value="done">読んだ</TabsTrigger>
      </TabsList>
      <TabsContent value="want" />
      <TabsContent value="reading" />
      <TabsContent value="done" />
    </Tabs>
  );
}
