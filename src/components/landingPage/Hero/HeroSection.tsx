import IconHeroGroup from '@/components/landingPage/Hero/IconHeroGroup';
import NextImage from '@/components/NextImage';

export default function HeroSection() {
  return (
    <>
      <section className='min-h-screen flex flex-col-reverse lg:flex-row items-center justify-evenly mx-4 mt-24 lg:mt-4 lg:mx-8 gap-12 lg:gap-4 bg-white'>
        <div className='flex flex-col gap-4 lg:gap-7 text-left max-w-[585px]'>
          <h1 className='text-[28px] leading-8 lg:text-[48px] lg:leading-14 font-normal'>
            Hello I'am <span className='font-extrabold'>Jhoni</span>
          </h1>
          <div className='flex flex-row gap-4 items-center'>
            <h1 className='font-normaltext-[28px] leading-8 lg:text-[48px] lg:leading-14'>
              <span className='font-extrabold'>Frontend</span>
            </h1>
            <NextImage
              src='/images/hero/Developer.svg'
              alt='Developer'
              width={220}
              height={50}
              className='w-[45%] h-auto lg:w-[100%] lg:h-auto'
            />
          </div>
          <h1 className='font-normal text-[28px] leading-8 lg:text-[48px] lg:leading-[48px]'>
            Based in <span className='font-extrabold'>Indonesia</span>
          </h1>
          <p className='font-normal text-base leading-6'>
            I'm Jhoni Ananta Sitepu an undergraduated Information Systems who is
            highly organized with an interest in technology, also discipline,
            active and responsible worker who has passion in carrying out
            organizational activites and social work to develop my knowledge and
            skills. I aspire to keep learning and improving to be the best and
            succesful version of myself
          </p>
          <IconHeroGroup />
        </div>
        <div className='flex items-center justify-center'>
          <NextImage
            src='/images/hero/foto-jhoni-porto.png'
            alt='Hero Banner'
            width={631}
            height={596}
            className='lg:w-[100%] lg:h-[100%]'
          />
        </div>
      </section>
    </>
  );
}
