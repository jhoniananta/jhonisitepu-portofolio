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

// PUT /api/blog/[id] - Admin only: update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const admin = await verifyAdmin();

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    const { data: existingPost, error: existingError } = await supabase
      .from('blog_posts')
      .select('id, published_at')
      .eq('id', params.id)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        { error: existingError.message },
        { status: 500 },
      );
    }

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

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

    const slug = await resolveUniqueSlug(title, params.id);
    const excerpt = buildExcerpt(excerptInput, contentText);
    const coverImageUrl =
      typeof body.cover_image_url === 'string'
        ? body.cover_image_url.trim()
        : '';

    const { data, error } = await supabase
      .from('blog_posts')
      .update({
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
        published_at:
          status === 'published'
            ? (existingPost.published_at ?? new Date().toISOString())
            : null,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`PUT /api/blog/${params.id} failed:`, error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

// DELETE /api/blog/[id] - Admin only: delete a post
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const admin = await verifyAdmin();

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`DELETE /api/blog/${params.id} failed:`, error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
