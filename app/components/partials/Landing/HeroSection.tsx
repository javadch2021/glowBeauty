// Hero Section Configuration - Easy to customize
const HERO_CONFIG = {
  backgroundImage:
    "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // ← Change this URL to use your own image
  overlayOpacity: 0.4, // Dark overlay opacity (0.0 = transparent, 1.0 = completely dark)
  minHeight: "500px", // Minimum height of the hero section
  title: "Discover Your Radiance",
  subtitle:
    "Transform your beauty routine with our premium collection of skincare and cosmetics.",
  buttonText: "Shop Now",
};

export const HeroSection: React.FC = () => {
  return (
    <section
      className="relative py-12 md:py-16 lg:py-24 bg-cover bg-center bg-no-repeat flex items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, ${HERO_CONFIG.overlayOpacity}), rgba(0, 0, 0, ${HERO_CONFIG.overlayOpacity})), url('${HERO_CONFIG.backgroundImage}')`,
        minHeight: HERO_CONFIG.minHeight,
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl text-center md:text-left">
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6 text-white">
            {HERO_CONFIG.title}
          </h2>
          <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-white/90">
            {HERO_CONFIG.subtitle}
          </p>
          <button className="bg-pink-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-md hover:bg-pink-700 transition-all duration-300 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
            {HERO_CONFIG.buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};
