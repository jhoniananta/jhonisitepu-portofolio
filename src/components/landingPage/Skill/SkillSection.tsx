import { FaGithub, FaReact } from 'react-icons/fa6';
import { RiInfinityLine, RiTailwindCssFill } from 'react-icons/ri';
import { SiExpress, SiNextdotjs, SiTypescript } from 'react-icons/si';
import { TbBrandReactNative } from 'react-icons/tb';

import SkillIcon from '@/components/landingPage/Skill/SkillIcon';

export default function SkillSection() {
  const skillData = [
    {
      reactIcon: <FaGithub className='text-5xl' />,
      skillText: 'Git & Github',
    },
    {
      reactIcon: <SiTypescript className='text-5xl' />,
      skillText: 'Typescript',
    },
    {
      reactIcon: <SiNextdotjs className='text-5xl' />,
      skillText: 'Next.js',
    },
    {
      reactIcon: <FaReact className='text-5xl' />,
      skillText: 'React.js',
    },
    {
      reactIcon: <RiTailwindCssFill className='text-5xl' />,
      skillText: 'TailwindCSS',
    },
    {
      reactIcon: <SiExpress className='text-5xl' />,
      skillText: 'Express.js',
    },
    {
      reactIcon: <TbBrandReactNative className='text-5xl' />,
      skillText: 'React Native',
    },
    {
      reactIcon: <RiInfinityLine className='text-5xl' />,
      skillText: 'Devops & CI/CD',
    },
  ];

  return (
    <>
      <section className='min-h-screen flex flex-col gap-5 items-center justify-center m-4 md:m-10 max-w-screen-xl'>
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
