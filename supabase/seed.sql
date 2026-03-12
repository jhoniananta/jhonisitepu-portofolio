-- =============================================
-- Seed data for portfolio database
-- Run this in the Supabase SQL Editor AFTER migration.sql
-- =============================================

-- Seed experiences
INSERT INTO public.experiences (company_logo, position, company, duration, description, sort_order) VALUES
(
  '/images/skill/peduly_logo.png',
  'Backend Developer Intern',
  'Peduly',
  'July 2025 - Now',
  'At Peduly Indonesia, I developed and maintained the Laravel backend for two full scale web projects, integrating the Midtrans payment gateway, designing RESTful APIs, and managing database migrations and authentication. I also oversaw complete backend deployments on cPanel, handling environment configuration, domain and SSL setup, and performance monitoring. Additionally, I collaborated closely with frontend teams to integrate APIs and optimize data workflows for seamless user experiences.',
  1
),
(
  '/images/skill/logo-betau.jpg',
  'Software Engineer',
  'Beta U Software House',
  'March 2025 - Now',
  'As a Software Engineer at Beta U Software House, I have successfully handled multiple projects as both a Frontend Developer and Mobile Developer. In my role, I have managed approximately 3 significant projects, demonstrating versatility across different technology stacks. For web development, I utilized modern technologies including React.js, Next.js, and TypeScript to build responsive and dynamic web applications. Additionally, I expanded my expertise to mobile development using Flutter, creating cross-platform mobile applications with smooth user experiences. My responsibilities included implementing UI/UX designs, integrating APIs, and ensuring optimal performance across all platforms. This experience has strengthened my ability to work with diverse technologies while maintaining high code quality and meeting project deadlines.',
  2
),
(
  '/images/skill/LogoISEWhite.png',
  'Lead Frontend Developer',
  'Information Systems Expo',
  'Jul 2024 - Nov 2024',
  'As the Lead Front End Developer at the Information Systems Expo (ISE!) 2024 in Surabaya, Indonesia, I spearheaded a team of 13 frontend developers, ensuring the delivery of high-quality code through rigorous quality assurance processes. I conducted bi-weekly design reviews for two junior developers, offering constructive feedback and mentorship to align their work with established coding principles and best practices. Collaborating closely with a team of 20 developers, I played a pivotal role in seamlessly integrating the website''s UI/UX with back-end components, ensuring a smooth and efficient user experience. Leveraging cutting-edge technologies such as Next.js, TypeScript, Tailwind CSS, and React.js, I led the development of a robust and visually appealing frontend. This experience not only honed my technical expertise but also strengthened my leadership and collaboration skills, enabling me to deliver a successful project that met both user and business needs.',
  3
);

-- Seed projects
INSERT INTO public.projects (title, description, image_url, link_url, tech_stack, sort_order) VALUES
(
  'Eazy Chise',
  'EazyChise is a one-stop PWA marketplace that lets entrepreneurs discover, compare, and secure franchise opportunities in just a few taps. I built its frontend using Next.js, React, TypeScript, and Tailwind CSS implementing core PWA features like installable desktop/mobile support, offline caching with Workbox, and a Web App Manifest for blazing fast cross platform performance. I also developed the home screen and franchise detail pages with a smart search input, enabling seamless, mobile-first exploration of franchise listings.',
  '/images/project/eazy_chise_project.png',
  'https://eazychise.betau.asia/',
  ARRAY['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'PWA'],
  1
),
(
  'Petsaurus',
  'Built with Next.js and Progressive Web App (PWA) technologies, Petsaurus is a comprehensive platform developed as part of the Program Kreativitas Mahasiswa entrepreneurship program. As the CTO, I led the development of this application that connects pet owners, pet shops, and pet clinics. The project involved overseeing technical aspects, managing the development team, and ensuring timely delivery. This experience enhanced my skills in technical leadership and project management while implementing modern web technologies.',
  '/images/project/petsaurus_project.png',
  'https://petsaurus.id/',
  ARRAY['Next.js', 'PWA', 'TypeScript', 'React'],
  2
),
(
  'Depa''s Infection Website',
  'Developed using Next.js and TypeScript, this project involved creating comprehensive user and admin dashboards for the Depa''s Infection event organized by FKG UGM. I implemented responsive interfaces, integrated dynamic dashboard features, and established seamless communication between user and admin panels. Working closely with the design team, I transformed UI/UX prototypes into functional interfaces while handling API integration and data management to ensure optimal performance and user experience.',
  '/images/project/depas-project.png',
  'https://depasinfection.com/',
  ARRAY['Next.js', 'TypeScript', 'React', 'React Query', 'Zustand'],
  3
),
(
  'Todo List DevOps App',
  'Crafted with React.js for the frontend and Express.js for the backend, this project demonstrates a complete DevOps implementation. The application was containerized using Docker and deployed on Google Cloud Platform''s App Engine. As both Full-Stack Developer and Project Manager, I established CI/CD pipelines, integrated Google Cloud monitoring tools, and led a development team. This project showcases my expertise in full-stack development, cloud deployment, and project management.',
  '/images/project/todo_devops_project.png',
  'https://github.com/jhoniananta/todo-apps-devops',
  ARRAY['React.js', 'Express.js', 'Docker', 'Google Cloud', 'CI/CD'],
  4
),
(
  'Shopify: Shopping List App',
  'Developed using Flutter and Firebase, Shopify is a responsive shopping list application that enables users to create and manage their shopping lists in real-time. I implemented Firebase services including Firestore for data storage and authentication for user management. The app features a modern UI/UX design with real-time updates and cross-device synchronization, demonstrating my expertise in mobile app development and cloud integration.',
  '/images/project/shoppingList_project.png',
  'https://github.com/jhoniananta/Shopify-Shopping-List-App',
  ARRAY['Flutter', 'Firebase', 'Firestore'],
  5
),
(
  'Information Systems Expo 2024 Website',
  'Built with Next.js and TypeScript, the ISE 2024 website represents a significant leadership achievement where I managed a team of 12 developers. The project involved implementing modern web technologies to create an engaging and responsive platform. As Lead Frontend Developer, I focused on maintaining code quality, guiding the development process, and collaborating with project managers to ensure timely delivery while fostering a productive team environment.',
  '/images/project/ise2024_project.png',
  'http://ise-its.com/',
  ARRAY['Next.js', 'TypeScript', 'React'],
  6
),
(
  'Petrolida 2024 Website',
  'Developed using Next.js and TypeScript, the Petrolida 2024 website showcases my expertise in frontend development. Working in a team of four, I transformed design prototypes into responsive and interactive web interfaces. The project involved implementing UI components, integrating backend services, and ensuring optimal performance across different devices. This experience highlights my ability to collaborate effectively while delivering high-quality web solutions.',
  '/images/project/petrolida2024_project.png',
  'https://petrolida-frontend.vercel.app/',
  ARRAY['Next.js', 'TypeScript', 'React'],
  7
);
