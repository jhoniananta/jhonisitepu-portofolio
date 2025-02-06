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
  { text: 'About Me', href: '#about' },
  { text: 'Skill', href: '#skill' },
  { text: 'Experience', href: '#experience' },
  { text: 'Project', href: '#project' },
  { text: 'Contact me', href: '#contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDarkBackground, setIsDarkBackground] = React.useState(false);

  const aboutRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      // Get the navbar element
      const navbar = document.querySelector('nav');
      if (!navbar) {
        return;
      }

      // Get the position of the navbar
      const navbarRect = navbar.getBoundingClientRect();

      // Find the element directly behind the navbar (top-center position)
      const elementBehindNavbar = document.elementFromPoint(
        window.innerWidth / 2, // X-coordinate (center of the screen)
        navbarRect.top + 105, // Y-coordinate (just below the navbar)
      );

      if (!elementBehindNavbar) {
        return;
      }

      // Traverse up the DOM tree to find the nearest <section> element
      let sectionElement: HTMLElement | null =
        elementBehindNavbar as HTMLElement;
      while (sectionElement && sectionElement.tagName !== 'SECTION') {
        sectionElement = sectionElement.parentElement;
      }

      if (sectionElement) {
        // Get the background color of the <section> element
        const backgroundColor =
          window.getComputedStyle(sectionElement).backgroundColor;
        const rgb = backgroundColor.match(/\d+/g);

        if (rgb) {
          // Calculate brightness
          const brightness =
            (parseInt(rgb[0]) * 299 +
              parseInt(rgb[1]) * 587 +
              parseInt(rgb[2]) * 114) /
            1000;
          // Update the state based on brightness
          setIsDarkBackground(brightness < 128);
        }
      } else {
        // eslint-disable-next-line no-console
        console.log('No <section> element found');
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initial check on mount
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Mobile Navbar */}
      <nav
        className={`fixed top-0 left-0 z-50 w-full shadow-md bg-transparent lg:hidden ${isDarkBackground ? 'text-white' : 'text-black'}`}
      >
        <div className='flex overflow-hidden flex-col justify-center p-4 text-xl font-bold tracking-tight leading-tight capitalize whitespace-nowrap'>
          <div className='flex overflow-hidden gap-10 justify-between items-center w-full'>
            <div>
              <UnstyledLink
                href='#hero'
                className='font-bold text-lg hover:text-gray-500 flex gap-3 items-center self-stretch my-auto'
              >
                <NextImage
                  src='/favicon/favicon-32x32.png'
                  alt='Logo'
                  width={32}
                  height={32}
                  className={`rounded-full self-stretch ${isDarkBackground ? 'filter invert' : ''}`}
                />
                <h5
                  className={`self-stretch my-auto text-xl font-bold ${isDarkBackground ? 'text-white' : 'text-black'}`}
                >
                  Jhoni
                </h5>
              </UnstyledLink>
            </div>
            {/* Hamburger icon when menu is close */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 text-2xl ${isDarkBackground ? 'text-white' : 'text-black'} ${isMenuOpen ? 'hidden' : ''}`}
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
      <nav
        className={`hidden lg:flex items-center p-4 bg-transparent shadow-md fixed top-0 left-0 w-full max-h-[104px] ${isDarkBackground ? 'text-white' : 'text-black'}`}
      >
        <div className='flex overflow-hidden xl:px-20 py-6 w-full'>
          <div className='flex px-8 flex-row justify-between items-center w-full'>
            <div>
              <UnstyledLink
                href='#hero'
                className='flex gap-3 items-center self-stretch my-auto'
              >
                <NextImage
                  src='/favicon/favicon-32x32.png'
                  alt='Logo'
                  width={32}
                  height={32}
                  className={`rounded-full self-stretch ${isDarkBackground ? 'filter invert' : ''}`}
                />
                <h5
                  className={`self-stretch my-auto text-xl font-bold ${isDarkBackground ? 'text-white' : 'text-black'}`}
                >
                  Jhoni
                </h5>
              </UnstyledLink>
            </div>
            <div className='flex flex-row justify-between items-center gap-6 xl:gap-8 2xl:gap-10'>
              {navigationItems.map(({ text, href }) => (
                <UnstyledLink
                  onClick={() =>
                    scrollBy({
                      top: aboutRef.current?.getBoundingClientRect()?.top ?? 0,
                      behavior: 'smooth',
                    })
                  }
                  key={text}
                  href={href}
                  className={`font-bold text-lg hover:text-gray-500 ${isDarkBackground ? 'text-white' : 'text-black'}`}
                >
                  <h5 className='self-stretch my-auto text-xl font-bold'>
                    {text}
                  </h5>
                </UnstyledLink>
              ))}
            </div>
            <div className='flex items-center'>
              <Button
                className={`gap-3 ${isDarkBackground ? 'bg-white text-black' : 'bg-black text-white'} hover:bg-gray-800 p-3`}
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
