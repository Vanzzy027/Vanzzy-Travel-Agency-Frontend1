// components/Services.tsx
import React from "react";
import { Car, Clock, BadgeDollarSign, ShieldCheck } from "lucide-react";

const services = [
  {
    icon: Car,
    title: "Wide Selection",
    description:
      "Choose from our extensive fleet of luxury and performance vehicles",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer service and roadside assistance",
  },
  {
    icon: BadgeDollarSign,
    title: "Best Rates",
    description: "Competitive pricing with no hidden fees",
  },
  {
    icon: ShieldCheck,
    title: "Full Insurance",
    description: "Comprehensive coverage for complete peace of mind",
  },
];

const Services: React.FC = () => {
  return (
    <section className="py-16 bg-[#001524]">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#E9E6DD] mb-4">
            Why Choose VansKE?
          </h2>
          <p className="text-[#C4AD9D] text-lg max-w-2xl mx-auto">
            Experience the difference with our premium car rental services
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="group text-center p-6 bg-[#445048] rounded-2xl hover:bg-[#027480] transition-all duration-300"
              >
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-[#001524] group-hover:bg-[#E9E6DD] transition-colors">
                    <Icon
                      size={28}
                      className="text-[#F57251] group-hover:text-[#027480] transition-colors"
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#E9E6DD] mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-[#C4AD9D] text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
