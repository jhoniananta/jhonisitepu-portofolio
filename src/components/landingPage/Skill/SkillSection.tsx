import AOS from 'aos';
import { useEffect } from 'react';

import 'aos/dist/aos.css';

import SkillIcon from '@/components/landingPage/Skill/SkillIcon';

import { skillData } from '@/contents/skill';

export default function SkillSection() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
      <section className='min-h-screen flex flex-col gap-5 items-center justify-center m-4 md:m-10 max-w-screen-xl bg-white'>
        <h1
          className='text-[28px] leading-8 lg:text-[48px] lg:leading-[48px] font-normal my-5'
          data-aos='fade-down'
        >
          My <span className='font-extrabold'>Skill</span>
        </h1>
        <div className='flex flex-wrap gap-4 justify-center md:gap-8 min-[375px]:justify-between max-w-screen-lg my-5'>
          {skillData.map((skill, index) => (
            <SkillIcon
              key={index}
              reactIcon={skill.reactIcon}
              skillText={skill.skillText}
              data-aos='flip-left'
              data-aos-delay={index * 100}
              data-aos-duration='1000'
            />
          ))}
        </div>
      </section>
    </>
  );
}
