import AOS from 'aos';
import { useEffect } from 'react';

import 'aos/dist/aos.css';

import NextImage from '@/components/NextImage';

export default function AboutMeSection() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section className='flex flex-col items-center justify-center lg:flex-row lg:justify-center min-h-screen w-full max-w-screen-xl py-10 lg:py-20 px-4 md:px-5 lg:px-6 gap-4 lg:gap-8 xl:gap-12 bg-white overflow-hidden'>
      <div className='flex items-center justify-center' data-aos='fade-right'>
        <NextImage
          src='/images/about-me/foto-jhoni-porto.png'
          alt='About me'
          width={525}
          height={572}
          className='lg:w-[100%] lg:h-[100%]'
        />
      </div>
      <div
        className='flex flex-col gap-5 items-start max-w-[610px]'
        data-aos='fade-left'
      >
        <h1 className='text-[28px] leading-8 lg:text-[48px] lg:leading-[56px] font-normal my-5'>
          About <span className='font-extrabold'>Me</span>
        </h1>
        <div
          className='flex flex-col gap-5 font-normal text-base leading-6 text-zinc-500 text-justify'
          data-aos='fade-up'
          data-aos-delay='200'
        >
          <p>
            I'm a passionate and driven full-stack developer specializing in
            React.js and Node.js, with a strong focus on creating seamless user
            experiences and writing clean, performant code. I began my journey
            into software engineering, particularly web development, in 2022,
            and since then, I've been eager to learn, grow, and take on new
            challenges as a developer.
          </p>
          <p>
            I'm currently building modern web applications using cutting-edge
            technologies like Next.js, TypeScript, TailwindCSS, and Firebase.
            Additionally, I've expanded my skillset to mobile development by
            creating applications with Flutter and React Native.{' '}
          </p>
          <p>
            As an undergraduate student, I balance my academic responsibilities
            with my passion for coding by working on personal projects and
            conducting research. I'm always excited to explore new technologies
            and collaborate on innovative ideas. When I'm not coding, you can
            find me exploring tech communities, learning from early-stage
            startups, or working on side projects. Feel free to connect with me
            I'd love to chat about tech, collaborate, or exchange ideas!
          </p>
        </div>
      </div>
    </section>
  );
}
