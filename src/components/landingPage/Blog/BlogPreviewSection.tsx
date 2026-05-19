'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { formatBlogDate, getBlogPublishDate } from '@/lib/blog';

import type { BlogPost } from '@/types/blog';

function BlogPreviewSkeleton() {
  return (
    <div className='grid gap-6 lg:grid-cols-12'>
      <div className='overflow-hidden rounded-[32px] border-2 border-black bg-white lg:col-span-8'>
        <div className='grid lg:grid-cols-[minmax(280px,0.92fr)_minmax(0,1.08fr)]'>
          <div className='min-h-[320px] animate-pulse bg-neutral-200' />
          <div className='space-y-4 p-6 md:p-8'>
            <div className='h-4 w-16 animate-pulse rounded-full bg-neutral-200' />
            <div className='h-3 w-48 animate-pulse rounded-full bg-neutral-200' />
            <div className='h-16 w-4/5 animate-pulse rounded-3xl bg-neutral-200' />
            <div className='h-24 animate-pulse rounded-3xl bg-neutral-100' />
          </div>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:col-span-4 lg:grid-cols-1'>
        {[0, 1].map((item) => (
          <div
            key={item}
            className='overflow-hidden rounded-[28px] border-2 border-black bg-white'
          >
            <div className='aspect-[16/10] animate-pulse bg-neutral-200' />
            <div className='space-y-4 p-5'>
              <div className='h-3 w-24 animate-pulse rounded-full bg-neutral-200' />
              <div className='h-10 animate-pulse rounded-3xl bg-neutral-200' />
              <div className='h-16 animate-pulse rounded-3xl bg-neutral-100' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedBlogPreview({
  post,
  index,
}: {
  post: BlogPost;
  index: number;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className='group block overflow-hidden rounded-[32px] border-2 border-black bg-white transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black'
    >
      <div className='grid lg:grid-cols-[minmax(280px,0.92fr)_minmax(0,1.08fr)]'>
        <div className='relative min-h-[320px] overflow-hidden border-b-2 border-black bg-neutral-100 lg:border-b-0 lg:border-r-2'>
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              sizes='(min-width: 1024px) 34rem, 92vw'
              className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
            />
          ) : null}
          <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.14))]' />
          <div className='absolute left-5 top-5 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-white text-sm font-bold text-black'>
            {String(index + 1).padStart(2, '0')}
          </div>
        </div>

        <div className='flex h-full flex-col justify-between p-6 md:p-8'>
          <div>
            <div className='flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500'>
              <span>{formatBlogDate(getBlogPublishDate(post))}</span>
              <span className='h-1 w-1 rounded-full bg-neutral-300' />
              <span>{post.reading_time_minutes} min read</span>
            </div>

            <h3 className='mt-5 font-sora text-3xl font-semibold leading-tight text-black md:text-[42px] md:leading-[44px]'>
              {post.title}
            </h3>

            <p className='mt-5 max-w-2xl text-sm leading-7 text-neutral-700 md:text-base'>
              {post.excerpt}
            </p>

            {post.tags.length > 0 && (
              <div className='mt-6 flex flex-wrap gap-2'>
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className='rounded-full border border-black px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-black'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className='mt-8 inline-flex items-center gap-2 text-sm font-semibold text-black transition-colors group-hover:text-neutral-600'>
            Read the full article
            <span className='transition-transform duration-300 group-hover:translate-x-1'>
              {'->'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CompactBlogPreview({
  post,
  index,
}: {
  post: BlogPost;
  index: number;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className='group block overflow-hidden rounded-[28px] border-2 border-black bg-white transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black'
    >
      <div className='relative aspect-[16/10] overflow-hidden border-b-2 border-black bg-neutral-100'>
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            sizes='(min-width: 1024px) 22rem, 92vw'
            className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
          />
        ) : null}
        <div className='absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white text-xs font-bold text-black'>
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>

      <div className='p-5'>
        <div className='flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500'>
          <span>{formatBlogDate(getBlogPublishDate(post))}</span>
          <span className='h-1 w-1 rounded-full bg-neutral-300' />
          <span>{post.reading_time_minutes} min read</span>
        </div>

        <h3 className='mt-4 line-clamp-2 font-sora text-[26px] font-semibold leading-[1.05] text-black'>
          {post.title}
        </h3>

        <p className='mt-3 line-clamp-3 text-sm leading-7 text-neutral-700'>
          {post.excerpt}
        </p>

        <div className='mt-5 inline-flex items-center gap-2 text-sm font-semibold text-black transition-colors group-hover:text-neutral-600'>
          Open article
          <span className='transition-transform duration-300 group-hover:translate-x-1'>
            {'->'}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPreviewSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        const data = await response.json();

        if (Array.isArray(data)) {
          setPosts(data.slice(0, 3));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch blog preview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const featuredPost = posts[0];
  const compactPosts = posts.slice(1, 3);
  const hasCompactPosts = compactPosts.length > 0;

  return (
    <section
      id='blog-preview'
      className='w-full border-t border-black/10 bg-white px-4 py-14 text-black md:px-10 md:py-20'
    >
      <div className='mx-auto w-full max-w-screen-xl'>
        <div className='flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
          <div className='max-w-3xl'>
            <p className='text-xs font-semibold uppercase tracking-[0.35em] text-neutral-500'>
              Latest Writing
            </p>
            <h2 className='mt-4 font-sora text-[28px] font-semibold leading-8 text-black md:text-[48px] md:leading-[48px]'>
              Thoughts, breakdowns, and practical notes behind the work.
            </h2>
            <p className='mt-4 max-w-2xl text-sm leading-7 text-neutral-700 md:text-base'>
              A tighter preview of the journal, pulled directly from the latest
              published posts.
            </p>
          </div>

          <Link
            href='/blog'
            className='inline-flex items-center gap-2 rounded-full border-2 border-black px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black'
          >
            View All Articles
            <span>{'->'}</span>
          </Link>
        </div>

        <div className='mt-10'>
          {loading ? (
            <BlogPreviewSkeleton />
          ) : featuredPost ? (
            <div
              className={`grid gap-6 ${
                hasCompactPosts ? 'lg:grid-cols-12' : ''
              }`}
            >
              <div className={hasCompactPosts ? 'lg:col-span-8' : ''}>
                <FeaturedBlogPreview post={featuredPost} index={0} />
              </div>

              {hasCompactPosts && (
                <div className='grid gap-6 md:grid-cols-2 lg:col-span-4 lg:grid-cols-1'>
                  {compactPosts.map((post, index) => (
                    <CompactBlogPreview
                      key={post.id}
                      post={post}
                      index={index + 1}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className='rounded-[32px] border-2 border-dashed border-black bg-white px-8 py-14 text-center'>
              <p className='text-sm font-semibold uppercase tracking-[0.32em] text-neutral-500'>
                No blog previews yet
              </p>
              <h3 className='mt-4 font-sora text-3xl font-semibold text-black'>
                Publish the first article to light this section up.
              </h3>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
