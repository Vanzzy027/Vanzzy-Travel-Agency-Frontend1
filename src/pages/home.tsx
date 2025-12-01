import React from 'react';
//import Header from '../components/Header';
import Hero from '../components/Hero';
import VehicleShowcase from '../components/VehicleShowcase';
import Services from '../components/Services';
import Stats from '../components/Stats';
import Navbar from '../components/Navbar';
const Home: React.FC = () => {
  return (
    <main>
      <Navbar />
      <Hero />
      <VehicleShowcase />
      <Services />
      <Stats />
      {/* Footer intentionally removed here to prevent duplicate footer rendering */}
    </main>
  );
};

export default Home;

