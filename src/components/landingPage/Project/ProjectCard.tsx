import { FaExternalLinkAlt } from 'react-icons/fa';

import NextImage from '@/components/NextImage';

import { ProjectCardProps } from '@/types/portfolio';

export default function ProjectCard({
  index,
  title,
  description,
  imageUrl,
}: ProjectCardProps) {
  return (
    <div className='flex flex-col md:flex-row overflow-hidden gap-10 items-center p-4 lg:py-5 lg:mt-5 w-full max-w-screen-xl'>
      <div
        className={`w-full lg:py-4 lg:px-4 md:w-1/2 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}
      >
        <NextImage
          loading='lazy'
          width={530}
          height={397}
          src={imageUrl}
          alt={title}
          className='object-contain rounded-2xl shadow-lg aspect-[1.33] w-full h-auto'
        />
      </div>
      <div
        className={`w-full md:w-1/2 flex flex-col justify-center text-white ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}
      >
        <h1 className='text-5xl font-extrabold tracking-tighter leading-none md:text-4xl'>
          {(index + 1).toString().padStart(2, '0')}
        </h1>
        <h2 className='mt-7 text-3xl font-bold tracking-tighter leading-none'>
          {title}
        </h2>
        <p className='mt-7 text-base tracking-wide leading-6 text-zinc-200'>
          {description}
        </p>
        <div className='flex mt-2 md:mt-4 lg:mt-5 w-5 min-h-[20px]'>
          <FaExternalLinkAlt />
        </div>
      </div>
    </div>
  );
}
