import { Loader2Icon } from 'lucide-react';

export default function BookShelfLoading() {
  return (
    <div className="w-full space-y-4">
      {/* タブのスケルトン */}
      <div className="flex gap-2 border-b pb-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>

      {/* 検索バーのスケルトン */}
      <div className="w-full h-10 bg-gray-200 animate-pulse rounded my-4" />

      {/* 数字表示のスケルトン */}
      <div className="h-5 w-16 bg-gray-200 animate-pulse rounded" />

      {/* 本のカードスケルトン */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="border rounded-md p-4 h-32 flex gap-4 animate-pulse">
            {/* 本の表紙スケルトン */}
            <div className="w-20 h-full bg-gray-300 rounded" />

            {/* 本の情報スケルトン */}
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>

      {/* ローディング表示 */}
      <div className="flex justify-center mt-4">
        <Loader2Icon size={32} className="animate-spin text-primary" />
      </div>
    </div>
  );
}
