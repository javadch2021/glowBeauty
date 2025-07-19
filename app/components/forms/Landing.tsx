/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { createContext, useState } from "react";
import LandingFooter from "../partials/Landing/LandingFooter";
import { LoginTab } from "../partials/Landing/LoginTab";
import { RegisterTab } from "../partials/Landing/RegisterTab";
import { LoginRegisterLabels } from "../partials/Landing/LoginRegisterForm";
import { CartDrawer } from "../partials/Landing/CartDrawer";
import { LandingHeader } from "../partials/Landing/LandingHeader";
import { HeroSection } from "../partials/Landing/HeroSection";
import { ProductGrid } from "../partials/Landing/ProductGrid";

// Define types for product data
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

// Define types for customer data
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
}

// Define types for order data
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
}

export const LoginContext = createContext<{
  isLoginMode: boolean;
  setIsLoginMode: React.Dispatch<React.SetStateAction<boolean>>;
}>({ isLoginMode: true, setIsLoginMode: () => {} });

export const SearchContext = createContext<{
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}>({ searchQuery: "", setSearchQuery: () => {} });

export const AuthContext = createContext<{
  authModalOpen: boolean;
  setAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({ authModalOpen: false, setAuthModalOpen: () => {} });

export const CategoryContext = createContext<{
  activeCategory: string;
  setActiveCategory: React.Dispatch<React.SetStateAction<string>>;
}>({ activeCategory: "all", setActiveCategory: () => {} });

export const CartContext = createContext<{
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}>({ cart: [], setCart: () => {} });

export const ServerProductsContext = createContext<{
  products: Product[];
}>({ products: [] });

interface LandingProps {
  products?: Product[];
}

export const Landing: React.FC<LandingProps> = ({
  products: serverProducts,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCartVisible, setIsCartVisible] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);

  // Use server products if provided, otherwise fall back to context
  console.log(
    "Landing - Server products received:",
    serverProducts?.length || 0
  );

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };
  const openCart = () => {
    setIsCartVisible(true);
    setTimeout(() => {
      setIsCartOpen(true); // wait 1 tick to trigger transition
    }, 10);
  };

  const closeCart = () => {
    setIsCartOpen(false); // trigger transition
    setTimeout(() => {
      setIsCartVisible(false); // remove from DOM after animation
    }, 200); // match the duration in Tailwind (200ms)
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
      {/* Header */}
      <AuthContext.Provider value={{ authModalOpen, setAuthModalOpen }}>
        <CategoryContext.Provider value={{ activeCategory, setActiveCategory }}>
          <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
            <LoginContext.Provider value={{ isLoginMode, setIsLoginMode }}>
              <LandingHeader onClick={openCart} totalItems={totalItems} />
            </LoginContext.Provider>

            {/* Hero Section */}
            <HeroSection />

            {/* Product Grid */}
            <ServerProductsContext.Provider
              value={{ products: serverProducts || [] }}
            >
              <CartContext.Provider value={{ cart, setCart }}>
                <ProductGrid />
              </CartContext.Provider>
            </ServerProductsContext.Provider>
          </SearchContext.Provider>
        </CategoryContext.Provider>
      </AuthContext.Provider>

      <LandingFooter />

      {/* Cart Drawer */}
      {isCartVisible && (
        <CartDrawer
          cart={cart}
          isCartOpen={isCartOpen}
          closeCart={closeCart}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
          totalPrice={totalPrice}
        />
      )}

      {/* Auth Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fadeIn">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
            <div className="mb-6">
              <div className="relative flex justify-center gap-12">
                {/* Login Tab */}
                <LoginContext.Provider value={{ isLoginMode, setIsLoginMode }}>
                  <LoginTab />
                </LoginContext.Provider>

                {/* Register Tab */}
                <LoginContext.Provider value={{ isLoginMode, setIsLoginMode }}>
                  <RegisterTab />
                </LoginContext.Provider>

                {/* Sliding underline */}
                <div
                  className="absolute bottom-0 h-0.5 bg-pink-600 transition-transform duration-300 ease-in-out"
                  style={{
                    width: "80%",
                    maxWidth: "80px", // max underline width (optional)
                    transform: `translateX(${isLoginMode ? "-72%" : "59%"})`,
                  }}
                />
              </div>
            </div>
            <LoginContext.Provider value={{ isLoginMode, setIsLoginMode }}>
              <LoginRegisterLabels />
            </LoginContext.Provider>
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-sm text-pink-600 hover:underline"
              >
                {isLoginMode
                  ? "Don't have an account? Register"
                  : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
