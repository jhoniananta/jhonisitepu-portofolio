import NextImage from '@/components/NextImage';

export default function Footer() {
  return (
    <footer className='flex w-full bg-black text-white max-h-[100px]'>
      <div className='flex w-full overflow-hidden px-4 py-2 lg:px-20 lg:py-6 items-center'>
        <div className='flex flex-row overflow-hidden lg:px-8 justify-between items-center w-full'>
          <div className='flex items-center justify-center'>
            <NextImage
              src='/favicon/android-chrome-512x512.png'
              alt='Logo'
              width={40}
              height={40}
              className='rounded-full'
            />
          </div>
          <div className='flex flex-col gap-1 lg:gap-3'>
            <h6 className='font-semibold text-right'>&#169; 2025 Jhoni</h6>
            <h6 className='font-semibold text-right flex flex-row gap-1 '>
              Made using{' '}
              <a href='https://nextjs.org/'>
                <p className='underline'>Next.js</p>
              </a>
              . Hosted on{' '}
              <a href='https://vercel.com/'>
                <p className='underline'>Vercel</p>
              </a>
            </h6>
          </div>
        </div>
      </div>
    </footer>
  );
}
