'use client';

import '@/lib/env';

import Layout from '@/layouts/Layout';

export default function HomePage() {
  return (
    <Layout withNavbar={true} withFooter={true}>
      <main className='flex min-h-screen items-center justify-center text-center text-black'>
        <h1 className='text-3xl font-bold'>Hello World</h1>
      </main>
    </Layout>
  );
}
