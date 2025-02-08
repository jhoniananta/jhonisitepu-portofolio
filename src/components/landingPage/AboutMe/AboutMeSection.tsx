import NextImage from '@/components/NextImage';

export default function AboutMeSection() {
  return (
    <section className='flex flex-col items-center justify-center lg:flex-row lg:justify-center min-h-screen w-full max-w-screen-xl py-10 lg:py-20 px-4 md:px-5 lg:px-6 gap-4 lg:gap-8 xl:gap-12 bg-white'>
      <div className='flex items-center justify-center'>
        <NextImage
          src='/images/about-me/about-me-image.png'
          alt='About me'
          width={525}
          height={572}
          className='lg:w-[100%] lg:h-[100%]'
        />
      </div>
      <div className='flex flex-col gap-5 items-start max-w-[610px]'>
        <h1 className='text-[28px] leading-8 lg:text-[48px] lg:leading-[56px] font-normal my-5'>
          About <span className='font-extrabold'>Me</span>
        </h1>
        <div className='flex flex-col gap-5 font-normal text-base leading-6 text-zinc-500 text-justify'>
          <p>
            I'm a passionate, self-proclaimed designer who specializes in full
            stack development (React.js & Node.js). I am very enthusiastic about
            bringing the technical and visual aspects of digital products to
            life. User experience, pixel perfect design, and writing clear,
            readable, highly performant code matters to me.
          </p>
          <p>
            I began my journey as a web developer in 2015, and since then, I've
            continued to grow and evolve as a developer, taking on new
            challenges and learning the latest technologies along the way. Now,
            in my early thirties, 7 years after starting my web development
            journey, I'm building cutting-edge web applications using modern
            technologies such as Next.js, TypeScript, Nestjs, Tailwindcss,
            Supabase and much more.{' '}
          </p>
          <p>
            When I'm not in full-on developer mode, you can find me hovering
            around on twitter or on indie hacker, witnessing the journey of
            early startups or enjoying some free time. You can follow me on
            Twitter where I share tech-related bites and build in public, or you
            can follow me on GitHub.
          </p>
        </div>
      </div>
    </section>
  );
}
