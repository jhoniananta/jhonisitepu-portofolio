'use client';

import {
  Eye,
  FileText,
  PencilLine,
  Plus,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { calculateReadingTime, createSlug, formatBlogDate } from '@/lib/blog';
import { createClient } from '@/lib/supabase/client';

import BlogEditor from '@/components/blog/BlogEditor';

import type { BlogPost, BlogStatus } from '@/types/blog';

type BlogFormState = {
  title: string;
  excerpt: string;
  cover_image_url: string;
  content_html: string;
  content_text: string;
  tags: string;
  status: BlogStatus;
  featured: boolean;
};

const createEmptyForm = (): BlogFormState => ({
  title: '',
  excerpt: '',
  cover_image_url: '',
  content_html: '',
  content_text: '',
  tags: '',
  status: 'draft',
  featured: false,
});

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editorInstanceKey, setEditorInstanceKey] = useState(0);
  const [form, setForm] = useState<BlogFormState>(createEmptyForm());

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog?scope=all');
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to fetch blog posts');
        setPosts([]);
        return;
      }

      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch blog posts:', error);
      toast.error('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openComposer = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setForm({
        title: post.title,
        excerpt: post.excerpt,
        cover_image_url: post.cover_image_url ?? '',
        content_html: post.content_html,
        content_text: post.content_text,
        tags: post.tags.join(', '),
        status: post.status,
        featured: post.featured,
      });
    } else {
      setEditingPost(null);
      setForm(createEmptyForm());
    }

    setEditorInstanceKey((current) => current + 1);
    setShowForm(true);
  };

  const closeComposer = () => {
    setShowForm(false);
    setEditingPost(null);
    setForm(createEmptyForm());
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploadingImage(true);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath);

      setForm((current) => ({
        ...current,
        cover_image_url: data.publicUrl,
      }));

      toast.success('Cover image uploaded');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to upload cover image:', error);
      toast.error('Failed to upload cover image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim() || !form.content_text.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title,
        excerpt: form.excerpt,
        cover_image_url: form.cover_image_url,
        content_html: form.content_html,
        tags: form.tags,
        status: form.status,
        featured: form.featured,
      };

      const url = editingPost ? `/api/blog/${editingPost.id}` : '/api/blog';
      const method = editingPost ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Failed to save post');
        return;
      }

      toast.success(
        editingPost ? 'Post updated successfully' : 'Post created successfully',
      );
      closeComposer();
      fetchPosts();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save blog post:', error);
      toast.error('Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Delete this post permanently?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete post');
        return;
      }

      toast.success('Post deleted');
      fetchPosts();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete blog post:', error);
      toast.error('Failed to delete post');
    }
  };

  const liveSlug = form.title.trim()
    ? createSlug(form.title)
    : 'your-post-slug';
  const wordCount = form.content_text.split(/\s+/).filter(Boolean).length;
  const readingTime = calculateReadingTime(form.content_text);

  const stats = useMemo(
    () => ({
      total: posts.length,
      published: posts.filter((post) => post.status === 'published').length,
      drafts: posts.filter((post) => post.status === 'draft').length,
      featured: posts.filter((post) => post.featured).length,
    }),
    [posts],
  );

  return (
    <div className='space-y-8'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-white'>Blog</h1>
          <p className='mt-1 text-gray-400'>
            Publish long-form writing from the same admin surface as the rest of
            your portfolio.
          </p>
        </div>

        <button
          type='button'
          onClick={() => openComposer()}
          className='inline-flex items-center justify-center gap-2 rounded bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-gray-200'
        >
          <Plus className='h-4 w-4' />
          New Post
        </button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <div className='rounded border border-white/20 bg-black p-5'>
          <p className='text-sm text-gray-400'>All posts</p>
          <p className='mt-2 text-4xl font-bold text-white'>{stats.total}</p>
        </div>
        <div className='rounded border border-white/20 bg-black p-5'>
          <p className='text-sm text-gray-400'>Published</p>
          <p className='mt-2 text-4xl font-bold text-white'>
            {stats.published}
          </p>
        </div>
        <div className='rounded border border-white/20 bg-black p-5'>
          <p className='text-sm text-gray-400'>Drafts</p>
          <p className='mt-2 text-4xl font-bold text-white'>{stats.drafts}</p>
        </div>
        <div className='rounded border border-white/20 bg-black p-5'>
          <p className='text-sm text-gray-400'>Featured</p>
          <p className='mt-2 text-4xl font-bold text-white'>{stats.featured}</p>
        </div>
      </div>

      <div className='rounded border border-white/20 bg-black'>
        {loading ? (
          <div className='p-8 text-center'>
            <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-white' />
            <p className='mt-3 text-sm text-gray-400'>Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className='p-12 text-center'>
            <p className='text-gray-400'>
              No posts yet. Create the first article to open the blog section.
            </p>
          </div>
        ) : (
          <div className='divide-y divide-white/10'>
            {posts.map((post) => (
              <article
                key={post.id}
                className='grid gap-5 p-5 transition-colors hover:bg-white/[0.03] lg:grid-cols-[120px_minmax(0,1fr)_auto]'
              >
                <div className='relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5'>
                  {post.cover_image_url ? (
                    <Image
                      src={post.cover_image_url}
                      alt={post.title}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_44%)]' />
                  )}
                </div>

                <div className='min-w-0'>
                  <div className='flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500'>
                    <span
                      className={`rounded-full px-2.5 py-1 tracking-[0.16em] ${
                        post.status === 'published'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {post.status}
                    </span>
                    {post.featured && (
                      <span className='rounded-full bg-sky-500/15 px-2.5 py-1 text-sky-300'>
                        Featured
                      </span>
                    )}
                    <span>
                      {formatBlogDate(post.published_at ?? post.updated_at)}
                    </span>
                    <span className='h-1 w-1 rounded-full bg-white/20' />
                    <span>{post.reading_time_minutes} min read</span>
                  </div>

                  <h2 className='mt-3 line-clamp-2 text-xl font-semibold text-white'>
                    {post.title}
                  </h2>
                  <p className='mt-2 line-clamp-2 text-sm leading-7 text-gray-400'>
                    {post.excerpt}
                  </p>

                  {post.tags.length > 0 && (
                    <div className='mt-4 flex flex-wrap gap-2'>
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className='flex flex-row items-start justify-end gap-2 lg:flex-col'>
                  {post.status === 'published' && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target='_blank'
                      className='inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-white/20 hover:text-white'
                    >
                      <Eye className='h-4 w-4' />
                      View
                    </Link>
                  )}
                  <button
                    type='button'
                    onClick={() => openComposer(post)}
                    className='inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-white/20 hover:text-white'
                  >
                    <PencilLine className='h-4 w-4' />
                    Edit
                  </button>
                  <button
                    type='button'
                    onClick={() => handleDelete(post.id)}
                    className='inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-300 transition-colors hover:bg-red-500/10'
                  >
                    <Trash2 className='h-4 w-4' />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className='fixed inset-0 z-50 bg-black/80 p-4 backdrop-blur-sm'>
          <div className='mx-auto flex h-full max-h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-[32px] border border-white/15 bg-black'>
            <div className='flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 lg:px-8'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.32em] text-sky-300'>
                  Writing Studio
                </p>
                <h2 className='mt-2 text-2xl font-semibold text-white'>
                  {editingPost ? 'Edit post' : 'Compose new post'}
                </h2>
                <p className='mt-1 text-sm text-gray-400'>
                  A focused editor for publishing articles directly from your
                  portfolio admin.
                </p>
              </div>

              <button
                type='button'
                onClick={closeComposer}
                className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-300 transition-colors hover:border-white/20 hover:text-white'
              >
                <X className='h-4 w-4' />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className='flex min-h-0 flex-1 flex-col'
            >
              <div className='min-h-0 flex-1 overflow-y-auto px-6 py-6 lg:px-8'>
                <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]'>
                  <div className='space-y-6'>
                    <div className='rounded-[28px] border border-white/10 bg-white/[0.03] p-6'>
                      <label className='block text-sm font-medium text-gray-300'>
                        Title
                      </label>
                      <input
                        type='text'
                        required
                        value={form.title}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        className='mt-3 w-full border-0 bg-transparent p-0 text-3xl font-semibold text-white placeholder:text-white/25 focus:outline-none focus:ring-0'
                        placeholder='A post worth clicking on starts here'
                      />
                      <p className='mt-4 text-xs uppercase tracking-[0.22em] text-gray-500'>
                        /blog/{liveSlug}
                      </p>
                    </div>

                    <div className='rounded-[28px] border border-white/10 bg-white/[0.03] p-6'>
                      <label className='block text-sm font-medium text-gray-300'>
                        Excerpt
                      </label>
                      <textarea
                        rows={4}
                        value={form.excerpt}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            excerpt: event.target.value,
                          }))
                        }
                        className='mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-7 text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/20'
                        placeholder='Give readers a sharp reason to open the article.'
                      />
                    </div>

                    <div className='rounded-[28px] border border-white/10 bg-white/[0.03] p-6'>
                      <div className='mb-4 flex items-center justify-between gap-3'>
                        <div>
                          <label className='block text-sm font-medium text-gray-300'>
                            Article body
                          </label>
                          <p className='mt-1 text-sm text-gray-500'>
                            Use the toolbar for structure, emphasis, links, and
                            lists.
                          </p>
                        </div>
                        <div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-gray-400'>
                          <Sparkles className='h-3.5 w-3.5 text-sky-300' />
                          Medium-style editing flow
                        </div>
                      </div>

                      <BlogEditor
                        key={editorInstanceKey}
                        value={form.content_html}
                        disabled={saving}
                        onChange={({ html, text }) =>
                          setForm((current) => ({
                            ...current,
                            content_html: html,
                            content_text: text,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <aside className='space-y-4'>
                    <div className='rounded-[28px] border border-white/10 bg-white/[0.03] p-5'>
                      <p className='text-sm font-medium text-gray-300'>
                        Status
                      </p>
                      <div className='mt-4 grid grid-cols-2 gap-2'>
                        {(['draft', 'published'] as const).map((status) => (
                          <button
                            key={status}
                            type='button'
                            onClick={() =>
                              setForm((current) => ({
                                ...current,
                                status,
                              }))
                            }
                            className={`rounded-2xl border px-4 py-3 text-sm font-medium capitalize transition-colors ${
                              form.status === status
                                ? 'border-sky-400 bg-sky-500/15 text-sky-200'
                                : 'border-white/10 text-gray-300 hover:border-white/20 hover:text-white'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>

                      <label className='mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-300'>
                        <input
                          type='checkbox'
                          checked={form.featured}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              featured: event.target.checked,
                            }))
                          }
                          className='rounded border-white/20 bg-transparent text-sky-500 focus:ring-sky-500 focus:ring-offset-black'
                        />
                        <span className='flex items-center gap-2'>
                          <Star className='h-4 w-4 text-sky-300' />
                          Feature this post on the blog index
                        </span>
                      </label>
                    </div>

                    <div className='rounded-[28px] border border-white/10 bg-white/[0.03] p-5'>
                      <label className='block text-sm font-medium text-gray-300'>
                        Tags
                      </label>
                      <input
                        type='text'
                        value={form.tags}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            tags: event.target.value,
                          }))
                        }
                        className='mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/20'
                        placeholder='Next.js, Career, Product Design'
                      />
                    </div>

                    <div className='rounded-[28px] border border-white/10 bg-white/[0.03] p-5'>
                      <label className='block text-sm font-medium text-gray-300'>
                        Cover image
                      </label>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className='mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-gray-300 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-white/20'
                      />

                      {uploadingImage && (
                        <p className='mt-3 text-sm text-gray-500'>
                          Uploading cover image...
                        </p>
                      )}

                      {form.cover_image_url && !uploadingImage && (
                        <div className='relative mt-4 aspect-[16/10] overflow-hidden rounded-[24px] border border-white/10 bg-black/40'>
                          <Image
                            src={form.cover_image_url}
                            alt='Cover preview'
                            fill
                            className='object-cover'
                          />
                        </div>
                      )}
                    </div>

                    <div className='rounded-[28px] border border-white/10 bg-white/[0.03] p-5'>
                      <p className='text-sm font-medium text-gray-300'>
                        Story stats
                      </p>
                      <div className='mt-4 space-y-3 text-sm text-gray-400'>
                        <div className='flex items-center justify-between gap-3'>
                          <span className='inline-flex items-center gap-2'>
                            <FileText className='h-4 w-4' />
                            Word count
                          </span>
                          <span className='font-medium text-white'>
                            {wordCount}
                          </span>
                        </div>
                        <div className='flex items-center justify-between gap-3'>
                          <span className='inline-flex items-center gap-2'>
                            <Eye className='h-4 w-4' />
                            Reading time
                          </span>
                          <span className='font-medium text-white'>
                            {readingTime} min
                          </span>
                        </div>
                        {editingPost && (
                          <div className='flex items-center justify-between gap-3'>
                            <span className='inline-flex items-center gap-2'>
                              <PencilLine className='h-4 w-4' />
                              Last updated
                            </span>
                            <span className='font-medium text-white'>
                              {formatBlogDate(editingPost.updated_at)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </aside>
                </div>
              </div>

              <div className='flex flex-col gap-3 border-t border-white/10 px-6 py-5 sm:flex-row sm:justify-end lg:px-8'>
                <button
                  type='button'
                  onClick={closeComposer}
                  className='rounded-2xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition-colors hover:border-white/20 hover:text-white'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={saving}
                  className='rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {saving
                    ? 'Saving...'
                    : editingPost
                      ? 'Update Post'
                      : form.status === 'draft'
                        ? 'Save Draft'
                        : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
