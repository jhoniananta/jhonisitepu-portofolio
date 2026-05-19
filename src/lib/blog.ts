import type { BlogPost } from '@/types/blog';

export function createSlug(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/['’]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-') || 'untitled-post'
  );
}

export function stripHtml(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeTags(tags: string[] | string | null | undefined) {
  const list = Array.isArray(tags) ? tags : (tags ?? '').split(',');

  return Array.from(
    new Set(
      list
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 8),
    ),
  );
}

export function buildExcerpt(
  excerpt: string | null | undefined,
  fallbackText: string,
  maxLength = 180,
) {
  const baseText = (excerpt ?? '').trim() || fallbackText.trim();

  if (!baseText) {
    return 'Fresh notes from the build process.';
  }

  if (baseText.length <= maxLength) {
    return baseText;
  }

  return `${baseText.slice(0, maxLength).trimEnd()}...`;
}

export function calculateReadingTime(text: string) {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function getBlogPublishDate(
  post: Pick<BlogPost, 'published_at' | 'created_at'>,
) {
  return post.published_at ?? post.created_at;
}

export function formatBlogDate(value: string | null | undefined) {
  if (!value) {
    return 'Draft';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}
