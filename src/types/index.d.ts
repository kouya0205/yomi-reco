export type SiteConfig = {
  title: string;
  description: string;
  url: string;
  header: {
    title: string;
    logo: string;
    icons: { src: string; alt: string }[];
  };
  auth: {
    title: string;
    description: string;
    url: string;
  };
};

export type AuthConfig = {
  tab: {
    login: string;
    signup: string;
  };
  login: {
    title: string;
    description: string;
    button: string;
    email: {
      label: string;
      placeholder: string;
    };
    password: {
      label: string;
      placeholder: string;
    };
  };
  signup: {
    title: string;
    description: string;
    button: string;
    email: {
      label: string;
      placeholder: string;
    };
    username: {
      label: string;
      placeholder: string;
    };
    password: {
      label: string;
      placeholder: string;
    };
    confirmPassword: {
      label: string;
      placeholder: string;
    };
  };
};

export type User = {
  id: string;
  name: string;
  email?: string | null; // email, password_hashはAuth管理方式により省略可
  password_hash?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
};

export type Book = {
  id: string;
  isbn?: string | null;
  title: string;
  author?: string | null;
  cover_url?: string | null;
  created_at: string;
  updated_at: string;
};

// types/db.ts
export type RecommendRow = {
  id: string;
  book_id: string;
  recommended_by: string;
  comment?: string | null;
  category?: string | null;
  created_at: string;
  updated_at: string;

  // Supabaseがuser, bookを配列で返す想定
  user?: {
    id: string;
    name: string;
    avatar_url?: string | null;
  }[];
  book?: {
    id: string;
    title: string;
    author?: string | null;
    cover_url?: string | null;
  }[];
};
