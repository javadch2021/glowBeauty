import React from "react";
import { Slider } from "./Slider";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

interface CategorySlidersProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
}

export const CategorySliders: React.FC<CategorySlidersProps> = ({
  products,
  onProductClick,
}) => {
  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category.toLowerCase();
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Category configurations
  const categoryConfigs = {
    skincare: {
      title: "✨ Skincare Essentials",
      autoPlay: true,
      autoPlayInterval: 4000,
    },
    makeup: {
      title: "💄 Makeup Collection",
      autoPlay: true,
      autoPlayInterval: 3500,
    },
    nails: {
      title: "💅 Nail Care",
      autoPlay: false,
      autoPlayInterval: 3000,
    },
    fragrance: {
      title: "🌸 Fragrances",
      autoPlay: true,
      autoPlayInterval: 4500,
    },
    haircare: {
      title: "💇‍♀️ Hair Care",
      autoPlay: false,
      autoPlayInterval: 3000,
    },
  };

  const handleProductClick = (product: Product) => {
    console.log("Product clicked:", product);
    if (onProductClick) {
      onProductClick(product);
    }
  };

  return (
    <div className="bg-gray-50 py-8 px-4">
      {Object.entries(groupedProducts).map(([category, categoryProducts]) => {
        const config = categoryConfigs[
          category as keyof typeof categoryConfigs
        ] || {
          title: `${
            category.charAt(0).toUpperCase() + category.slice(1)
          } Products`,
          autoPlay: false,
          autoPlayInterval: 3000,
        };

        // Only show categories that have products
        if (categoryProducts.length === 0) return null;

        return (
          <Slider
            key={category}
            title={config.title}
            items={categoryProducts}
            autoPlay={config.autoPlay}
            autoPlayInterval={config.autoPlayInterval}
            showDots={true}
            showArrows={true}
            itemsPerView={{
              mobile: 1,
              tablet: 2,
              desktop: 3,
            }}
            onItemClick={handleProductClick}
          />
        );
      })}

      {/* If no products or categories */}
      {Object.keys(groupedProducts).length === 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Products Available
              </h3>
              <p className="text-gray-600">
                We're working on adding amazing products for you. Check back
                soon!
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
