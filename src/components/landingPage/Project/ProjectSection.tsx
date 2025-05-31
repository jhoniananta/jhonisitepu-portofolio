import AOS from 'aos';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import React, { useEffect } from 'react';

import 'aos/dist/aos.css';

import Button from '@/components/buttons/Button';

import { projectData } from '@/contents/project';

import ProjectCard from './ProjectCard';

export default function ProjectSection() {
  const [visibleProject, setIsVisibleProject] = React.useState<number>(3);
  const sectionRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const handleShowMore = () => {
    setIsVisibleProject(projectData.length);
  };

  const handleShowLess = () => {
    setIsVisibleProject(3);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <section
      ref={sectionRef}
      id='project'
      className='flex flex-col w-full items-center justify-center text-white bg-black min-w-full py-10 lg:py-15 px-2 min-[375px]:px-4 md:px-10'
    >
      <h1
        className='text-[28px] leading-8 lg:text-[48px] lg:leading-[48px] font-normal my-5 lg:my-10 text-white'
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        My <span className='font-extrabold'>Projects</span>
      </h1>
      {projectData.slice(0, visibleProject).map((project, index) => (
        <ProjectCard
          key={index}
          index={index}
          {...project}
          data-aos="fade-up"
          data-aos-delay={index * 200}
          data-aos-duration="1000"
        />
      ))}
      {visibleProject < projectData.length ? (
        <Button
          onClick={handleShowMore}
          rightIcon={ChevronDownIcon}
          className='mt-4 mb-8 bg-white text-black px-6 hover:bg-black hover:text-white border-white active:bg-black active:text-white'
          data-aos="fade-up"
          data-aos-delay="400"
        >
          Show More
        </Button>
      ) : (
        <Button
          onClick={handleShowLess}
          rightIcon={ChevronUpIcon}
          className='mt-4 mb-8 bg-white text-black px-6 hover:bg-black hover:text-white border-white active:bg-black active:text-white'
          data-aos="fade-up"
          data-aos-delay="400"
        >
          Show Less
        </Button>
      )}
    </section>
  );
}
