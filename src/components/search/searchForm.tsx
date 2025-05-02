'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

type Props = {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
};

export default function SearchForm({ query, setQuery, onSearch, isLoading }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="書籍名、著者名、ISBNなどで検索"
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? '検索中...' : '検索'}
      </Button>
    </form>
  );
}
