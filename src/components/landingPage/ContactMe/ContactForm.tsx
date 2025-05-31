import { zodResolver } from '@hookform/resolvers/zod';
import emailsjs from 'emailjs-com';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { z } from 'zod';

import IconHero from '@/components/landingPage/Hero/IconHero';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { heroButton as buttons } from '@/contents/hero';

// Form validation schema with Zod
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid Email').min(1, 'Email is required'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  message: z.string().min(1, 'Message is required'),
});

// Infer the type from the schema
type FormInputs = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormInputs) => {
    setIsSubmitting(true);
    try {
      const templateParams = {
        name: data.name,
        email: data.email,
        website: data.website,
        message: data.message,
      };

      const response = await emailsjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID || '',
      );

      if (response.status === 200) {
        toast.success('Your message has been sent successfully.');
        reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster
        position='top-center'
        toastOptions={{
          success: {
            style: {
              background: '#22c55e', // green-500
              color: '#ffffff',
            },
          },
          error: {
            style: {
              background: '#ef4444', // red-500
              color: '#ffffff',
            },
          },
        }}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col items-start w-full gap-5'
        noValidate
        data-aos='fade-right'
        data-aos-duration='1000'
      >
        {/* Name input */}
        <div
          className='flex flex-col w-full'
          data-aos='fade-up'
          data-aos-delay='200'
        >
          <Input
            {...register('name')}
            name='name'
            placeholder='Your name*'
            className='max-w-[500px] min-h-[56px] border-black'
            type='text'
          />
          {errors.name && (
            <p className='text-red-500 text-sm'>{errors.name.message}</p>
          )}
        </div>
        {/* Email input */}
        <div
          className='flex flex-col w-full'
          data-aos='fade-up'
          data-aos-delay='300'
        >
          <Input
            {...register('email')}
            name='email'
            placeholder='Email*'
            className='max-w-[500px] min-h-[56px] border-black'
            type='email'
          />
          {errors.email && (
            <p className='text-red-500 text-sm'>{errors.email.message}</p>
          )}
        </div>
        {/* Website (optional) input */}
        <div
          className='flex flex-col w-full'
          data-aos='fade-up'
          data-aos-delay='400'
        >
          <Input
            {...register('website')}
            name='website'
            placeholder='Your website (If exists)'
            className='max-w-[500px] min-h-[56px] border-black'
            type='url'
          />
          {errors.website && (
            <p className='text-red-500 text-sm'>{errors.website.message}</p>
          )}
        </div>
        {/* Message input */}
        <div
          className='flex flex-col w-full'
          data-aos='fade-up'
          data-aos-delay='500'
        >
          <Textarea
            {...register('message')}
            name='message'
            placeholder='How can I help?*'
            className='w-full sm:max-w-[500px] min-h-[140px] border-black'
            aria-label='How can I help?'
          />
          {errors.message && (
            <p className='text-red-500 text-sm'>{errors.message.message}</p>
          )}
        </div>
        <div
          className='flex flex-wrap gap-4 items-center mt-5 w-full sm:gap-10 justify-start'
          data-aos='fade-up'
          data-aos-delay='600'
        >
          <button
            type='submit'
            disabled={isSubmitting}
            className='gap-2 self-stretch px-4 py-2 text-lg font-semibold tracking-wide leading-tight text-white bg-black rounded min-h-[50px] sm:px-5 sm:text-xl'
          >
            {isSubmitting ? 'Sending...' : 'Get In Touch'}
          </button>
          <div className='flex gap-4 justify-center items-center'>
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
        </div>
      </form>
    </>
  );
}
