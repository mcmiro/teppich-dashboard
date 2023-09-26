import { ReactNode } from 'react';
import { UI } from '../components';

export interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <header>
        <UI.NavBar />
      </header>
      <main>
        <div className="px-4">{children}</div>
      </main>
    </>
  );
};

export default Layout;
