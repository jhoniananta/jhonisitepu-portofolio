import clsx from 'clsx';

import NextImage from '@/components/NextImage';

import { ExperienceProps } from '@/types/experience';

export default function ExperienceCard({
  companyLogo,
  position,
  company,
  duration,
  description,
  ...props
}: ExperienceProps) {
  return (
    <div
      className={clsx(
        'box-order flex flex-col px-6 py-8 w-full rounded-xl bg-black border-neutral-600 border hover:bg-zinc-800',
        'max-w-[1168px] max-md:px-5 max-mx:py-6 max-sm:px-4 max-sm:py-5',
      )}
      {...props}
    >
      <div
        className={clsx(
          'flex justify-between items-center w-full',
          'max-md:flex-wrap max-md:gap-3 max-sm:gap-2 max-sm:items-start',
        )}
        data-aos="fade-up"
        data-aos-duration="800"
      >
        <div className='flex gap-8 items-center text-white max-md:flex-1 max-md:min-w-0 max-sm:w-full'>
          <NextImage
            src={companyLogo}
            alt={`${company} logo`}
            width={32}
            height={32}
            data-aos="fade-up"
            data-aos-delay="200"
          />
          <h4 className='text-2xl font-semibold tracking-tight leading-none text-zinc-300 max-sm:text-sm'>
            {position} at {company}
          </h4>
        </div>
        <h6 className='text-base font-semibold tracking-tight leading-none text-zinc-300 max-sm:text-sm'>
          {duration}
        </h6>
      </div>
      <p
        className='mt-7 text-base tracking-wide leading-6 text-zinc-300 max-sm:mt-5 max-sm:text-sm max-sm:leading-5'
        data-aos="fade-up"
      >
        {description}
      </p>
    </div>
  );
}
