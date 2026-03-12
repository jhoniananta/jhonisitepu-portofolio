'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);
    };
    getUser();
  }, []);

  // Don't show admin layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/admin/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
          />
        </svg>
      ),
    },
    {
      name: 'Projects',
      href: '/admin/projects',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
          />
        </svg>
      ),
    },
    {
      name: 'Experiences',
      href: '/admin/experiences',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
          />
        </svg>
      ),
    },
  ];

  return (
    <div className='min-h-screen bg-black flex text-white'>
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          style: { background: '#18181b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } 
        }} 
      />
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black border-r border-white/20 transform transition-transform duration-200 lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className='flex flex-col h-full'>
          {/* Logo */}
          <div className='p-6 border-b border-white/20'>
            <Link href='/admin/dashboard' className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-white text-black rounded flex items-center justify-center'>
                <span className='font-bold text-sm'>JS</span>
              </div>
              <span className='font-semibold'>Admin Panel</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className='flex-1 p-4 space-y-1'>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className='p-4 border-t border-white/20'>
            <div className='flex items-center gap-3 px-4 py-3 rounded border border-white/20'>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium truncate'>
                  {userEmail ?? 'Loading...'}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className='w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 text-gray-400 hover:text-white rounded text-sm transition-colors duration-200'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className='flex-1 flex flex-col min-w-0'>
        {/* Top bar */}
        <header className='sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/20 px-6 py-4'>
          <div className='flex items-center justify-between'>
            <button
              onClick={() => setSidebarOpen(true)}
              className='lg:hidden text-gray-400 hover:text-white'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            </button>
            <Link
              href='/'
              className='text-sm text-gray-400 hover:text-white transition-colors'
            >
              ← Back to Site
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className='flex-1 p-6'>{children}</main>
      </div>
    </div>
  );
}
