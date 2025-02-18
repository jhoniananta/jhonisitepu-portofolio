import ContactForm from '@/components/landingPage/ContactMe/ContactForm';
import ContactInfo from '@/components/landingPage/ContactMe/ContactInfo';

export default function ContactMeSection() {
  return (
    <section className='flex flex-col justify-center px-5 py-8 bg-white sm:px-20 sm:py-16 min-h-screen'>
      <div className='flex flex-col lg:flex-row sm:flex-wrap justify-between px-4 max-w-full w-full lg:max-w-screen-xl sm:px-8 items-center'>
        <div className='flex flex-col flex-1 shrink justify-center py-5 w-full sm:min-w-[240px]'>
          <ContactForm />
        </div>
        <ContactInfo />
      </div>
    </section>
  );
}
