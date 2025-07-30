import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CartItem } from "~/lib/models";
import { useCustomerAuth } from "~/contexts/CustomerAuthContext";
import { useNotification } from "~/contexts/NotificationContext";

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (
    productId: number,
    productName: string,
    productImage: string,
    price: number,
    quantity?: number
  ) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useCustomerAuth();
  const { showSuccess, showError } = useNotification();

  const refreshCart = async () => {
    console.log(
      "CartContext - refreshCart called, isAuthenticated:",
      isAuthenticated
    );

    if (!isAuthenticated) {
      console.log("CartContext - Not authenticated, clearing cart");
      setCart([]);
      setCartCount(0);
      return;
    }

    try {
      setIsLoading(true);
      console.log("CartContext - Fetching cart from /api/cart");

      const response = await fetch("/api/cart", {
        credentials: "include", // Include cookies for authentication
      });

      console.log("CartContext - Refresh response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("CartContext - Refresh response data:", data);
        setCart(data.cart || []);
        setCartCount(data.cartCount || 0);
        console.log(
          "CartContext - Cart updated:",
          data.cart?.length || 0,
          "items"
        );
      } else if (response.status === 401) {
        console.log("CartContext - 401 response, clearing cart");
        // User not authenticated, clear cart
        setCart([]);
        setCartCount(0);
      } else {
        console.error(
          "CartContext - Unexpected response status:",
          response.status
        );
      }
    } catch (error) {
      console.error("CartContext - Failed to refresh cart:", error);
      showError("Failed to load cart");
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (
    productId: number,
    productName: string,
    productImage: string,
    price: number,
    quantity: number = 1
  ) => {
    console.log("CartContext - addToCart called with:", {
      productId,
      productName,
      productImage,
      price,
      quantity,
      isAuthenticated,
    });

    if (!isAuthenticated) {
      showError("Please log in to add items to cart");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("action", "add");
      formData.append("productId", productId.toString());
      formData.append("productName", productName);
      formData.append("productImage", productImage);
      formData.append("price", price.toString());
      formData.append("quantity", quantity.toString());

      console.log("CartContext - Sending request to /api/cart");
      console.log(
        "CartContext - FormData being sent:",
        Array.from(formData.entries())
      );

      const response = await fetch("/api/cart", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      console.log("CartContext - Response status:", response.status);
      const responseData = await response.json();
      console.log("CartContext - Response data:", responseData);

      if (response.ok) {
        console.log("CartContext - Refreshing cart after successful add");
        await refreshCart();
      } else {
        console.error(
          "CartContext - Failed to add item, response:",
          responseData
        );
        showError("Failed to add item to cart");
      }
    } catch (error) {
      console.error("CartContext - Failed to add to cart:", error);
      showError("Failed to add item to cart");
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!isAuthenticated) {
      showError("Please log in to update cart");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("action", "update");
      formData.append("productId", productId.toString());
      formData.append("quantity", quantity.toString());

      const response = await fetch("/api/cart", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        await refreshCart();
      } else {
        showError("Failed to update cart");
      }
    } catch (error) {
      console.error("Failed to update cart:", error);
      showError("Failed to update cart");
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!isAuthenticated) {
      showError("Please log in to remove items from cart");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("action", "remove");
      formData.append("productId", productId.toString());

      const response = await fetch("/api/cart", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        await refreshCart();
        showSuccess("Item removed from cart");
      } else {
        showError("Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      showError("Failed to remove item from cart");
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      showError("Please log in to clear cart");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("action", "clear");

      const response = await fetch("/api/cart", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        await refreshCart();
        showSuccess("Cart cleared");
      } else {
        showError("Failed to clear cart");
      }
    } catch (error) {
      console.error("Failed to clear cart:", error);
      showError("Failed to clear cart");
    }
  };

  // Load cart on mount and when auth state changes
  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  // Refresh cart when the page becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        refreshCart();
      }
    };

    const handleFocus = () => {
      if (isAuthenticated) {
        refreshCart();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isAuthenticated]);

  const value: CartContextType = {
    cart,
    cartCount,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
