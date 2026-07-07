export type AppRole = "admin" | "user";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  category?: Category | null;
  description: string;
  image_url: string | null;
  price: number;
  discounted_price: number | null;
  is_premium: boolean;
  is_vip: boolean;
  rating: number;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

/**
 * Minimal Database type for the Supabase client generic. Replace with the
 * output of `supabase gen types typescript` once the project is linked for
 * fully typed queries.
 */
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      user_roles: {
        Row: { user_id: string; role: AppRole };
        Insert: { user_id: string; role: AppRole };
        Update: { user_id?: string; role?: AppRole };
      };
      categories: { Row: Category; Insert: Partial<Category>; Update: Partial<Category> };
      courses: { Row: Course; Insert: Partial<Course>; Update: Partial<Course> };
      contact_messages: {
        Row: ContactMessage;
        Insert: Partial<ContactMessage>;
        Update: Partial<ContactMessage>;
      };
    };
  };
}
