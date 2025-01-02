// pages/api/searchBooks.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const GOOGLE_BOOKS_API_BASE = 'https://www.googleapis.com/books/v1/volumes';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { q } = req.query;
    // ISBN でもキーワードでも q というパラメータにまとめている想定

    if (!q) {
      return res.status(400).json({ error: 'Missing query parameter: q' });
    }

    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Google Books API key is not set' });
    }

    // Google Books API にリクエスト
    // ISBN の場合は "isbn:" プレフィックスをつけるルールなどもあるので、
    // フロント側でつけるか、こちらでつけるかはお好みで。
    // たとえば ISBN の場合は "isbn:978..." のように検索します。
    const url = `${GOOGLE_BOOKS_API_BASE}?q=${encodeURIComponent(q as string)}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
}
