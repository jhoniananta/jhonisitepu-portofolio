import * as React from 'react';
import { FaLinkedin } from 'react-icons/fa';
import { FaSquareInstagram, FaSquareXTwitter } from 'react-icons/fa6';

import IconHero from '@/components/landingPage/Hero/IconHero';

export default function IconHeroGroup() {
  const buttons = [
    {
      reactIcon: <FaLinkedin className='text-3xl' />,
      href: 'https://www.linkedin.com/in/jhonisitepu/',
    },
    {
      reactIcon: <FaSquareInstagram className='text-3xl' />,
      href: 'https://www.instagram.com/jhoni_sitepu/',
    },
    {
      reactIcon: <FaSquareXTwitter className='text-3xl' />,
      href: 'https://twitter.com/jhoni_sitepu',
    },
  ];

  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  return (
    <div className='flex gap-5 md:gap-8 items-start py-1' role='group'>
      {buttons.map((button, index) => (
        <IconHero
          key={index}
          reactIcon={button.reactIcon}
          isActive={activeIndex === index}
          onClick={() => setActiveIndex(index)}
          href={button.href}
        />
      ))}
    </div>
  );
}
