import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Download } from 'lucide-react';
import Link from 'next/link';

import Button from '@/components/buttons/Button';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
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
        <li className='text-3xl hover:text-blue-900 hover:font-semibold'>
          <Link href='/'>Home</Link>
        </li>
        <li className='text-3xl hover:text-blue-900 hover:font-semibold'>
          <Link href='/'>Skills</Link>
        </li>
        <li className='text-3xl hover:text-blue-900 hover:font-semibold'>
          <Link href='/'>Project</Link>
        </li>
        <li className='text-3xl hover:text-blue-900 hover:font-semibold'>
          <Link href='/'>ContactMe</Link>
        </li>
        <Button className='gap-2 bg-black hover:bg-gray-800'>
          <Download />
          <p className='text-3xl'>Resume</p>
        </Button>
        {/* Add other navigation links */}
      </ul>
    </div>
  );
}
