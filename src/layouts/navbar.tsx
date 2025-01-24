import { IoMenu } from 'react-icons/io5';
import NextImage from '@/components/NextImage';
import * as React from 'react';
import MobileDrawer from '@/components/layouts/MobileDrawer';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    // Mobile Navbar
    <nav className='sm:hidden fixed top-0 left-0 z-50 w-full shadow-md bg-white'>
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
          {isMenuOpen && <MobileDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />}
        </div>
      </div>
    </nav>
  );
}
