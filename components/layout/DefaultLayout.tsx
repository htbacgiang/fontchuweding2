import { FC, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../header/Navbar';

const GoogleAnalytics = dynamic(() => import('../common/GoogleAnalytics'), { ssr: false });

interface Props {
  title?: string;
  desc?: string;
  thumbnail?: string;
  children: ReactNode;
}

const DefaultLayout: FC<Props> = ({ children }): JSX.Element => {
  return (
    <>
      <div className="min-h-screen bg-primary dark:bg-primary-dark transition">
        <Navbar />
        <GoogleAnalytics />
        <div className="mx-auto max-w-full">{children}</div>
      </div>
    </>
  );
};

export default DefaultLayout;