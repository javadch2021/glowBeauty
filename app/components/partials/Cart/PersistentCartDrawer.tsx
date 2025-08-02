import React, { useState, useEffect } from "react";
import { useCart } from "~/contexts/CartContext";
import { useNotification } from "~/contexts/NotificationContext";
import { useNavigate } from "@remix-run/react";

interface PersistentCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PersistentCartDrawer: React.FC<PersistentCartDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    cart,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading,
  } = useCart();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showError("Your cart is empty");
      return;
    }

    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showSuccess(
          `Order #${
            data.order.id
          } placed successfully! Total: $${data.order.total.toFixed(2)}`
        );
        onClose();
        // Navigate to dashboard orders tab
        navigate("/dashboard?tab=orders");
      } else {
        showError(data.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      showError("Failed to place order. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  useEffect(() => {
    console.log("Cart drawer - isOpen changed:", isOpen);
    if (isOpen) {
      console.log("Cart drawer - Opening");
      // Show the drawer immediately
      setIsVisible(true);
      // Reset animation state first to ensure clean start
      setIsAnimating(false);
      // Small delay to trigger animation after DOM update
      const timer = setTimeout(() => {
        console.log("Cart drawer - Starting animation");
        setIsAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      console.log("Cart drawer - Closing");
      // Start closing animation
      setIsAnimating(false);
      // Wait for animation to complete before hiding
      const timer = setTimeout(() => {
        console.log("Cart drawer - Hiding");
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Cleanup effect to reset states on unmount
  useEffect(() => {
    return () => {
      setIsAnimating(false);
      setIsVisible(false);
    };
  }, []);

  const handleClose = () => {
    // Ensure animation state is properly reset before closing
    setIsAnimating(false);
    onClose(); // Call onClose immediately to update parent state
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ${
        isAnimating ? "bg-black bg-opacity-50" : "bg-transparent"
      }`}
      onClick={handleClose}
      style={{
        maxHeight: "100vh",
        overflow: "hidden",
        pointerEvents: isAnimating ? "auto" : "none", // Only allow interactions when animating
      }}
    >
      <div
        className={`bg-white w-full max-w-md h-full shadow-xl transform transition-transform duration-300 ease-in-out ${
          isAnimating ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: "100vh",
          overflow: "hidden",
          pointerEvents: "auto", // Always allow interactions on the cart itself
        }}
      >
        {/* Cart Header */}
        <div className="flex-shrink-0 p-6 pb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Your Cart ({cartCount})</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Cart Content */}
        <div className="flex-1 px-6 overflow-hidden flex flex-col min-h-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button
                onClick={handleClose}
                className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <ul className="space-y-4 pb-4">
                  {cart.map((item) => (
                    <li
                      key={item.productId}
                      className="flex items-start gap-4 border-b pb-4"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop";
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center mt-2 gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center border rounded text-sm hover:bg-gray-100"
                            disabled={isLoading}
                          >
                            -
                          </button>
                          <span className="mx-2 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center border rounded text-sm hover:bg-gray-100"
                            disabled={isLoading}
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="ml-4 text-sm text-red-600 hover:text-red-800"
                            disabled={isLoading}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cart Footer - Fixed at bottom */}
              <div className="flex-shrink-0 border-t pt-4 mt-4 bg-white px-6 pb-6">
                {cart.length > 1 && (
                  <button
                    onClick={clearCart}
                    className="w-full mb-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
                    disabled={isLoading}
                  >
                    Clear Cart
                  </button>
                )}

                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-semibold">
                    Total: ${totalPrice.toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-pink-600 text-white py-3 rounded-md hover:bg-pink-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || isCheckingOut || cart.length === 0}
                >
                  {isCheckingOut ? "Processing..." : "Purchase Now"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
