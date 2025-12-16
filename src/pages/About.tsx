import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Services from "../components/Services";

import {
  Award,
  Rocket,
  Building2,
  Users,
  ShieldCheck,
  Star,
  Car,
  HeartHandshake,
} from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="bg-[#E9E6DD]">
      {/* Navbar */}
      <Navbar />

      {/* HERO */}
      <section className="bg-[#001524] text-[#E9E6DD] py-24 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">About VansKE Car Rental</h1>
          <p className="text-[#C4AD9D] text-lg max-w-3xl mx-auto">
            VansKE is redefining the luxury and performance car rental
            experience in Kenya through innovation, trust, and exceptional
            customer service. Our mission is simple — elevate every journey.
          </p>
        </div>
      </section>

      {/* COMPANY STORY */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-[#001524] mb-6">
              Who We Are
            </h2>
            <p className="text-[#445048] leading-relaxed mb-6">
              VansKE is a premium car rental company built for individuals who
              appreciate excellence, performance, and reliability. We offer an
              exclusive fleet of luxury vehicles tailored for business travel,
              special occasions, content creation, road trips, and unforgettable
              experiences.
            </p>
            <p className="text-[#445048] leading-relaxed">
              With a team committed to transparency, safety, and originality, we
              combine technology with world-class service to ensure every client
              enjoys a seamless, fully personalized rental experience from
              start to finish.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1300"
              className="w-full h-full object-cover"
              alt="Luxury Cars"
            />
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-[#001524] py-20 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#E9E6DD] mb-10">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* VALUE ITEM */}
            <div className="bg-[#445048] rounded-2xl p-8 hover:bg-[#027480] transition-colors">
              <ShieldCheck className="text-[#F57251] w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#E9E6DD] mb-3">
                Trust & Safety
              </h3>
              <p className="text-[#C4AD9D]">
                Every vehicle is well-maintained, insured, and quality-checked.
              </p>
            </div>

            <div className="bg-[#445048] rounded-2xl p-8 hover:bg-[#027480] transition-colors">
              <Rocket className="text-[#F57251] w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#E9E6DD] mb-3">
                Innovation
              </h3>
              <p className="text-[#C4AD9D]">
                Technology-driven processes for faster, smarter rentals.
              </p>
            </div>

            <div className="bg-[#445048] rounded-2xl p-8 hover:bg-[#027480] transition-colors">
              <Users className="text-[#F57251] w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#E9E6DD] mb-3">
                Customer Focus
              </h3>
              <p className="text-[#C4AD9D]">
                Every decision is guided by client needs and convenience.
              </p>
            </div>

            <div className="bg-[#445048] rounded-2xl p-8 hover:bg-[#027480] transition-colors">
              <Award className="text-[#F57251] w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#E9E6DD] mb-3">
                Excellence
              </h3>
              <p className="text-[#C4AD9D]">
                From car quality to support — we deliver nothing short of top-tier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY WE EXIST */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-[#001524] mb-4">
            Why We Exist
          </h2>
          <p className="text-[#445048] text-lg leading-relaxed">
            The Kenyan luxury rental market is growing — but customers still
            struggle with reliability, inconsistent pricing, and low-quality
            service. VansKE was created to fill that gap with premium vehicles,
            transparent pricing, and modern, customer-first processes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-[#E9E6DD] p-8 rounded-2xl shadow-xl">
            <Car className="text-[#027480] w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold text-[#001524] mb-2">
              Luxury Fleet
            </h3>
            <p className="text-[#445048]">
              Sports cars. SUVs. Executive sedans. Every car has a story — and
              we let you drive it.
            </p>
          </div>

          <div className="bg-[#E9E6DD] p-8 rounded-2xl shadow-xl">
            <HeartHandshake className="text-[#027480] w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold text-[#001524] mb-2">
              Exceptional Service
            </h3>
            <p className="text-[#445048]">
              A friendly team available 24/7 to support you from booking to return.
            </p>
          </div>

          <div className="bg-[#E9E6DD] p-8 rounded-2xl shadow-xl">
            <Building2 className="text-[#027480] w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold text-[#001524] mb-2">
              Professional Standards
            </h3>
            <p className="text-[#445048]">
              Transparent, secure, and reliable service trusted by hundreds of clients.
            </p>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="bg-[#001524] py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-[#E9E6DD] text-center mb-14">
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* REVIEW ITEM */}
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="bg-[#445048] rounded-2xl p-8 shadow-lg hover:bg-[#027480] transition-all"
              >
                <Star className="text-[#F57251] w-8 h-8 mb-4" />
                <p className="text-[#E9E6DD] mb-4 leading-relaxed">
                  “VansKE exceeded my expectations. The car was spotless,
                  powerful, and the service was world-class. Highly recommend.”
                </p>
                <h4 className="text-[#E9E6DD] font-semibold">— Satisfied Client</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <Services />

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default About;
