'use client';

import '@/lib/env';

import HeroSection from '@/components/landingPage/Hero/HeroSection';

import Layout from '@/layouts/Layout';

export default function HomePage() {
  return (
    <Layout withNavbar={true} withFooter={true}>
      <main className='flex min-h-screen max-w-[1280px] items-center justify-center text-black min-w-full'>
        <HeroSection />
      </main>
    </Layout>
  );
}
