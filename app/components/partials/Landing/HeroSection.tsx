export const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-pink-100 to-purple-100 py-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Discover Your Radiance
          </h2>
          <p className="text-lg mb-6"></p>
          <button className="bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 transition">
            Shop Now
          </button>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img
            src=" https://placehold.co/500x400?text=Beauty+Banner"
            alt="Beauty Banner"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};
