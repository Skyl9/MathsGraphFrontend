export interface User {
  id: number;
  username: string;
  email: string;
  role: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  preferred_language: string | null;
  avatar_url: string | null;
  bio: string | null;
}
export interface Favorite {
  id: number;
  nom: string;
  category: string;
  notify_on_change: boolean;
}
