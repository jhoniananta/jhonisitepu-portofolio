'use client';

import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Download } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Button from '@/components/buttons/Button';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const navigationItems = [
    { label: 'Skill', href: '/#skill' },
    { label: 'Experience', href: '/#experience' },
    { label: 'About Me', href: '/#about-me' },
    { label: 'Project', href: '/#project' },
    { label: 'Blog', href: pathname.startsWith('/blog/') ? '/blog' : '/#blog' },
    { label: 'Contact Me', href: '/#contact' },
  ];

  const handleOpenResume = () => {
    window.open('/resume/jhoni_resume.pdf', '_blank');
    onClose();
  };

  return (
    <div
      className={`fixed flex flex-col justify-center items-center z-10 top-0 right-0 h-full w-full bg-white text-black transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <button className='absolute right-7 top-4 p-3' onClick={onClose}>
        <FontAwesomeIcon className='text-5xl' icon={faXmark} />
      </button>

      <ul className='flex flex-col justify-center items-center space-y-4'>
        {navigationItems.map((item) => (
          <li
            key={item.label}
            className='text-3xl transition-colors hover:text-neutral-500 hover:font-semibold'
          >
            <Link href={item.href} onClick={onClose}>
              {item.label}
            </Link>
          </li>
        ))}

        <Button
          className='gap-2 bg-black hover:bg-gray-800 text-white border-white'
          onClick={handleOpenResume}
        >
          <span className='text-3xl'>Resume</span>
          <Download />
        </Button>
      </ul>
    </div>
  );
}
