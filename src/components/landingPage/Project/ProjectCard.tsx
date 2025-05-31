import { FaExternalLinkAlt } from 'react-icons/fa';

import UnstyledLink from '@/components/links/UnstyledLink';
import NextImage from '@/components/NextImage';

import { ProjectCardProps } from '@/types/portfolio';

export default function ProjectCard({
  index,
  title,
  description,
  imageUrl,
  linkUrl,
  ...props
}: ProjectCardProps) {
  return (
    <div
      className='flex flex-col md:flex-row overflow-hidden gap-10 items-center p-4 lg:py-5 w-full max-w-screen-xl'
      {...props}
    >
      <div
        className={`w-full lg:py-4 lg:px-4 md:w-1/2 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}
        data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
        data-aos-duration="1000"
      >
        <UnstyledLink href={linkUrl}>
          <NextImage
            loading='lazy'
            width={530}
            height={397}
            src={imageUrl}
            alt={title}
            className='rounded-2xl shadow-lg aspect-[1.33] w-full h-auto object-cover'
            data-aos="zoom-in"
            data-aos-delay="200"
          />
        </UnstyledLink>
      </div>
      <div
        className={`w-full md:w-1/2 flex flex-col justify-center text-white ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}
        data-aos={index % 2 === 0 ? "fade-left" : "fade-right"}
        data-aos-duration="1000"
      >
        <h1
          className='text-5xl font-extrabold tracking-tighter leading-none md:text-4xl'
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {(index + 1).toString().padStart(2, '0')}
        </h1>
        <h2
          className='mt-7 text-3xl font-bold tracking-tighter leading-none'
          data-aos="fade-up"
          data-aos-delay="400"
        >
          {title}
        </h2>
        <p
          className='mt-7 text-base tracking-wide leading-6 text-zinc-200'
          data-aos="fade-up"
          data-aos-delay="400"
        >
          {description}
        </p>
        <div
          className='flex mt-2 md:mt-4 lg:mt-5 w-5 min-h-[20px]'
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <UnstyledLink href={linkUrl}>
            <FaExternalLinkAlt className='hover:text-gray-300' />
          </UnstyledLink>
        </div>
      </div>
    </div>
  );
}
