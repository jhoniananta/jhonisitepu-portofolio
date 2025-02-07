'use client';

import '@/lib/env';

import ExperienceSection from '@/components/landingPage/Experience/ExperienceSection';
import HeroSection from '@/components/landingPage/Hero/HeroSection';
import SkillSection from '@/components/landingPage/Skill/SkillSection';
import Layout from '@/components/Layout';

export default function HomePage() {
  return (
    <Layout withNavbar={true} withFooter={true}>
      <main className='flex flex-col w-full items-center justify-center text-black min-w-full'>
        <section id='hero'>
          <HeroSection />
        </section>
        <section id='skill'>
          <SkillSection />
        </section>
        <section id='experience' className='w-full'>
          <ExperienceSection />
        </section>
      </main>
    </Layout>
  );
}
