type IconButtonProps = {
  reactIcon?: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  href: string;
};
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
        className={`flex gap-2 justify-center items-center px-4 rounded min-h-[48px] max-h-[56px] min-w-[48px] max-w-[56px] ${isActive ? 'bg-black' : 'border-2 border-black border-solid'}`}
        onClick={onClick}
        tabIndex={0}
        role='button'
      >
        {reactIcon && (
          <div
            className={`flex items-center justify-center self-stretch my-auto w-5 aspect-square ${isActive ? 'brightness-0 invert' : ''}`}
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
