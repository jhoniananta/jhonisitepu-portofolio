import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { formatBlogDate, getBlogPublishDate } from '@/lib/blog';
import { createClient } from '@/lib/supabase/server';

import BlogCard from '@/components/blog/BlogCard';
import Layout from '@/components/Layout';

import { siteConfig } from '@/constant/config';

import type { BlogPost } from '@/types/blog';

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

async function getPublishedPostBySlug(slug: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  return (data ?? null) as BlogPost | null;
}

async function getRelatedPosts(postId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .neq('id', postId)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(2);

  return (data ?? []) as BlogPost[];
}

function getBlogUrl(slug: string) {
  return `${siteConfig.url}/blog/${slug}`;
}

function getBlogMetaImage(post: BlogPost) {
  return post.cover_image_url || siteConfig.ogImage;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getPublishedPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post not found',
      robots: { index: false, follow: false },
    };
  }

  const imageUrl = getBlogMetaImage(post);
  const postUrl = getBlogUrl(post.slug);
  const publishedAt = getBlogPublishDate(post);

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [...siteConfig.keywords, ...post.tags, post.title],
    authors: [{ name: siteConfig.author, url: siteConfig.url }],
    creator: siteConfig.author,
    publisher: siteConfig.author,
    category: 'Technology',
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: postUrl,
      siteName: siteConfig.title,
      locale: 'en_US',
      publishedTime: publishedAt,
      modifiedTime: post.updated_at,
      authors: [siteConfig.author],
      section: 'Blog',
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPublishedPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id);
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [getBlogMetaImage(post)],
    datePublished: getBlogPublishDate(post),
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.author,
      url: siteConfig.url,
    },
    mainEntityOfPage: getBlogUrl(post.slug),
    url: getBlogUrl(post.slug),
    keywords: post.tags.join(', '),
  };

  return (
    <Layout withNavbar={true} withFooter={true}>
      <div className='bg-white text-black'>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleJsonLd),
          }}
        />
        <section className='bg-black pb-20 pt-32 text-white'>
          <div className='layout'>
            <Link
              href='/blog'
              className='inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'
            >
              {'<-'} Back to Blog
            </Link>

            <div className='mt-8 max-w-4xl'>
              <div className='flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/50'>
                <span>{formatBlogDate(getBlogPublishDate(post))}</span>
                <span className='h-1 w-1 rounded-full bg-white/20' />
                <span>{post.reading_time_minutes} min read</span>
              </div>

              <h1 className='mt-5 font-sora text-4xl font-semibold leading-tight md:text-6xl'>
                {post.title}
              </h1>
              <p className='mt-6 max-w-3xl text-base leading-8 text-white/70 md:text-lg'>
                {post.excerpt}
              </p>

              {post.tags.length > 0 && (
                <div className='mt-8 flex flex-wrap gap-2'>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className='rounded-full border border-white/25 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {post.cover_image_url && (
              <div className='relative mt-10 aspect-[16/8] overflow-hidden rounded-[32px] border-2 border-white bg-neutral-100'>
                <Image
                  src={post.cover_image_url}
                  alt={post.title}
                  fill
                  priority={true}
                  sizes='(min-width: 1024px) 68rem, 92vw'
                  className='object-cover'
                />
                <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent' />
              </div>
            )}
          </div>
        </section>

        <section className='py-14 md:py-16'>
          <div className='layout'>
            <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12'>
              <article
                className='blog-prose rounded-[32px] border-2 border-black bg-white p-6 md:p-10'
                dangerouslySetInnerHTML={{ __html: post.content_html }}
              />

              <aside className='space-y-4 lg:sticky lg:top-28 lg:self-start'>
                <div className='rounded-[28px] border-2 border-black bg-white p-6'>
                  <p className='text-xs font-semibold uppercase tracking-[0.32em] text-neutral-500'>
                    About this post
                  </p>
                  <div className='mt-4 space-y-4 text-sm text-neutral-700'>
                    <div>
                      <p className='font-semibold text-black'>Published</p>
                      <p>{formatBlogDate(getBlogPublishDate(post))}</p>
                    </div>
                    <div>
                      <p className='font-semibold text-black'>Reading time</p>
                      <p>{post.reading_time_minutes} minutes</p>
                    </div>
                    <div>
                      <p className='font-semibold text-black'>Written by</p>
                      <p>Jhoni Sitepu</p>
                    </div>
                  </div>
                </div>

                <div className='rounded-[28px] border-2 border-black bg-black p-6 text-white'>
                  <p className='font-sora text-xl font-semibold text-white'>
                    More from the portfolio
                  </p>
                  <p className='mt-3 text-sm leading-7 text-white/70'>
                    Projects show what shipped. Blog posts explain how the
                    thinking got there.
                  </p>
                  <Link
                    href='/'
                    className='mt-5 inline-flex items-center gap-2 rounded-full border-2 border-white px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'
                  >
                    Explore the portfolio
                    <span>{'->'}</span>
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {relatedPosts.length > 0 && (
          <section className='pb-16 md:pb-20'>
            <div className='layout'>
              <div className='mb-6'>
                <p className='text-xs font-semibold uppercase tracking-[0.32em] text-neutral-500'>
                  Keep reading
                </p>
                <h2 className='mt-2 font-sora text-2xl font-semibold text-black md:text-3xl'>
                  Related articles
                </h2>
              </div>

              <div className='grid gap-6 md:grid-cols-2'>
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
