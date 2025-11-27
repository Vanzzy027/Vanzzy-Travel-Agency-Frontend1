// components/Stats.tsx
import React from 'react';

const Stats: React.FC = () => {
  return (
    <section className="py-16 bg-[#E9E6DD]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-[#001524] mb-2">50+</div>
            <div className="text-[#445048] font-semibold">Premium Vehicles</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#027480] mb-2">1000+</div>
            <div className="text-[#445048] font-semibold">Happy Customers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#F57251] mb-2">24/7</div>
            <div className="text-[#445048] font-semibold">Support</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#445048] mb-2">5★</div>
            <div className="text-[#445048] font-semibold">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;