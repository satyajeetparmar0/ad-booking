import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: 'https://images.pexels.com/photos/7870693/pexels-photo-7870693.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    heading: 'Easiest and Fastest Ad Booking',
    subheading: 'at the Lowest Price',
    description: 'Book your Newspaper display ads in any regional or National Newspaper, Instantly!',
  },
  {
    image: 'https://images.pexels.com/photos/6476185/pexels-photo-6476185.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    heading: '1000+ Newspapers Across India',
    subheading: 'Pan-India Coverage',
    description: 'Publish your classified, display, or matrimonial ads in any major newspaper with just a few clicks.',
  },
  {
    image: 'https://images.pexels.com/photos/7877215/pexels-photo-7877215.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    heading: 'Same Day Publishing',
    subheading: 'Best Prices Guaranteed',
    description: 'Transparent pricing with no hidden charges. Get your ad published within 24 hours.',
  },
];

const HeroCarousel = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-[420px] sm:h-[500px] lg:h-[560px] overflow-hidden" data-testid="hero-carousel">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: current === index ? 1 : 0, zIndex: current === index ? 1 : 0 }}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.heading}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            {/* Overlay gradient - warm beige/cream like the reference */}
            <div className="absolute inset-0 bg-gradient-to-l from-[#f5e6d3]/95 via-[#f5e6d3]/75 to-transparent"></div>
          </div>

          {/* Content - right-aligned like reference */}
          <div className="relative h-full flex items-center z-10">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
              <div className="ml-auto max-w-xl lg:max-w-2xl text-right">
                <h2
                  className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 leading-tight"
                  style={{ textShadow: '0 1px 2px rgba(255,255,255,0.3)' }}
                >
                  {slide.heading}
                </h2>
                <h3
                  className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight"
                  style={{ textShadow: '0 1px 2px rgba(255,255,255,0.3)' }}
                >
                  {slide.subheading}
                </h3>
                <p className="text-base sm:text-lg text-gray-700 mb-8 leading-relaxed">
                  {slide.description}
                </p>
                <button
                  onClick={() => navigate('/book-now')}
                  className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm sm:text-base px-8 py-3 tracking-wider transition-colors duration-200 uppercase"
                  data-testid="carousel-book-now-btn"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
        data-testid="carousel-prev-btn"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-16 sm:right-20 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
        data-testid="carousel-next-btn"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index ? 'bg-blue-500 w-8' : 'bg-white/70 hover:bg-white'
            }`}
            data-testid={`carousel-dot-${index}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
