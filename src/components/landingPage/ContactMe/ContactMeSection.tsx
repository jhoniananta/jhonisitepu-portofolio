import AOS from 'aos';
import { useEffect } from 'react';

import 'aos/dist/aos.css';

import ContactForm from '@/components/landingPage/ContactMe/ContactForm';
import ContactInfo from '@/components/landingPage/ContactMe/ContactInfo';

export default function ContactMeSection() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section
      className='flex flex-col justify-center px-5 py-8 bg-white sm:px-20 sm:py-16 min-h-screen overflow-x-hidden'
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <div className='flex flex-col lg:flex-row justify-between px-4 max-w-full lg:gap-6 w-full xl:max-w-screen-xl sm:px-8 items-start'>
        <div
          className='flex flex-col flex-1 shrink justify-center py-5 xl:w-1/2 sm:min-w-[240px]'
          data-aos="fade-right"
          data-aos-duration="1000"
        >
          <ContactForm />
        </div>
        <div
          className='flex flex-col flex-1 shrink justify-center items-start py-5 xl:w-1/2 sm:min-w-[240px]'
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          <ContactInfo />
        </div>
      </div>
    </section>
  );
}
