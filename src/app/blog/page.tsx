import type { Metadata } from 'next';
import Link from 'next/link';

import { createClient } from '@/lib/supabase/server';

import BlogCard from '@/components/blog/BlogCard';
import Layout from '@/components/Layout';

import { siteConfig } from '@/constant/config';

import type { BlogPost } from '@/types/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Writing about product engineering, what I learn while building and all other random stuff in my mind.',
  keywords: [...siteConfig.keywords, 'blog', 'software engineering notes'],
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog',
    description:
      'Writing about product engineering, what I learn while building and all other random stuff in my mind.',
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.title,
    type: 'website',
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Blog preview for Jhoni Sitepu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog',
    description:
      'Writing about product engineering, what I learn while building and all other random stuff in my mind.',
    images: [siteConfig.ogImage],
  },
};

async function getPublishedPosts() {
  const supabase = createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .order('featured', { ascending: false })
    .order('published_at', { ascending: false });

  return (data ?? []) as BlogPost[];
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const [featuredPost, ...otherPosts] = posts;

  return (
    <Layout withNavbar={true} withFooter={true}>
      <div className='bg-white text-black'>
        <section className='bg-black pb-20 pt-32 text-white'>
          <div className='layout'>
            <p className='text-xs font-semibold uppercase tracking-[0.35em] text-white/55'>
              Journal
            </p>
            <div className='mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end'>
              <div>
                <h1 className='font-sora text-4xl font-semibold leading-tight md:text-6xl'>
                  Notes on software engineer career, random thoughts, and all
                  the stuff in between.
                </h1>
                <p className='mt-6 max-w-2xl text-base leading-8 text-white/70 md:text-lg'>
                  This is where I write longer thoughts: my past lessons,
                  technical breakdowns, and all other random stuff in my mind.
                </p>
              </div>

              <div className='rounded-[28px] border-2 border-white bg-white p-6 text-black'>
                <p className='text-sm font-medium text-neutral-500'>
                  Published pieces
                </p>
                <p className='mt-3 font-sora text-5xl font-semibold'>
                  {posts.length}
                </p>
                <Link
                  href='/'
                  className='mt-6 inline-flex items-center gap-2 rounded-full border-2 border-black px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'
                >
                  Back to Portfolio
                  <span>{'->'}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className='py-16 md:py-20'>
          <div className='layout'>
            {featuredPost ? (
              <div>
                <div className='mb-6 flex items-center justify-between gap-4'>
                  <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.32em] text-neutral-500'>
                      Featured Post
                    </p>
                    <h2 className='mt-2 font-sora text-2xl font-semibold text-black md:text-3xl'>
                      Start here.
                    </h2>
                  </div>
                </div>

                <BlogCard post={featuredPost} featured={true} />
              </div>
            ) : (
              <div className='rounded-[32px] border-2 border-dashed border-black bg-white px-8 py-14 text-center'>
                <p className='text-sm font-semibold uppercase tracking-[0.32em] text-neutral-500'>
                  No posts yet
                </p>
                <h2 className='mt-4 font-sora text-3xl font-semibold text-black'>
                  The writing desk is still warming up.
                </h2>
                <p className='mx-auto mt-4 max-w-xl text-neutral-700'>
                  Once the first article is published from the admin panel, it
                  will show up here automatically.
                </p>
              </div>
            )}

            {otherPosts.length > 0 && (
              <div className='mt-14'>
                <div className='mb-6'>
                  <p className='text-xs font-semibold uppercase tracking-[0.32em] text-neutral-500'>
                    More writing
                  </p>
                  <h2 className='mt-2 font-sora text-2xl font-semibold text-black md:text-3xl'>
                    Recent articles
                  </h2>
                </div>

                <div className='grid gap-6 md:grid-cols-2'>
                  {otherPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
