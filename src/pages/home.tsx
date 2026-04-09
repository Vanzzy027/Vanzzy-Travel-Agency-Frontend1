import React from "react";
//import Header from '../components/Header';
import Hero from "../components/Hero";
import VehicleShowcase from "../components/VehicleShowcase";
import Services from "../components/Services";
import Stats from "../components/Stats";
import Navbar from "../components/Navbar";
//import Homecomp from "../components/homeComp";     //To be used for fleet showcase in the future

const Home: React.FC = () => {
  return (
    <main>
      <Navbar />
      <Hero />
      {/* <Homecomp /> // Placeholder for future fleet showcase component */}
      <VehicleShowcase />
      <Services />
      <Stats />
      {/* Footer intentionally removed here to prevent duplicate footer rendering */}
    </main>
  );
};

export default Home;
