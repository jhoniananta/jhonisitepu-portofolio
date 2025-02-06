import SkillIcon from '@/components/landingPage/Skill/SkillIcon';

import { skillData } from '@/contents/skill';

export default function SkillSection() {
  return (
    <>
      <section className='min-h-screen flex flex-col gap-5 items-center justify-center m-4 md:m-10 max-w-screen-xl bg-white'>
        <h1 className='text-[28px] leading-8 lg:text-[48px] lg:leading-[48px] font-normal my-5'>
          My <span className='font-extrabold'>Skill</span>
        </h1>
        <div className='flex flex-wrap gap-4 justify-center md:gap-8 min-[375px]:justify-between max-w-screen-lg my-5'>
          {skillData.map((skill, index) => (
            <SkillIcon
              key={index}
              reactIcon={skill.reactIcon}
              skillText={skill.skillText}
            />
          ))}
        </div>
      </section>
    </>
  );
}
