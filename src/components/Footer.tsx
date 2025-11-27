// components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#001524] text-[#E9E6DD]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#027480] flex items-center justify-center">
                <span className="text-[#E9E6DD] font-bold text-xl">V</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">VansKE Car Rental</h2>
                <p className="text-[#C4AD9D]">Luxury & Performance Vehicles</p>
              </div>
            </div>
            <p className="text-[#C4AD9D] mb-6 max-w-md">
              Experience the ultimate in luxury car rentals. From sports cars to premium sedans, 
              we offer the finest vehicles with exceptional service and competitive rates.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons */}
              <a href="#" className="w-10 h-10 bg-[#445048] rounded-full flex items-center justify-center hover:bg-[#027480] transition-colors duration-200">
                <span className="text-[#E9E6DD]">📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-[#445048] rounded-full flex items-center justify-center hover:bg-[#027480] transition-colors duration-200">
                <span className="text-[#E9E6DD]">📷</span>
              </a>
              <a href="#" className="w-10 h-10 bg-[#445048] rounded-full flex items-center justify-center hover:bg-[#027480] transition-colors duration-200">
                <span className="text-[#E9E6DD]">🐦</span>
              </a>
              <a href="#" className="w-10 h-10 bg-[#445048] rounded-full flex items-center justify-center hover:bg-[#027480] transition-colors duration-200">
                <span className="text-[#E9E6DD]">💼</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-[#F57251]">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-[#C4AD9D] hover:text-[#F57251] transition-colors duration-200">Home</a></li>
              <li><a href="#" className="text-[#C4AD9D] hover:text-[#F57251] transition-colors duration-200">Our Fleet</a></li>
              <li><a href="#" className="text-[#C4AD9D] hover:text-[#F57251] transition-colors duration-200">Pricing</a></li>
              <li><a href="#" className="text-[#C4AD9D] hover:text-[#F57251] transition-colors duration-200">Locations</a></li>
              <li><a href="#" className="text-[#C4AD9D] hover:text-[#F57251] transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-[#C4AD9D] hover:text-[#F57251] transition-colors duration-200">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-[#F57251]">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-[#027480] mt-1">📍</span>
                <div>
                  <p className="text-[#E9E6DD] font-semibold">Main Office</p>
                  <p className="text-[#C4AD9D] text-sm">123 Luxury Avenue<br />Nairobi, Kenya</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#027480] mt-1">📞</span>
                <div>
                  <p className="text-[#E9E6DD] font-semibold">Phone</p>
                  <p className="text-[#C4AD9D] text-sm">+254 112178 578<br />+254 733 348 027</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#027480] mt-1">✉️</span>
                <div>
                  <p className="text-[#E9E6DD] font-semibold">Email</p>
                  <p className="text-[#C4AD9D] text-sm">info@vanske.com<br />bookings@vanske.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#027480] mt-1">🕒</span>
                <div>
                  <p className="text-[#E9E6DD] font-semibold">Business Hours</p>
                  <p className="text-[#C4AD9D] text-sm">Mon-Sun: 24/7<br />Emergency Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-[#445048]">
          <div className="text-center">
            <div className="text-2xl mb-2">🚗</div>
            <h4 className="text-[#E9E6DD] font-semibold mb-1">Wide Selection</h4>
            <p className="text-[#C4AD9D] text-sm">50+ Premium Vehicles</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🛡️</div>
            <h4 className="text-[#E9E6DD] font-semibold mb-1">Full Insurance</h4>
            <p className="text-[#C4AD9D] text-sm">Comprehensive Coverage</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">⏰</div>
            <h4 className="text-[#E9E6DD] font-semibold mb-1">24/7 Support</h4>
            <p className="text-[#C4AD9D] text-sm">Always Available</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">💰</div>
            <h4 className="text-[#E9E6DD] font-semibold mb-1">Best Rates</h4>
            <p className="text-[#C4AD9D] text-sm">No Hidden Fees</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#445048]">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-[#C4AD9D] text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} VansKE Car Rental. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center space-x-6 text-sm">
              <a href="#" className="text-[#C4AD9D] hover:text-[#F57251] transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-[#C4AD9D] hover:text-[#F57251] transition-colors duration-200">Terms of Service</a>
              <a href="#" className="text-[#C4AD9D] hover:text-[#F57251] transition-colors duration-200">Cookie Policy</a>
              <a href="#" className="text-[#C4AD9D] hover:text-[#F57251] transition-colors duration-200">Sitemap</a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button className="bg-[#F57251] text-[#E9E6DD] w-14 h-14 rounded-full shadow-lg hover:bg-[#e56546] transition-colors duration-200 flex items-center justify-center text-xl">
          📞
        </button>
      </div>
    </footer>
  );
};

export default Footer;