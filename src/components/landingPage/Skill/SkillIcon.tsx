import clsx from 'clsx';

type SkillIconProps = {
  reactIcon?: React.ReactNode;
  skillText?: string;
};

export default function SkillIcon({ reactIcon, skillText }: SkillIconProps) {
  return (
    <>
      <div
        className={clsx(
          'flex flex-col justify-center items-center gap-8 p-6 rounded border-2 border-black border-solid',
          'h-[160px] w-[161px] lg:w-[186px] lg:h-[186px]',
          'hover:bg-black',
          'group',
        )}
      >
        {reactIcon && (
          <div
            className={clsx(
              'flex items-center justify-center aspect-square h-[56px] w-[56px]',
              'group-hover:brightness-0 group-hover:invert',
            )}
          >
            {reactIcon}
          </div>
        )}
        <h5
          className={clsx(
            'text-lg font-extrabold text-center group-hover:brightness-0 group-hover:invert',
          )}
        >
          {skillText}
        </h5>
      </div>
    </>
  );
}
