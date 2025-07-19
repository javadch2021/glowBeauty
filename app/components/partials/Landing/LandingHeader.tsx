import { useContext } from "react";
import {
  AuthContext,
  CategoryContext,
  LoginContext,
  SearchContext,
} from "../../forms/Landing";

interface LandingHeaderProps {
  onClick: () => void;
  totalItems: number;
}

export const LandingHeader = ({ onClick, totalItems }: LandingHeaderProps) => {
  const { isLoginMode } = useContext(LoginContext);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const { setAuthModalOpen } = useContext(AuthContext);
  const { setActiveCategory } = useContext(CategoryContext);

  return (
    <header className="bg-pink-50 shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-pink-600">GlowBeauty</h1>
        <nav className="space-x-6 hidden md:flex">
          <button
            onClick={() => setActiveCategory("all")}
            className="hover:text-pink-600 transition"
          >
            All
          </button>
          <button
            onClick={() => setActiveCategory("skincare")}
            className="hover:text-pink-600 transition"
          >
            Skincare
          </button>
          <button
            onClick={() => setActiveCategory("makeup")}
            className="hover:text-pink-600 transition"
          >
            Makeup
          </button>
          <button
            onClick={() => setActiveCategory("nails")}
            className="hover:text-pink-600 transition"
          >
            Nails
          </button>
        </nav>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setAuthModalOpen(true)}
            className="text-sm hover:text-pink-600 transition"
          >
            {isLoginMode ? "Login" : "Register"}
          </button>
          <input
            type="text"
            placeholder="Search products, categories, and descriptions..."
            value={searchQuery}
            onChange={(e) => {
              console.log("Search input changed:", e.target.value);
              setSearchQuery(e.target.value);
            }}
            className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            aria-label="View Cart"
            onClick={onClick}
            className="relative hover:text-pink-600 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
