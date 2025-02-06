import clsx from 'clsx';

import { IconButtonProps } from '@/types/hero';

export default function IconHero({
  reactIcon,
  isActive,
  onClick,
  href,
}: IconButtonProps) {
  return (
    <>
      <a
        href={href}
        target='_blank'
        className={clsx(
          'flex gap-2 justify-center items-center px-4 rounded min-h-[48px] max-h-[56px] min-w-[48px] max-w-[56px]',
          'hover:bg-black',
          `${isActive ? 'bg-black' : 'border-2 border-black border-solid'}`,
          'group',
        )}
        onClick={onClick}
        tabIndex={0}
        role='button'
      >
        {reactIcon && (
          <div
            className={`flex items-center justify-center self-stretch my-auto w-5 aspect-square ${isActive ? 'brightness-0 invert' : ''} group-hover:brightness-0 group-hover:invert`}
          >
            {reactIcon}
          </div>
        )}
        {!reactIcon && (
          <div className='flex self-stretch my-auto w-5 min-h-[20px]' />
        )}
      </a>
    </>
  );
}
