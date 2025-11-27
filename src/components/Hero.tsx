import React, { useState, useEffect } from 'react';

const slides = [
  {
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    title: 'Premium Car Rental Experience',
    text: 'Discover our luxury fleet with the best rates and exceptional service for your journey.',
    cta: 'Browse Fleet'
  },
  {
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    title: 'Flexible Rental Solutions',
    text: 'Daily, weekly, or monthly rentals with 24/7 customer support and roadside assistance.',
    cta: 'View Rates'
  },
  {
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    title: 'Business & Corporate Rentals',
    text: 'Specialized solutions for corporate clients with premium vehicles and dedicated support.',
    cta: 'Business Plans'
  },
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 8000);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="relative w-full h-[70vh] min-h-[600px] overflow-hidden bg-[#001524]">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 21, 36, 0.7), rgba(0, 21, 36, 0.5)), url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-[#E9E6DD] max-w-4xl px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl text-[#C4AD9D] mb-8 leading-relaxed">
            {slides[currentSlide].text}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#F57251] text-[#E9E6DD] px-8 py-4 rounded-full font-semibold hover:bg-[#e56546] transform hover:scale-105 transition-all duration-300 shadow-lg text-lg">
              {slides[currentSlide].cta}
            </button>
            <button className="border-2 border-[#E9E6DD] text-[#E9E6DD] px-8 py-4 rounded-full font-semibold hover:bg-[#E9E6DD] hover:text-[#001524] transform hover:scale-105 transition-all duration-300 text-lg">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#001524]/80 text-[#E9E6DD] p-4 rounded-full hover:bg-[#027480] transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#001524]/80 text-[#E9E6DD] p-4 rounded-full hover:bg-[#027480] transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-[#F57251] w-8' 
                : 'bg-[#E9E6DD]/60 hover:bg-[#E9E6DD]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;