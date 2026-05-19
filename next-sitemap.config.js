const siteUrl = 'https://jhonisitepu-portofolio.vercel.app';

async function getPublishedBlogPaths() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return [];
  }

  const endpoint = new URL(`${supabaseUrl}/rest/v1/blog_posts`);
  endpoint.searchParams.set(
    'select',
    'slug,published_at,created_at,updated_at',
  );
  endpoint.searchParams.set('status', 'eq.published');
  endpoint.searchParams.set('published_at', 'not.is.null');
  endpoint.searchParams.set('order', 'published_at.desc');

  try {
    const response = await fetch(endpoint.toString(), {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    const posts = await response.json();

    return posts.map((post) => ({
      loc: `/blog/${post.slug}`,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: post.updated_at ?? post.published_at ?? post.created_at,
    }));
  } catch {
    return [];
  }
}

/**
 * @type {import('next-sitemap').IConfig}
 * @see https://github.com/iamvishnusankar/next-sitemap#readme
 */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
    additionalSitemaps: [`${siteUrl}/sitemap.xml`],
  },
  additionalPaths: async () => getPublishedBlogPaths(),
};
