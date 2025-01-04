// // pages/api/searchBooks/route.ts
// import type { NextApiRequest, NextApiResponse } from 'next';

// const GOOGLE_BOOKS_API_BASE = 'https://www.googleapis.com/books/v1/volumes';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'GET') {
//     res.setHeader('Allow', ['GET']);
//     return res.status(405).end(`MethodA ${req.method} Not Allowed`);
//   }
//   try {
//     const { q } = req.query;
//     // ISBN でもキーワードでも q というパラメータにまとめている想定

//     if (!q || typeof q !== 'string') {
//       return res.status(400).json({ error: 'Missing or invalid query parameter: q' });
//     }

//     const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
//     if (!apiKey) {
//       return res.status(500).json({ error: 'Google Books API key is not set' });
//     }

//     // Google Books API にリクエスト
//     // ISBN の場合は "isbn:" プレフィックスをつけるルールなどもあるので、
//     // フロント側でつけるか、こちらでつけるかはお好みで。
//     // たとえば ISBN の場合は "isbn:978..." のように検索します。
//     const url = `${GOOGLE_BOOKS_API_BASE}?q=${encodeURIComponent(q as string)}&key=${apiKey}`;
//     const response = await fetch(url);

//     if (!response.ok) {
//       const errorResponse = await response.json();
//       return res.status(response.status).json({ error: errorResponse.error || 'Google API Error' });
//     }

//     const data = await response.json();

//     res.status(200).json(data);
//   } catch (err: any) {
//     console.error(err);
//     res.status(500).json({ error: 'Server Error' });
//   }
// }

import { NextResponse } from 'next/server';

const GOOGLE_BOOKS_API_BASE = 'https://www.googleapis.com/books/v1/volumes';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter: q' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Google Books API key is not set' }, { status: 500 });
  }

  try {
    const url = `${GOOGLE_BOOKS_API_BASE}?q=${encodeURIComponent(query)}&key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Google Books API request failed' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Google Books API:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
