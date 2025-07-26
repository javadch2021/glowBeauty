import React from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartDrawerProps {
  cart: CartItem[];
  isCartOpen: boolean;
  closeCart: () => void;
  updateQuantity: (id: number, newQuantity: number) => void;
  removeItem: (id: number) => void;
  totalPrice: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  cart,
  isCartOpen,
  closeCart,
  updateQuantity,
  removeItem,
  totalPrice,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div
        className={`bg-white w-full max-w-md h-full p-6 shadow-xl transform transition-transform duration-200 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Cart</h2>
          <button
            onClick={() => closeCart()}
            className="text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            <ul className="space-y-4">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-4 border-b pb-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-2 py-1 border rounded"
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-2 py-1 border rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-4 text-sm text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between items-center">
              <p className="text-lg font-semibold">
                Total: ${totalPrice.toFixed(2)}
              </p>
              <button className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
