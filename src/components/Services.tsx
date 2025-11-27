// components/Services.tsx
import React from 'react';

const services = [
  {
    icon: "🚗",
    title: "Wide Selection",
    description: "Choose from our extensive fleet of luxury and performance vehicles"
  },
  {
    icon: "⏰",
    title: "24/7 Support",
    description: "Round-the-clock customer service and roadside assistance"
  },
  {
    icon: "💰",
    title: "Best Rates",
    description: "Competitive pricing with no hidden fees"
  },
  {
    icon: "🛡️",
    title: "Full Insurance",
    description: "Comprehensive coverage for complete peace of mind"
  }
];

const Services: React.FC = () => {
  return (
    <section className="py-16 bg-[#001524]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#E9E6DD] mb-4">Why Choose VansKE?</h2>
          <p className="text-[#C4AD9D] text-lg max-w-2xl mx-auto">
            Experience the difference with our premium car rental services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="text-center p-6 bg-[#445048] rounded-2xl hover:bg-[#027480] transition-colors duration-300">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-[#E9E6DD] mb-3">{service.title}</h3>
              <p className="text-[#C4AD9D]">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;