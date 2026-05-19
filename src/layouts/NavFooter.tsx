'use client';

import { Download } from 'lucide-react';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { IoMenu } from 'react-icons/io5';

import Button from '@/components/buttons/Button';
import MobileDrawer from '@/components/layout/MobileDrawer';
import UnstyledLink from '@/components/links/UnstyledLink';
import NextImage from '@/components/NextImage';

type NavigationItemProps = {
  text: string;
  href: string;
};

function getNavigationItems(pathname: string): NavigationItemProps[] {
  const blogHref = pathname.startsWith('/blog/') ? '/blog' : '/#blog';

  return [
    { text: 'Skill', href: '/#skill' },
    { text: 'Experience', href: '/#experience' },
    { text: 'About Me', href: '/#about-me' },
    { text: 'Project', href: '/#project' },
    { text: 'Blog', href: blogHref },
    { text: 'Contact me', href: '/#contact' },
  ];
}

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDarkBackground, setIsDarkBackground] = React.useState(false);
  const navigationItems = React.useMemo(
    () => getNavigationItems(pathname),
    [pathname],
  );

  const handleOpenResume = () => {
    window.open('/resume/jhoni_resume.pdf', '_blank');
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('nav');
      if (!navbar) {
        return;
      }

      const navbarRect = navbar.getBoundingClientRect();
      const elementBehindNavbar = document.elementFromPoint(
        window.innerWidth / 2,
        navbarRect.top + 105,
      );

      if (!elementBehindNavbar) {
        return;
      }

      let sectionElement: HTMLElement | null =
        elementBehindNavbar as HTMLElement;

      while (sectionElement && sectionElement.tagName !== 'SECTION') {
        sectionElement = sectionElement.parentElement;
      }

      if (!sectionElement) {
        return;
      }

      const backgroundColor =
        window.getComputedStyle(sectionElement).backgroundColor;
      const rgb = backgroundColor.match(/\d+/g);

      if (!rgb) {
        return;
      }

      const brightness =
        (parseInt(rgb[0]) * 299 +
          parseInt(rgb[1]) * 587 +
          parseInt(rgb[2]) * 114) /
        1000;

      setIsDarkBackground(brightness < 128);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 z-[9999] w-full bg-transparent shadow-md lg:hidden ${
          isDarkBackground ? 'text-white' : 'text-black'
        }`}
      >
        <div className='flex overflow-hidden flex-col justify-center p-4 text-xl font-bold tracking-tight leading-tight capitalize whitespace-nowrap'>
          <div className='flex overflow-hidden gap-10 justify-between items-center w-full'>
            <div>
              <UnstyledLink
                href='/'
                className='font-bold text-lg hover:text-gray-500 flex gap-3 items-center self-stretch my-auto'
              >
                <NextImage
                  src='/favicon/favicon-32x32.png'
                  alt='Logo'
                  width={32}
                  height={32}
                  className={`rounded-full self-stretch ${
                    isDarkBackground ? 'filter invert' : ''
                  }`}
                />
                <h5
                  className={`self-stretch my-auto text-xl font-bold ${
                    isDarkBackground ? 'text-white' : 'text-black'
                  }`}
                >
                  Jhoni
                </h5>
              </UnstyledLink>
            </div>

            <button
              onClick={() => setIsMenuOpen((current) => !current)}
              className={`p-2 text-2xl ${
                isDarkBackground ? 'text-white' : 'text-black'
              } ${isMenuOpen ? 'hidden' : ''}`}
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

      <nav
        className={`fixed top-0 left-0 hidden max-h-[104px] w-full items-center bg-transparent p-4 shadow-md lg:flex z-[9999] ${
          isDarkBackground ? 'text-white' : 'text-black'
        }`}
      >
        <div className='flex overflow-hidden xl:px-20 py-6 w-full'>
          <div className='flex px-8 flex-row justify-between items-center w-full'>
            <div>
              <UnstyledLink
                href='/'
                className='flex gap-3 items-center self-stretch my-auto'
              >
                <NextImage
                  src='/favicon/favicon-32x32.png'
                  alt='Logo'
                  width={32}
                  height={32}
                  className={`rounded-full self-stretch ${
                    isDarkBackground ? 'filter invert' : ''
                  }`}
                />
                <h5
                  className={`self-stretch my-auto text-xl font-bold ${
                    isDarkBackground ? 'text-white' : 'text-black'
                  }`}
                >
                  Jhoni
                </h5>
              </UnstyledLink>
            </div>

            <div className='flex flex-row justify-between items-center gap-6 xl:gap-8 2xl:gap-10'>
              {navigationItems.map(({ text, href }) => (
                <UnstyledLink
                  key={text}
                  href={href}
                  className={`font-bold text-lg hover:text-gray-500 ${
                    isDarkBackground ? 'text-white' : 'text-black'
                  }`}
                >
                  <h5 className='self-stretch my-auto text-xl font-bold'>
                    {text}
                  </h5>
                </UnstyledLink>
              ))}
            </div>

            <div className='flex items-center'>
              <Button
                className={`gap-3 ${
                  isDarkBackground
                    ? 'bg-white border-black text-black'
                    : 'bg-black text-white border-white'
                } hover:bg-gray-800 p-3 focus-visible:outline-none`}
                variant='outline'
                onClick={handleOpenResume}
              >
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

export function Footer() {
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
            <h6 className='font-semibold text-right'>
              &#169; {new Date().getFullYear()} Jhoni
            </h6>
          </div>
        </div>
      </div>
    </footer>
  );
}
