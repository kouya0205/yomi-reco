'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
  query: string;
  setQuery: (val: string) => void;
  onSearch: () => void;
  isLoading: boolean;
};

export default function SearchForm({ query, setQuery, onSearch, isLoading }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-2 mb-4">
        <Input
          type="text"
          placeholder="ISBN またはキーワード"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-96"
        />
        <Button onClick={onSearch} disabled={isLoading}>
          検索
        </Button>
      </div>
    </form>
  );
}
