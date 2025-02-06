import ExperienceCard from '@/components/landingPage/Experience/ExperienceCard';

import { experienceData } from '@/contents/experience';

export default function ExperienceSection() {
  return (
    <section className='min-h-screen flex flex-col gap-5 items-center justify-center p-2 min-[375px]:p-4 md:p-10 w-full bg-black'>
      <h1 className='text-[28px] leading-8 lg:text-[48px] lg:leading-[48px] font-normal my-5 lg:my-10 text-white'>
        My <span className='font-extrabold'>Experience</span>
      </h1>
      <div className='flex flex-col gap-8 lg:gap-10 xl:gap-12 justify-center'>
        {experienceData.map((experience, index) => (
          <ExperienceCard key={index} {...experience} />
        ))}
      </div>
    </section>
  );
}
