'use client';

import '@/lib/env';

import HeroSection from '@/components/landingPage/Hero/HeroSection';
import SkillSection from '@/components/landingPage/Skill/SkillSection';

import Layout from '@/layouts/Layout';

export default function HomePage() {
  return (
    <Layout withNavbar={true} withFooter={true}>
      <main className='flex flex-col max-w-screen-xl items-center justify-center text-black min-w-full'>
        <HeroSection />
        <SkillSection />
      </main>
    </Layout>
  );
}
