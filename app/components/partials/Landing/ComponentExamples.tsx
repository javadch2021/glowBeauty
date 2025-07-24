import React from "react";
import { AboutUs } from "./AboutUs";
import { Benefits } from "./Benefits";
import { Slider } from "./Slider";

// Example usage of the new components
export const ComponentExamples: React.FC = () => {
  // Sample data for slider
  const sampleProducts = [
    {
      id: 1,
      name: "Hydrating Face Serum",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
      category: "skincare",
      description: "Deep hydration for all skin types"
    },
    {
      id: 2,
      name: "Matte Lipstick",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
      category: "makeup",
      description: "Long-lasting matte finish"
    },
    {
      id: 3,
      name: "Nail Polish Set",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400",
      category: "nails",
      description: "5-piece collection of trending colors"
    },
    {
      id: 4,
      name: "Anti-Aging Cream",
      price: 45.99,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
      category: "skincare",
      description: "Reduces fine lines and wrinkles"
    },
    {
      id: 5,
      name: "Foundation",
      price: 32.99,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
      category: "makeup",
      description: "Full coverage, natural finish"
    }
  ];

  const handleProductClick = (product: any) => {
    console.log("Product clicked:", product);
    alert(`You clicked on ${product.name}!`);
  };

  return (
    <div className="space-y-0">
      {/* About Us Component */}
      <AboutUs />

      {/* Benefits Component */}
      <Benefits />

      {/* Slider Component Examples */}
      
      {/* Example 1: Auto-playing slider */}
      <Slider
        title="🌟 Featured Products"
        items={sampleProducts}
        autoPlay={true}
        autoPlayInterval={3000}
        showDots={true}
        showArrows={true}
        itemsPerView={{
          mobile: 1,
          tablet: 2,
          desktop: 3
        }}
        onItemClick={handleProductClick}
      />

      {/* Example 2: Manual navigation only */}
      <Slider
        title="💄 Makeup Collection"
        items={sampleProducts.filter(p => p.category === 'makeup')}
        autoPlay={false}
        showDots={true}
        showArrows={true}
        itemsPerView={{
          mobile: 1,
          tablet: 2,
          desktop: 4
        }}
        onItemClick={handleProductClick}
      />

      {/* Example 3: Minimal slider (no dots, no arrows) */}
      <Slider
        title="🧴 Skincare Essentials"
        items={sampleProducts.filter(p => p.category === 'skincare')}
        autoPlay={true}
        autoPlayInterval={4000}
        showDots={false}
        showArrows={false}
        itemsPerView={{
          mobile: 1,
          tablet: 1,
          desktop: 2
        }}
        onItemClick={handleProductClick}
      />
    </div>
  );
};

// Usage Instructions (as comments):
/*

HOW TO USE THESE COMPONENTS:

1. ABOUT US COMPONENT:
   - Simply import and use: <AboutUs />
   - Customize content by editing ABOUT_CONFIG in AboutUs.tsx
   - Change title, subtitle, description, features, and stats

2. BENEFITS COMPONENT:
   - Simply import and use: <Benefits />
   - Customize by editing BENEFITS_CONFIG in Benefits.tsx
   - Each benefit has: title, description, and SVG icon
   - Easy to add/remove benefits or change styling

3. SLIDER COMPONENT:
   - Most flexible component with many options
   - Required props: title, items
   - Optional props: autoPlay, autoPlayInterval, showDots, showArrows, itemsPerView, onItemClick
   
   Example usage:
   <Slider
     title="Your Category Title"
     items={yourProductArray}
     autoPlay={true}
     autoPlayInterval={3000}
     showDots={true}
     showArrows={true}
     itemsPerView={{ mobile: 1, tablet: 2, desktop: 4 }}
     onItemClick={(item) => console.log(item)}
   />

4. CATEGORY SLIDERS COMPONENT:
   - Automatically groups products by category
   - Creates separate sliders for each category
   - Usage: <CategorySliders products={allProducts} onProductClick={handleClick} />

CUSTOMIZATION:
- All components use Tailwind CSS classes
- Colors can be changed by modifying pink-* and purple-* classes
- Spacing and sizing can be adjusted via Tailwind classes
- Icons can be replaced with your own SVGs

*/
