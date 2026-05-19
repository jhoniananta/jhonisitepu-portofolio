import { NextRequest, NextResponse } from 'next/server';

import {
  buildExcerpt,
  calculateReadingTime,
  createSlug,
  normalizeTags,
  stripHtml,
} from '@/lib/blog';
import { verifyAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

import { type BlogStatus, BLOG_STATUSES } from '@/types/blog';

function isBlogStatus(value: unknown): value is BlogStatus {
  return BLOG_STATUSES.includes(value as BlogStatus);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === 'object' &&
    error &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return 'Internal Server Error';
}

async function resolveUniqueSlug(
  title: string,
  excludeId?: string,
): Promise<string> {
  const supabase = createClient();
  const baseSlug = createSlug(title);
  let candidateSlug = baseSlug;
  let suffix = 2;
  let slugExists = true;

  while (slugExists) {
    let query = supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', candidateSlug)
      .limit(1);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    slugExists = Boolean(data && data.length > 0);

    if (slugExists) {
      candidateSlug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
  }

  return candidateSlug;
}

// GET /api/blog - Public: fetch published posts. Admin can request drafts too.
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const scope = request.nextUrl.searchParams.get('scope');

    if (scope === 'all') {
      const admin = await verifyAdmin();

      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .order('featured', { ascending: false })
      .order('published_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('GET /api/blog failed:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

// POST /api/blog - Admin only: create a post
export async function POST(request: Request) {
  try {
    const admin = await verifyAdmin();

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    const body = await request.json();

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const contentHtml =
      typeof body.content_html === 'string' ? body.content_html.trim() : '';
    const contentText = stripHtml(contentHtml);
    const excerptInput = typeof body.excerpt === 'string' ? body.excerpt : '';
    const tagsInput =
      Array.isArray(body.tags) || typeof body.tags === 'string'
        ? body.tags
        : [];
    const status = isBlogStatus(body.status) ? body.status : 'draft';

    if (!title || !contentText) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 },
      );
    }

    const slug = await resolveUniqueSlug(title);
    const excerpt = buildExcerpt(excerptInput, contentText);
    const coverImageUrl =
      typeof body.cover_image_url === 'string'
        ? body.cover_image_url.trim()
        : '';

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title,
        slug,
        excerpt,
        cover_image_url: coverImageUrl || null,
        content_html: contentHtml,
        content_text: contentText,
        tags: normalizeTags(tagsInput),
        status,
        featured: Boolean(body.featured),
        reading_time_minutes: calculateReadingTime(contentText),
        published_at: status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('POST /api/blog failed:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
