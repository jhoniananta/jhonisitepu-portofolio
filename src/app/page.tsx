'use client';

import '@/lib/env';

import AboutMeSection from '@/components/landingPage/AboutMe/AboutMeSection';
import ExperienceSection from '@/components/landingPage/Experience/ExperienceSection';
import HeroSection from '@/components/landingPage/Hero/HeroSection';
import ProjectSection from '@/components/landingPage/Project/ProjectSection';
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
        <section id='about-me'>
          <AboutMeSection />
        </section>
        <section id='about-me' className='w-full'>
          <ProjectSection />
        </section>
      </main>
    </Layout>
  );
}
