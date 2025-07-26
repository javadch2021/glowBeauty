/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { createContext, useState, useEffect } from "react";
import { useTranslations } from "~/lib/i18n/LanguageContext";

// Import new structured components
import { HeroSection } from "../../structures/sections/HeroSection";
import { HeaderSection } from "../../structures/sections/HeaderSection";
import { AboutSection } from "../../structures/sections/AboutSection";

// Import existing components (to be migrated later)
import LandingFooter from "../../partials/Landing/LandingFooter";
import { LoginTab } from "../../partials/Landing/LoginTab";
import { RegisterTab } from "../../partials/Landing/RegisterTab";
import { LoginRegisterLabels } from "../../partials/Landing/LoginRegisterForm";
import { CartDrawer } from "../../partials/Landing/CartDrawer";
import { ProductGrid } from "../../partials/Landing/ProductGrid";
import { AboutUs } from "../../partials/Landing/AboutUs";
import { Benefits } from "../../partials/Landing/Benefits";
import { CategorySliders } from "../../partials/Landing/CategorySliders";

// Import types
import { Product, CartItem } from "../../types/beauty";

// Context definitions (will be moved to separate files later)
export const AuthContext = createContext<{
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
}>({ authModalOpen: false, setAuthModalOpen: () => {} });

export const CategoryContext = createContext<{
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}>({ activeCategory: "all", setActiveCategory: () => {} });

export const SearchContext = createContext<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}>({ searchQuery: "", setSearchQuery: () => {} });

export const LoginContext = createContext<{
  isLoginMode: boolean;
  setIsLoginMode: (mode: boolean) => void;
}>({ isLoginMode: true, setIsLoginMode: () => {} });

export const CartContext = createContext<{
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
}>({ cart: [], setCart: () => {} });

export const ServerProductsContext = createContext<{
  products: Product[];
}>({ products: [] });

interface LandingPageProps {
  products: Product[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  products: serverProducts,
}) => {
  const t = useTranslations();

  // State management
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  // Scroll detection for sticky header
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 400;
      setIsHeaderSticky(scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cart management
  const openCart = () => {
    setIsCartVisible(true);
    setTimeout(() => setIsCartOpen(true), 10);
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setTimeout(() => setIsCartVisible(false), 200);
  };

  const removeItem = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <AuthContext.Provider value={{ authModalOpen, setAuthModalOpen }}>
        <CategoryContext.Provider value={{ activeCategory, setActiveCategory }}>
          <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
            <LoginContext.Provider value={{ isLoginMode, setIsLoginMode }}>
              <CartContext.Provider value={{ cart, setCart }}>
                {/* Hero Section */}
                <HeroSection />

                {/* Header positioned at bottom of hero, sticks to top when scrolling */}
                <div className="sticky top-0 z-50">
                  <HeaderSection
                    onCartClick={openCart}
                    totalItems={totalItems}
                    isSticky={isHeaderSticky}
                  />
                </div>

                {/* About Us Section */}
                <AboutSection />

                {/* Benefits Section */}
                <Benefits />

                {/* Category Sliders */}
                <ServerProductsContext.Provider
                  value={{ products: serverProducts || [] }}
                >
                  <CategorySliders
                    products={serverProducts || []}
                    onProductClick={(product) => {
                      console.log("Product clicked from slider:", product);
                    }}
                  />
                </ServerProductsContext.Provider>

                {/* Product Grid */}
                <section id="products-section" className="py-16 bg-gray-50">
                  <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                      {t.nav.all} {t.admin.products}
                    </h2>
                    <ProductGrid
                      products={serverProducts || []}
                      onProductClick={(product) => {
                        console.log("Product clicked from grid:", product);
                      }}
                    />
                  </div>
                </section>

                {/* Footer */}
                <LandingFooter />

                {/* Cart Drawer */}
                {isCartVisible && (
                  <CartDrawer
                    isOpen={isCartOpen}
                    onClose={closeCart}
                    cart={cart}
                    totalPrice={totalPrice}
                    removeItem={removeItem}
                  />
                )}

                {/* Auth Modal */}
                {authModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">
                          {isLoginMode ? t.auth.login : t.auth.register}
                        </h2>
                        <button
                          onClick={() => setAuthModalOpen(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <LoginRegisterLabels />

                      {isLoginMode ? (
                        <LoginTab onClose={() => setAuthModalOpen(false)} />
                      ) : (
                        <RegisterTab onClose={() => setAuthModalOpen(false)} />
                      )}
                    </div>
                  </div>
                )}
              </CartContext.Provider>
            </LoginContext.Provider>
          </SearchContext.Provider>
        </CategoryContext.Provider>
      </AuthContext.Provider>
    </div>
  );
};
