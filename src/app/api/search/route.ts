import { NextResponse } from 'next/server';

const GOOGLE_BOOKS_API_BASE = 'https://www.googleapis.com/books/v1/volumes';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '20');
  const startIndex = (page - 1) * perPage;

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter: q' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Google Books API key is not set' }, { status: 500 });
  }

  try {
    const url = `${GOOGLE_BOOKS_API_BASE}?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${perPage}&key=${apiKey}`;
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
