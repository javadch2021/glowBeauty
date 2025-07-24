import React, { useState, useEffect } from "react";

interface SliderItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

interface SliderProps {
  title: string;
  items: SliderItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  itemsPerView?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  onItemClick?: (item: SliderItem) => void;
}

export const Slider: React.FC<SliderProps> = ({
  title,
  items,
  autoPlay = false,
  autoPlayInterval = 3000,
  showDots = true,
  showArrows = true,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 4 },
  onItemClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // Calculate total slides based on items per view for different screen sizes
  const getItemsPerView = () => {
    if (windowWidth < 768) return itemsPerView.mobile;
    if (windowWidth < 1024) return itemsPerView.tablet;
    return itemsPerView.desktop;
  };

  const currentItemsPerView = getItemsPerView();
  const totalSlides = Math.ceil(items.length / currentItemsPerView);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isHovered && items.length > itemsPerView.desktop) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [
    autoPlay,
    autoPlayInterval,
    isHovered,
    totalSlides,
    items.length,
    itemsPerView.desktop,
  ]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const handleItemClick = (item: SliderItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  if (items.length === 0) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
          <div className="text-center py-12 text-gray-500">
            No items to display
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 overflow-visible">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {title}
          </h2>

          {/* Navigation Arrows */}
          {showArrows && items.length > itemsPerView.desktop && (
            <div className="flex space-x-2">
              <button
                onClick={goToPrevious}
                className="p-2 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 transition-colors duration-200"
                aria-label="Previous slide"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="p-2 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 transition-colors duration-200"
                aria-label="Next slide"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Slider Container */}
        <div
          className="relative px-2 py-4 md:px-8 md:py-10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="w-full flex-shrink-0 px-1 md:px-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-stretch p-4">
                    {items
                      .slice(
                        slideIndex * currentItemsPerView,
                        (slideIndex + 1) * currentItemsPerView
                      )
                      .map((item) => (
                        <div
                          key={item.id}
                          className="group cursor-pointer"
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-150 overflow-hidden group-hover:-translate-y-2 h-full flex flex-col">
                            {/* Image */}
                            <div className="relative overflow-hidden flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150"></div>
                            </div>

                            {/* Content */}
                            <div className="p-4 flex flex-col flex-grow">
                              <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors duration-150">
                                {item.name}
                              </h3>
                              <div className="flex-grow mb-3">
                                <p className="text-sm text-gray-600 h-10 overflow-hidden">
                                  {item.description ||
                                    "Premium beauty product for your daily routine."}
                                </p>
                              </div>
                              <div className="flex justify-between items-center mt-auto">
                                <span className="text-lg font-bold text-pink-600">
                                  ${item.price.toFixed(2)}
                                </span>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  {item.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        {showDots && totalSlides > 1 && (
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-pink-600 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
