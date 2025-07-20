import React, { useContext } from "react";
import {
  CategoryContext,
  SearchContext,
  CartContext,
  ServerProductsContext,
} from "../../forms/Landing";
import { Product } from "~/lib/models";

export const ProductGrid: React.FC = () => {
  const { activeCategory } = useContext(CategoryContext);
  const { searchQuery } = useContext(SearchContext);
  const { setCart } = useContext(CartContext);
  const { products } = useContext(ServerProductsContext);

  // Debug: Log when products change in ProductGrid
  React.useEffect(() => {
    console.log(
      "ProductGrid - Products received from context:",
      products.length,
      "products"
    );
    console.log(
      "ProductGrid - Product names:",
      products.map((p) => p.name)
    );
  }, [products]);
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Debug logging
  console.log("ProductGrid - searchQuery:", searchQuery);
  console.log("ProductGrid - activeCategory:", activeCategory);
  console.log("ProductGrid - products count:", products.length);

  const filteredProducts = products.filter(
    (product) =>
      (activeCategory === "all" || product.category === activeCategory) &&
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  console.log(
    "ProductGrid - filtered products count:",
    filteredProducts.length
  );
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Our Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {product.description}
                </p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="font-bold text-pink-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-pink-600 text-white px-3 py-1 rounded-md text-sm hover:bg-pink-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
