import AOS from 'aos';
import { useEffect, useState } from 'react';

import 'aos/dist/aos.css';

import ExperienceCard from '@/components/landingPage/Experience/ExperienceCard';

import { ExperienceProps } from '@/types/experience';

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<ExperienceProps[]>([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    fetch('/api/experiences')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Map snake_case from DB to camelCase props
          setExperiences(
            data.map((exp: Record<string, string>) => ({
              companyLogo: exp.company_logo,
              position: exp.position,
              company: exp.company,
              duration: exp.duration,
              description: exp.description,
            })),
          );
        }
      })
      // eslint-disable-next-line no-console
      .catch(console.error);
  }, []);

  return (
    <section className='min-h-screen flex flex-col gap-5 items-center justify-center px-2 min-[375px]:px-4 md:px-10 py-10 lg:py-20 w-full bg-black'>
      <h1
        className='text-[28px] leading-8 lg:text-[48px] lg:leading-[48px] font-normal my-5 lg:my-10 text-white'
        data-aos='fade-down'
        data-aos-duration='1000'
      >
        My <span className='font-extrabold'>Experience</span>
      </h1>
      <div className='flex flex-col gap-8 lg:gap-10 xl:gap-12 justify-center'>
        {experiences.map((experience, index) => (
          <ExperienceCard
            key={index}
            {...experience}
            data-aos='fade-up'
            data-aos-delay={index * 200}
            data-aos-duration='1000'
          />
        ))}
      </div>
    </section>
  );
}
