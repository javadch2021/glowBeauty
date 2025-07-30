import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
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

  const refreshCart = useCallback(async () => {
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
        console.log("CartContext - Parsed response data:", data);
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
      // Don't show error notification for cart refresh to avoid dependency issues
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

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
      const requestData = {
        action: "add",
        productId: productId.toString(),
        productName,
        productImage,
        price: price.toString(),
        quantity: quantity.toString(),
      };

      console.log("CartContext - Sending request to /api/cart");
      console.log("CartContext - Request data being sent:", requestData);

      const response = await fetch("/api/cart", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log("CartContext - Response status:", response.status);
      const responseText = await response.text();
      console.log("CartContext - Raw response text:", responseText);

      try {
        const responseData = JSON.parse(responseText);
        console.log("CartContext - Parsed response data:", responseData);

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
      } catch (parseError) {
        console.error(
          "CartContext - Failed to parse JSON response:",
          parseError
        );
        console.error("CartContext - Response was:", responseText);
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
      const requestData = {
        action: "update",
        productId: productId.toString(),
        quantity: quantity.toString(),
      };

      const response = await fetch("/api/cart", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
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
      const requestData = {
        action: "remove",
        productId: productId.toString(),
      };

      const response = await fetch("/api/cart", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
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
      const requestData = {
        action: "clear",
      };

      const response = await fetch("/api/cart", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
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
    if (isAuthenticated) {
      refreshCart();
    }
  }, [isAuthenticated, refreshCart]);

  // Temporarily disabled to fix infinite loop
  // Refresh cart when the page becomes visible (user navigates back)
  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (!document.hidden && isAuthenticated) {
  //       refreshCart();
  //     }
  //   };

  //   const handleFocus = () => {
  //     if (isAuthenticated) {
  //       refreshCart();
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   window.addEventListener("focus", handleFocus);

  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //     window.removeEventListener("focus", handleFocus);
  //   };
  // }, [isAuthenticated, refreshCart]);

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
