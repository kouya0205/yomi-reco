// src/app/bookshelf/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Input } from 'postcss';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';
import { Book, BookStatus } from 'types/types';
import { sampleBooks } from '@/lib/data/sampleBooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const statusOptions: BookStatus[] = [BookStatus.WantToRead, BookStatus.Reading, BookStatus.Read];

const BookshelfPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [shareURL, setShareURL] = useState('');

  // Load books from localStorage on mount
  useEffect(() => {
    localStorage.setItem('bookshelf', JSON.stringify(sampleBooks));
    setBooks(sampleBooks);
  }, []);

  // 本の状態が変わったらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('bookshelf', JSON.stringify(books));
  }, [books]);

  const openAddModal = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingBook(null);
    setIsModalOpen(false);
  };

  const handleSave = (book: Book) => {
    if (editingBook) {
      // Edit existing book
      setBooks(books.map((b) => (b.id === book.id ? book : b)));
    } else {
      // Add new book
      setBooks([...books, { ...book, id: uuidv4() }]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('本を削除してもよろしいですか？')) {
      setBooks(books.filter((book) => book.id !== id));
    }
  };

  const handleStatusChange = (id: string, status: Book['status']) => {
    setBooks(books.map((book) => (book.id === id ? { ...book, status: status } : book)));
  };

  const generateShareURL = () => {
    const currentURL = window.location.href.split('?')[0];
    const encodedBooks = encodeURIComponent(JSON.stringify(books));
    const newURL = `${currentURL}?data=${encodedBooks}`;
    setShareURL(newURL);
  };

  // Load shared data if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      try {
        const parsedBooks: Book[] = JSON.parse(decodeURIComponent(data));
        setBooks(parsedBooks);
      } catch (error) {
        console.error('共有URLのデータの解析に失敗しました。');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <div className="max-w-4xl mx-auto">
        {books.length === 0 ? (
          <p className="text-gray-500">本がありません。追加してください。</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {books.map((book) => (
              <Card key={book.id} className="shadow-md rounded-xl pt-6 bg-orange-100">
                <CardContent className="flex flex-row gap-4">
                  <div className="">
                    {book.coverImage && (
                      <Image
                        src={book.coverImage}
                        alt={`${book.title}`}
                        width={64 * 1.8}
                        height={96 * 1.8}
                        className="object-cover rounded-2xl"
                      />
                    )}
                  </div>
                  <div className="flex flex-col m-4 gap-2">
                    <div className="font-bold text-xl">{book.title}</div>
                    <div className="font-thin text-sm overflow-hidden text-gray-400">
                      {book.author}
                    </div>
                    <div className="flex flex-row gap-4">
                      <div className="w-12 h-12 bg-red-300"></div>
                      <div className="w-12 h-12 bg-blue-300"></div>
                      <div className="w-12 h-12 bg-green-300"></div>
                    </div>
                    {/* <div className="flex flex-row">{book.status}</div> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {/* {isModalOpen && <BookModal book={editingBook} onClose={closeModal} onSave={handleSave} />} */}
      </div>
    </div>
  );
};

type BookModalProps = {
  book: Book | null;
  onClose: () => void;
  onSave: (book: Book) => void;
};

const BookModal: React.FC<BookModalProps> = ({ book, onClose, onSave }) => {
  const [title, setTitle] = useState(book ? book.title : '');
  const [author, setAuthor] = useState(book ? book.author : '');
  const [status, setStatus] = useState<BookStatus>(book?.status ?? BookStatus.Reading);

  const handleSubmit = () => {
    if (title.trim() === '' || author.trim() === '') {
      alert('タイトルと著者を入力してください。');
      return;
    }

    const newBook: Book = {
      id: book ? book.id : uuidv4(),
      title,
      author,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
      isbn: '',
    };

    onSave(newBook);
  };

  return (
    <Dialog>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">{book ? '本を編集' : '本を追加'}</h2>
        <div className="mb-4">
          <label className="block mb-1">タイトル</label>
          {/* <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="本のタイトル"
          /> */}
        </div>
        <div className="mb-4">
          <label className="block mb-1">著者</label>
          {/* <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="著者名" /> */}
        </div>
        <div className="mb-4">
          <label className="block mb-1">ステータス</label>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as unknown as Book['status'])}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={status} />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((statusOption) => (
                <SelectItem key={statusOption} value={statusOption}>
                  {statusOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose} className="mr-2">
            キャンセル
          </Button>
          <Button onClick={handleSubmit}>{book ? '保存' : '追加'}</Button>
        </div>
      </div>
    </Dialog>
  );
};

export default BookshelfPage;
