import AOS from 'aos';
import { useEffect } from 'react';

import 'aos/dist/aos.css';

import IconHeroGroup from '@/components/landingPage/Hero/IconHeroGroup';
import NextImage from '@/components/NextImage';

export default function HeroSection() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
      <section className='min-h-screen flex flex-col-reverse lg:flex-row items-center justify-evenly mx-4 mt-24 lg:mt-4 lg:mx-8 gap-12 lg:gap-4 bg-white'>
        <div
          className='flex flex-col gap-4 lg:gap-7 text-left max-w-[585px]'
          data-aos='fade-right'
        >
          <div className='flex flex-col gap-4 text-left max-w-[585px]'>
            <h1 className='text-[28px] leading-8 lg:text-[48px] lg:leading-[48px] font-normal'>
              Hello I'am <span className='font-bold'>Jhoni</span>
            </h1>
            <h1 className='font-bold text-[28px] leading-8 lg:text-[48px] lg:leading-[48px]'>
              Frontend Developer
            </h1>
            <h1 className='font-normal text-[28px] leading-8 lg:text-[48px] lg:leading-[48px]'>
              Based in <span className='font-bold'>Indonesia</span>
            </h1>
          </div>
          <p className='font-normal text-base leading-6'>
            I'm Jhoni Ananta Sitepu an undergraduated Information Systems who is
            highly organized with an interest in technology, also discipline,
            active and responsible worker who has passion in carrying out
            organizational activites and social work to develop my knowledge and
            skills. I aspire to keep learning and improving to be the best and
            succesful version of myself
          </p>
          <IconHeroGroup />
        </div>
        <div
          className='flex items-center justify-center'
          data-aos='fade-left'
          data-aos-delay='300'
        >
          <NextImage
            src='/images/hero/foto-jhoni-porto.png'
            alt='Hero Banner'
            width={631}
            height={596}
            className='lg:w-[100%] lg:h-[100%]'
          />
        </div>
      </section>
    </>
  );
}
