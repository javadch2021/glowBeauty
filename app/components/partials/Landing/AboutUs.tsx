import React from "react";

// About Us Configuration - Easy to customize
const ABOUT_CONFIG = {
  title: "About GlowBeauty",
  subtitle: "Your trusted partner in beauty and self-care",
  description:
    "At GlowBeauty, we believe that everyone deserves to feel confident and radiant. Founded with a passion for quality beauty products, we curate the finest skincare, makeup, and wellness items from around the world. Our mission is to empower you to discover your unique beauty while providing exceptional products that deliver real results.",
  features: [
    "Premium quality products from trusted brands",
    "Expert curation and beauty advice",
    "Sustainable and cruelty-free options",
    "Personalized beauty recommendations",
  ],
  stats: [
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Premium Products" },
    { number: "50+", label: "Beauty Brands" },
    { number: "5★", label: "Customer Rating" },
  ],
};

export const AboutUs: React.FC = () => {
  return (
    <section className="py-8 md:py-16 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Content Side */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {ABOUT_CONFIG.title}
              </h2>
              <p className="text-lg text-pink-600 font-medium mb-6">
                {ABOUT_CONFIG.subtitle}
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                {ABOUT_CONFIG.description}
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              {ABOUT_CONFIG.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-pink-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-6 md:pt-8">
              {ABOUT_CONFIG.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-pink-600 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Side */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=1000&auto=format&fit=crop"
                alt="Beauty products and skincare"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-900/20 to-transparent"></div>
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 max-w-xs">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-pink-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    Made with Love
                  </div>
                  <div className="text-xs text-gray-600">
                    Carefully curated for you
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
