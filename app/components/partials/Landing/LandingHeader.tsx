import { useContext, useState } from "react";
import { useNavigate } from "@remix-run/react";
import {
  AuthContext,
  CategoryContext,
  LoginContext,
  SearchContext,
} from "../../forms/Landing";
import { useCustomerAuth } from "~/contexts/CustomerAuthContext";
import { useCart } from "~/contexts/CartContext";
import { PersistentCartDrawer } from "~/components/partials/Cart/PersistentCartDrawer";

interface LandingHeaderProps {
  onClick: () => void;
  isSticky?: boolean;
}

export const LandingHeader = ({
  onClick,
  isSticky = false,
}: LandingHeaderProps) => {
  const { isLoginMode } = useContext(LoginContext);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const { setAuthModalOpen } = useContext(AuthContext);
  const { setActiveCategory } = useContext(CategoryContext);
  const { customer, isAuthenticated, logout } = useCustomerAuth();
  const { cartCount } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigateToDashboard = (tab: string) => {
    setShowUserMenu(false);
    navigate(`/dashboard?tab=${tab}`);
  };

  return (
    <>
      <header
        className={`transition-all duration-300 ${
          isSticky
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-pink-100"
            : "bg-pink-50 shadow-md"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-pink-600">
              GlowBeauty
            </h1>
            <nav className="space-x-6 flex">
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
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-sm hover:text-pink-600 transition"
                  >
                    <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center">
                      {customer?.name.charAt(0).toUpperCase()}
                    </div>
                    <span>Hi, {customer?.name.split(" ")[0]}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        showUserMenu ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{customer?.name}</div>
                        <div className="text-gray-500">{customer?.email}</div>
                      </div>
                      <button
                        onClick={() => handleNavigateToDashboard("profile")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Profile
                      </button>
                      <button
                        onClick={() => handleNavigateToDashboard("orders")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Orders
                      </button>
                      <button
                        onClick={() => handleNavigateToDashboard("tickets")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Support
                      </button>
                      <button
                        onClick={() => handleNavigateToDashboard("history")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Purchase History
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="text-sm hover:text-pink-600 transition"
                >
                  {isLoginMode ? "Login" : "Register"}
                </button>
              )}
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  console.log("Search input changed:", e.target.value);
                  setSearchQuery(e.target.value);
                }}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 w-64 text-gray-900 bg-white placeholder-gray-500"
              />
              <button
                aria-label="View Cart"
                onClick={() => setIsCartOpen(true)}
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
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex justify-between items-center mb-3">
              <h1 className="text-xl font-bold text-pink-600">GlowBeauty</h1>
              <div className="flex items-center space-x-2">
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-1 text-sm hover:text-pink-600 transition px-2 py-1"
                    >
                      <div className="w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-xs">
                        {customer?.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:inline">
                        {customer?.name.split(" ")[0]}
                      </span>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                          <div className="font-medium">{customer?.name}</div>
                          <div className="text-gray-500 text-xs">
                            {customer?.email}
                          </div>
                        </div>
                        <button
                          onClick={() => handleNavigateToDashboard("profile")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Profile
                        </button>
                        <button
                          onClick={() => handleNavigateToDashboard("orders")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Orders
                        </button>
                        <button
                          onClick={() => handleNavigateToDashboard("tickets")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Support
                        </button>
                        <button
                          onClick={() => handleNavigateToDashboard("history")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Purchase History
                        </button>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="text-sm hover:text-pink-600 transition px-2 py-1"
                  >
                    {isLoginMode ? "Login" : "Register"}
                  </button>
                )}
                <button
                  aria-label="View Cart"
                  onClick={() => setIsCartOpen(true)}
                  className="relative hover:text-pink-600 transition p-1"
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
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Search Bar - Full Width on Mobile */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  console.log("Search input changed:", e.target.value);
                  setSearchQuery(e.target.value);
                }}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm text-gray-900 bg-white placeholder-gray-500"
              />
            </div>

            {/* Mobile Navigation */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className="px-3 py-1 text-sm bg-pink-100 hover:bg-pink-200 rounded-full transition"
              >
                All
              </button>
              <button
                onClick={() => setActiveCategory("skincare")}
                className="px-3 py-1 text-sm bg-pink-100 hover:bg-pink-200 rounded-full transition"
              >
                Skincare
              </button>
              <button
                onClick={() => setActiveCategory("makeup")}
                className="px-3 py-1 text-sm bg-pink-100 hover:bg-pink-200 rounded-full transition"
              >
                Makeup
              </button>
              <button
                onClick={() => setActiveCategory("nails")}
                className="px-3 py-1 text-sm bg-pink-100 hover:bg-pink-200 rounded-full transition"
              >
                Nails
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <PersistentCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};
