import * as React from 'react';

import IconHero from '@/components/landingPage/Hero/IconHero';

import { heroButton as buttons } from '@/contents/hero';

export default function IconHeroGroup() {
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
