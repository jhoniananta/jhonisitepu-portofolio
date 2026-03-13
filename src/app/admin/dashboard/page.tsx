'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalProjects: number;
  totalExperiences: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalExperiences: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, experiencesRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/experiences'),
        ]);

        const projects = await projectsRes.json();
        const experiences = await experiencesRes.json();

        setStats({
          totalProjects: Array.isArray(projects) ? projects.length : 0,
          totalExperiences: Array.isArray(experiences) ? experiences.length : 0,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: (
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
            d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
          />
        </svg>
      ),
    },
    {
      title: 'Total Experiences',
      value: stats.totalExperiences,
      icon: (
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
            d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
          />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-white'>Dashboard</h1>
        <p className='text-gray-400 mt-1'>Overview of your portfolio content</p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        {statCards.map((card) => (
          <div
            key={card.title}
            className='relative overflow-hidden rounded border border-white/20 bg-black p-6'
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm font-medium'>
                  {card.title}
                </p>
                <p className='text-4xl font-bold text-white mt-2'>
                  {loading ? (
                    <span className='inline-block w-12 h-10 bg-white/10 rounded animate-pulse' />
                  ) : (
                    card.value
                  )}
                </p>
              </div>
              <div className='w-12 h-12 rounded border border-white/20 bg-transparent flex items-center justify-center text-white'>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className='rounded border border-white/20 bg-black p-6'>
        <h2 className='text-lg font-semibold text-white mb-4'>Quick Actions</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <a
            href='/admin/projects'
            className='flex items-center gap-3 p-4 rounded bg-transparent hover:bg-white/5 border border-white/20 transition-colors duration-200 group'
          >
            <div className='w-10 h-10 rounded border border-white/20 flex items-center justify-center text-white'>
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
                  d='M12 4v16m8-8H4'
                />
              </svg>
            </div>
            <div>
              <p className='text-white font-medium text-sm'>Manage Projects</p>
              <p className='text-gray-500 text-xs'>Add, edit, or remove</p>
            </div>
          </a>
          <a
            href='/admin/experiences'
            className='flex items-center gap-3 p-4 rounded bg-transparent hover:bg-white/5 border border-white/20 transition-colors duration-200 group'
          >
            <div className='w-10 h-10 rounded border border-white/20 flex items-center justify-center text-white'>
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
                  d='M12 4v16m8-8H4'
                />
              </svg>
            </div>
            <div>
              <p className='text-white font-medium text-sm'>
                Manage Experiences
              </p>
              <p className='text-gray-500 text-xs'>Add, edit, or remove</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
