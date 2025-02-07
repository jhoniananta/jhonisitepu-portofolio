import { Footer, Navbar } from '@/layouts/NavFooter';

type LayoutProps = {
  children: React.ReactNode;
  withFooter?: boolean;
  withNavbar?: boolean;
};

export default function Layout({
  children,
  withFooter,
  withNavbar,
}: LayoutProps) {
  return (
    <main>
      {withNavbar && <Navbar />}
      {children}
      {withFooter && <Footer />}
    </main>
  );
}
