/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';

// Define types
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [expandedDesc, setExpandedDesc] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<{ rating: number; comment: string }[]>([
    { rating: 5, comment: 'Love this serum! So hydrating.' },
    { rating: 4, comment: 'Great glow, but a bit pricey.' },
  ]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [applied, setApplied] = useState<boolean>(false);

  if (!product) return null;

  const handleSubmitReview = () => {
    if (comment.trim() && rating > 0) {
      setComments([{ rating, comment }, ...comments]);
      setComment('');
      setRating(0);
    }
  };

  const handleApplyCoupon = () => {
    if (applied) return;

    // Simple mock coupon logic
    if (couponCode.toLowerCase() === 'glow10') {
      setDiscount(10);
      setApplied(true);
    } else if (couponCode.toLowerCase() === 'save20') {
      setDiscount(20);
      setApplied(true);
    } else {
      alert('Invalid coupon code');
    }
  };

  const finalPrice = product.price * quantity * (1 - discount / 100);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Slider */}
        <div className="relative h-64 bg-gray-100">
          <img
            src={product.image.replace('300x300', '500x500')}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <div className="mt-1">
            <span className="text-pink-600 text-xl font-semibold">
              ${finalPrice.toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-500 line-through ml-2">${(product.price * quantity).toFixed(2)}</span>
            )}
          </div>

          {/* Description */}
          <div className="mt-4">
            <p className="text-gray-600 text-sm">
              {expandedDesc
                ? product.description
                : `${product.description.substring(0, 100)}...`}
            </p>
            <button
              onClick={() => setExpandedDesc(!expandedDesc)}
              className="text-pink-600 text-sm flex items-center mt-1"
            >
              {expandedDesc ? 'Show Less' : 'Read More'}
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
                className={`ml-1 transition-transform ${expandedDesc ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>

          {/* Quantity */}
          <div className="mt-4 flex items-center">
            <label className="text-sm font-medium mr-3">Quantity:</label>
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-2 py-1 border rounded text-pink-600"
            >
              -
            </button>
            <span className="mx-2 w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-2 py-1 border rounded text-pink-600"
            >
              +
            </button>
          </div>

          {/* Coupon Code */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Coupon Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                disabled={applied}
              />
              <button
                onClick={handleApplyCoupon}
                disabled={applied}
                className="px-3 py-2 bg-pink-600 text-white text-sm rounded-md hover:bg-pink-700 disabled:bg-gray-400 transition"
              >
                {applied ? 'Applied' : 'Apply'}
              </button>
            </div>
            {discount > 0 && (
              <p className="text-green-600 text-sm mt-1">🎉 {discount}% off applied!</p>
            )}
          </div>

          {/* Rating */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Rate this product</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={star <= rating ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-yellow-500 cursor-pointer"
                  onClick={() => setRating(star)}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mt-4">
            <textarea
              placeholder="Share your thoughts..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              rows={3}
            />
            <button
              onClick={handleSubmitReview}
              className="mt-2 bg-pink-600 text-white text-sm px-4 py-1 rounded-md hover:bg-pink-700 transition"
            >
              Submit Review
            </button>
          </div>

          {/* Comments */}
          <div className="mt-6">
            <h3 className="font-medium">Customer Reviews</h3>
            <div className="space-y-3 mt-2">
              {comments.map((c, i) => (
                <div key={i} className="border-b pb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill={i < c.rating ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-yellow-500"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm mt-1">{c.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mt-6">
            <button
              onClick={() => {
                onAddToCart(product, quantity);
                onClose();
              }}
              className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition"
            >
              Add to Cart - ${finalPrice.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;