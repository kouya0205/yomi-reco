import { useEffect, useState } from 'react';

/**
 * @param query 例: '(min-width: 768px)'
 * @returns `true` / `false`
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // クライアント側でのみ実行する
    if (typeof window !== 'undefined') {
      const mediaQueryList = window.matchMedia(query);

      // 初期値の設定
      setMatches(mediaQueryList.matches);

      // 変更を検知して state を更新するイベントリスナー
      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      mediaQueryList.addEventListener('change', listener);

      // クリーンアップ
      return () => {
        mediaQueryList.removeEventListener('change', listener);
      };
    }
  }, [query]);

  return matches;
}
