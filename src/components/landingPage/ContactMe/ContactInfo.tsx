export default function ContactInfo() {
  return (
    <div className='flex flex-col flex-1 shrink items-start justify-center py-5 w-full lg:min-w-[240px] h-full'>
      <div className='flex flex-col flex-1 justify-center w-full'>
        <div className='flex flex-col w-full'>
          <h1
            className='text-black text-4xl font-extrabold tracking-tighter leading-none lg:text-5xl text-balance'
            data-aos='fade-left'
            data-aos-duration='1000'
          >
            Let's talk for Something special
          </h1>
          <p
            className='mt-4 text-sm tracking-wide leading-5 text-black lg:mt-5 lg:text-base lg:leading-6'
            data-aos='fade-left'
            data-aos-delay='200'
            data-aos-duration='1000'
          >
            I seek to push the limits of creativity to create high-engaging,
            user-friendly, and memorable interactive experiences.
          </p>
        </div>
        <div
          className='flex flex-col mt-8 w-full text-2xl font-semibold tracking-tight leading-none text-black whitespace-nowrap sm:mt-10 sm:text-3xl'
          data-aos='fade-left'
          data-aos-delay='400'
          data-aos-duration='1000'
        >
          <h3>jhoniananta@gmail.com</h3>
          <h3 className='mt-3 sm:mt-4'>081226030023</h3>
        </div>
      </div>
    </div>
  );
}
