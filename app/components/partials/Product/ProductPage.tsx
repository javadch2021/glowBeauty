/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[]; // Now supports multiple images
  category: string;
  inStock?: boolean;
  brand?: string;
  features?: string[];
}

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onProductClick?: (product: Product) => void;
  relatedProducts?: Product[];
}

const ProductPage: React.FC<ProductPageProps> = ({
  product,
  onBack,
  onAddToCart,
  onProductClick,
  relatedProducts = [],
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [expandedDesc, setExpandedDesc] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [showFullFeatures, setShowFullFeatures] = useState<boolean>(false);

  const [comments, setComments] = useState<
    { rating: number; comment: string; author: string; date: string }[]
  >([
    {
      rating: 5,
      comment:
        "Love this serum! So hydrating and smooth. My skin feels amazing after just one week of use.",
      author: "Sarah M.",
      date: "2024-01-15",
    },
    {
      rating: 4,
      comment:
        "Beautiful glow, but wish it lasted longer throughout the day. Still recommend it!",
      author: "Emma K.",
      date: "2024-01-10",
    },
    {
      rating: 5,
      comment:
        "Perfect for my sensitive skin. No irritation and great results!",
      author: "Lisa R.",
      date: "2024-01-08",
    },
  ]);

  const [couponCode, setCouponCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [applied, setApplied] = useState<boolean>(false);

  // Reset state when product changes
  useEffect(() => {
    setImageIndex(0);
    setQuantity(1);
    setDiscount(0);
    setApplied(false);
    setCouponCode("");
  }, [product.id]);

  // Product price with discount (not affected by quantity)
  const discountedPrice = product.price * (1 - discount / 100);
  // Total price for the cart (includes quantity)
  const totalCartPrice = discountedPrice * quantity;

  const handleSubmitReview = () => {
    if (comment.trim() && rating > 0) {
      const newReview = {
        rating,
        comment,
        author: "You",
        date: new Date().toISOString().split("T")[0],
      };
      setComments([newReview, ...comments]);
      setComment("");
      setRating(0);
    }
  };

  const handleApplyCoupon = () => {
    if (applied) return;

    const lowerCode = couponCode.toLowerCase();
    if (lowerCode === "glow10") {
      setDiscount(10);
      setApplied(true);
    } else if (lowerCode === "save20") {
      setDiscount(20);
      setApplied(true);
    } else if (lowerCode === "beauty15") {
      setDiscount(15);
      setApplied(true);
    } else {
      alert("Invalid coupon code. Try: GLOW10, SAVE20, or BEAUTY15");
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await onAddToCart(product, quantity);
      // Show success feedback
      setTimeout(() => setIsAddingToCart(false), 1000);
    } catch (error) {
      setIsAddingToCart(false);
      console.error("Failed to add to cart:", error);
    }
  };

  // Calculate average rating
  const averageRating =
    comments.length > 0
      ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length
      : 0;

  // Get stock status
  const stockStatus = product.inStock !== false;

  // Default features if none provided
  const productFeatures = product.features || [
    "Premium quality ingredients",
    "Dermatologist tested",
    "Cruelty-free",
    "Suitable for all skin types",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-pink-50 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="text-pink-600 font-medium flex items-center hover:underline"
          >
            ← Back to Shop
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square flex items-center justify-center">
              <img
                src={product.images[imageIndex]}
                alt={`${product.name} view ${imageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                    imageIndex === idx ? "border-pink-500" : "border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt={`thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Brand and Category */}
            <div className="flex items-center gap-2 mb-2">
              {product.brand && (
                <span className="text-sm text-pink-600 font-medium">
                  {product.brand}
                </span>
              )}
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-600 capitalize">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {product.name}
            </h1>

            {/* Rating Display */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, idx) => (
                  <svg
                    key={idx}
                    className={`w-5 h-5 ${
                      idx < Math.floor(averageRating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)} ({comments.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <p className="text-pink-600 text-2xl font-semibold">
                ${discountedPrice.toFixed(2)}
              </p>
              {discount > 0 && (
                <p className="text-sm text-gray-500 line-through">
                  Original: ${product.price.toFixed(2)}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              {stockStatus ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ In Stock
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  ✗ Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-5">
              <h2 className="text-lg font-medium text-gray-700">Description</h2>
              <p className="text-gray-600 mt-2 leading-relaxed">
                {expandedDesc
                  ? product.description
                  : `${product.description.substring(0, 150)}...`}
              </p>
              <button
                onClick={() => setExpandedDesc(!expandedDesc)}
                className="text-pink-600 text-sm flex items-center mt-2 hover:underline"
              >
                {expandedDesc ? "Show Less" : "Read More"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`ml-1 transition-transform ${
                    expandedDesc ? "rotate-180" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>

            {/* Key Features */}
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-700 mb-3">
                Key Features
              </h2>
              <div className="space-y-2">
                {productFeatures
                  .slice(0, showFullFeatures ? productFeatures.length : 3)
                  .map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <svg
                        className="w-4 h-4 text-pink-600 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </div>
                  ))}
                {productFeatures.length > 3 && (
                  <button
                    onClick={() => setShowFullFeatures(!showFullFeatures)}
                    className="text-pink-600 text-sm hover:underline"
                  >
                    {showFullFeatures
                      ? "Show Less"
                      : `Show ${productFeatures.length - 3} More`}
                  </button>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 border rounded-l-md flex items-center justify-center text-pink-600 hover:bg-pink-50 transition"
                >
                  −
                </button>
                <span className="w-12 h-10 border-t border-b flex items-center justify-center font-medium text-gray-900 bg-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 border rounded-r-md flex items-center justify-center text-pink-600 hover:bg-pink-50 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-900 bg-white placeholder-gray-500"
                  disabled={applied}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={applied}
                  className="px-4 py-2 bg-pink-600 text-white text-sm rounded-md hover:bg-pink-700 disabled:bg-gray-400 transition"
                >
                  {applied ? "Applied" : "Apply"}
                </button>
              </div>
              {discount > 0 && (
                <p className="text-green-600 text-sm mt-1 font-medium">
                  🎉 {discount}% off applied!
                </p>
              )}
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!stockStatus || isAddingToCart}
              className={`w-full mt-8 py-3 rounded-lg font-semibold transition transform hover:scale-105 ${
                !stockStatus
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : isAddingToCart
                  ? "bg-pink-500 text-white cursor-wait"
                  : "bg-pink-600 text-white hover:bg-pink-700"
              }`}
            >
              {!stockStatus
                ? "Out of Stock"
                : isAddingToCart
                ? "Adding to Cart..."
                : `Add to Cart - $${totalCartPrice.toFixed(2)}`}
            </button>

            {/* Quick Actions */}
            <div className="flex gap-3 mt-4">
              <button className="flex-1 border border-pink-600 text-pink-600 py-2 rounded-lg font-medium hover:bg-pink-50 transition">
                ♡ Add to Wishlist
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
                📤 Share
              </button>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <section className="mt-16 max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Customer Reviews
          </h2>

          {/* Rating Input */}
          <div className="bg-pink-50 p-6 rounded-lg mb-8">
            <h3 className="font-medium text-gray-700 mb-3">Write a Review</h3>
            <div className="flex mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={star <= rating ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-yellow-500 cursor-pointer"
                  onClick={() => setRating(star)}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-900 bg-white placeholder-gray-500"
              rows={4}
            />
            <button
              onClick={handleSubmitReview}
              className="mt-3 bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition"
            >
              Submit Review
            </button>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {comments.map((c, i) => (
              <div key={i} className="border-b pb-6 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, idx) => (
                        <svg
                          key={idx}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={idx < c.rating ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-yellow-500"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {c.author}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(c.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{c.comment}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t pt-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 4).map((relatedProduct) => (
                  <button
                    key={relatedProduct.id}
                    className="group cursor-pointer text-left w-full"
                    onClick={() =>
                      onProductClick && onProductClick(relatedProduct)
                    }
                  >
                    <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square">
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop";
                        }}
                      />
                    </div>
                    <div className="mt-3">
                      <h3 className="text-sm font-medium text-gray-800 group-hover:text-pink-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {relatedProduct.category}
                      </p>
                      <p className="text-lg font-semibold text-pink-600 mt-2">
                        ${relatedProduct.price.toFixed(2)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-16">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} GlowBeauty. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProductPage;
