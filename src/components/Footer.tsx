// components/Footer.tsx
import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#001524] text-[#E9E6DD]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#027480] flex items-center justify-center flex-shrink-0">
                <span className="text-[#E9E6DD] font-bold text-lg md:text-xl">
                  V
                </span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold">
                  VansKE Car Rental
                </h2>
                <p className="text-[#C4AD9D] text-sm">Luxury & Performance</p>
              </div>
            </div>

            <p className="text-[#C4AD9D] text-sm mb-4 max-w-md">
              Premium car rentals with exceptional service and competitive
              rates.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-3">
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 md:w-10 md:h-10 bg-[#445048] rounded-full flex items-center justify-center hover:bg-[#027480] transition-colors"
              >
                <Facebook size={18} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 md:w-10 md:h-10 bg-[#445048] rounded-full flex items-center justify-center hover:bg-[#027480] transition-colors"
              >
                <Instagram size={18} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="w-8 h-8 md:w-10 md:h-10 bg-[#445048] rounded-full flex items-center justify-center hover:bg-[#027480] transition-colors"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base md:text-lg font-bold mb-4 text-[#F57251]">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["Home", "Our Fleet", "Pricing", "About Us"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[#C4AD9D] text-sm md:text-base hover:text-[#F57251] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base md:text-lg font-bold mb-4 text-[#F57251]">
              Contact
            </h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Phone className="text-[#027480] mt-1" size={16} />
                <div>
                  <p className="text-[#E9E6DD] text-sm font-semibold">Phone</p>
                  <p className="text-[#C4AD9D] text-xs">+254 112 178 578</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Mail className="text-[#027480] mt-1" size={16} />
                <div>
                  <p className="text-[#E9E6DD] text-sm font-semibold">Email</p>
                  <p className="text-[#C4AD9D] text-xs">
                    vanzzyspinet@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <MapPin className="text-[#027480] mt-1" size={16} />
                <div>
                  <p className="text-[#E9E6DD] text-sm font-semibold">
                    Location
                  </p>
                  <p className="text-[#C4AD9D] text-xs">Nairobi, Kenya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#445048]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-[#C4AD9D] text-xs sm:text-sm text-center sm:text-left">
              © {new Date().getFullYear()} VansKE Car Rental. All rights
              reserved.
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm">
              <a href="#" className="text-[#C4AD9D] hover:text-[#F57251]">
                Privacy
              </a>
              <a href="#" className="text-[#C4AD9D] hover:text-[#F57251]">
                Terms
              </a>
              <a href="#" className="text-[#C4AD9D] hover:text-[#F57251]">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Call Button */}
      <div className="fixed bottom-4 right-4 md:hidden">
        <a
          href="tel:+254112178578"
          aria-label="Call VansKE"
          className="bg-[#F57251] text-[#E9E6DD] w-12 h-12 rounded-full shadow-lg hover:bg-[#e56546] transition-colors flex items-center justify-center"
        >
          <Phone size={20} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
