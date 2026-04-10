import React from "react";
import Hero from "../components/Hero";
import VehicleShowcase from "../components/VehicleShowcase";
import Services from "../components/Services";
import Stats from "../components/Stats";
import Navbar from "../components/Navbar";

const Home: React.FC = () => {
  return (
    <main>
      <Navbar />
      <Hero />
      <VehicleShowcase />
      <Services />
      <Stats />
    </main>
  );
};

export default Home;
