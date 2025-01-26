import { Download } from 'lucide-react';
import * as React from 'react';
import { IoMenu } from 'react-icons/io5';

import Button from '@/components/buttons/Button';
import MobileDrawer from '@/components/layouts/MobileDrawer';
import UnstyledLink from '@/components/links/UnstyledLink';
import NextImage from '@/components/NextImage';

type NavigationItemProps = {
  text: string;
  href: string;
};

const navigationItems: NavigationItemProps[] = [
  { text: 'About Me', href: '/about' },
  { text: 'Skills', href: '/skills' },
  { text: 'Project', href: '/project' },
  { text: 'Contact me', href: '/contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <>
      {/* Mobile Navbar */}
      <nav className='fixed top-0 left-0 z-50 w-full shadow-md bg-white lg:hidden'>
        <div className='flex overflow-hidden flex-col justify-center p-4 text-xl font-bold tracking-tight leading-tight text-black capitalize whitespace-nowrap'>
          <div className='flex overflow-hidden gap-10 justify-between items-center w-full'>
            <div className='flex gap-3 items-center self-stretch my-auto'>
              <NextImage
                src='/favicon/favicon-32x32.png'
                alt='Logo'
                width={32}
                height={32}
                className='rounded-full self-stretch'
              />
              <h5 className='self-stretch my-auto text-xl font-bold'>Jhoni</h5>
            </div>
            {/* Hamburger icon when menu is close */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 text-2xl text-black ${isMenuOpen ? 'hidden' : ''}`}
            >
              <IoMenu className='font-bold' />
            </button>
            {isMenuOpen && (
              <MobileDrawer
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
              />
            )}
          </div>
        </div>
      </nav>
      {/* Desktop Navbar */}
      <nav className='hidden lg:flex items-center p-4 bg-white shadow-md fixed top-0 left-0 w-full max-h-[104px]'>
        <div className='flex overflow-hidden px-20 py-6 w-full'>
          <div className='flex px-8 flex-row justify-between items-center w-full'>
            <div className='flex gap-3 items-center self-stretch my-auto'>
              <NextImage
                src='/favicon/favicon-32x32.png'
                alt='Logo'
                width={32}
                height={32}
                className='rounded-full self-stretch'
              />
              <h5 className='self-stretch my-auto text-xl font-bold'>Jhoni</h5>
            </div>
            <div className='flex flex-row justify-between items-center gap-10'>
              {navigationItems.map(({ text, href }) => (
                <UnstyledLink
                  key={text}
                  href={href}
                  className='text-black font-bold text-lg hover:text-gray-500'
                >
                  <h5 className='self-stretch my-auto text-xl font-bold'>
                    {text}
                  </h5>
                </UnstyledLink>
              ))}
            </div>
            <div className='flex items-center'>
              <Button className='gap-3 bg-black hover:bg-gray-800 p-3'>
                <h5 className='font-semibold'>Resume</h5>
                <Download />
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
