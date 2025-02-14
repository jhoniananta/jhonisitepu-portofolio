import React from 'react';

import ProjectCard from './ProjectCard';

export default function ProjectSection() {
  return (
    <section className='flex flex-col w-full items-center justify-center text-white bg-black min-w-full'>
      <div>
        <ProjectCard
          index={0}
          title='Project 1'
          description='This is the description of project 1.'
          imageUrl='/images/project/dummy-project.png'
        />
        <ProjectCard
          index={1}
          title='Project 2'
          description='This is the description of project 2.'
          imageUrl='/images/project/dummy-project.png'
        />
        <ProjectCard
          index={2}
          title='Project 3'
          description='This is the description of project 3.'
          imageUrl='/images/project/dummy-project.png'
        />
      </div>
    </section>
  );
}
