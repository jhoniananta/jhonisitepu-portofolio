import Image from 'next/image';
import Link from 'next/link';

import { formatBlogDate, getBlogPublishDate } from '@/lib/blog';

import type { BlogPost } from '@/types/blog';

type BlogCardProps = {
  post: BlogPost;
  featured?: boolean;
};

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <article
      className={`group overflow-hidden rounded-[28px] border-2 border-black bg-white transition-transform duration-300 hover:-translate-y-1 ${
        featured ? 'grid gap-0 lg:grid-cols-[1fr_minmax(0,1fr)]' : ''
      }`}
    >
      <Link
        href={`/blog/${post.slug}`}
        className={featured ? 'contents' : 'block h-full'}
      >
        <div
          className={`relative overflow-hidden border-b-2 border-black bg-neutral-100 ${
            featured ? 'min-h-[280px]' : 'aspect-[16/10]'
          }`}
        >
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
            />
          ) : (
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.9),_transparent_35%),linear-gradient(135deg,_rgba(229,229,229,0.9),_rgba(163,163,163,0.85))]' />
          )}
        </div>

        <div className='flex h-full flex-col p-6 md:p-7'>
          <div className='flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500'>
            <span>{formatBlogDate(getBlogPublishDate(post))}</span>
            <span className='h-1 w-1 rounded-full bg-neutral-300' />
            <span>{post.reading_time_minutes} min read</span>
          </div>

          {post.tags.length > 0 && (
            <div className='mt-4 flex flex-wrap gap-2'>
              {post.tags.slice(0, featured ? 4 : 3).map((tag) => (
                <span
                  key={tag}
                  className='rounded-full border border-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black'
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h2
            className={`mt-5 font-sora font-semibold text-black ${
              featured ? 'text-3xl md:text-4xl' : 'text-2xl'
            }`}
          >
            {post.title}
          </h2>

          <p
            className={`mt-4 text-neutral-700 ${
              featured ? 'text-base leading-8' : 'text-sm leading-7'
            }`}
          >
            {post.excerpt}
          </p>

          <div className='mt-8 inline-flex items-center gap-2 text-sm font-semibold text-black transition-colors group-hover:text-neutral-600'>
            Read article
            <span className='transition-transform duration-300 group-hover:translate-x-1'>
              {'->'}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
