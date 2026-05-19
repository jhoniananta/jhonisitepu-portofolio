export const BLOG_STATUSES = ['draft', 'published'] as const;

export type BlogStatus = (typeof BLOG_STATUSES)[number];

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  content_html: string;
  content_text: string;
  tags: string[];
  status: BlogStatus;
  featured: boolean;
  reading_time_minutes: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
