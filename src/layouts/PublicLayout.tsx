import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

const PublicLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-[#E9E6DD]">
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
