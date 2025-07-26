import React, { useState, useEffect } from "react";
import { Product } from "~/lib/models";
import { useNotification } from "~/contexts/NotificationContext";

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Omit<Product, "id"> | Product) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSave,
  onCancel,
  isOpen,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showSuccess, showError, showWarning } = useNotification();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        image: product.image,
        category: product.category,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    if (!formData.image.trim()) {
      newErrors.image = "Image URL is required";
    } else {
      try {
        const url = new URL(formData.image);

        // Check if URL starts with http or https
        if (!url.protocol.startsWith("http")) {
          newErrors.image = "Image URL must start with http:// or https://";
        }
        // Check if URL has a valid image extension or is from a known image service
        else {
          const pathname = url.pathname.toLowerCase();
          const validExtensions = [
            ".jpg",
            ".jpeg",
            ".png",
            ".gif",
            ".webp",
            ".svg",
          ];
          const imageServices = [
            "unsplash.com",
            "images.unsplash.com",
            "pixabay.com",
            "pexels.com",
          ];

          const hasValidExtension = validExtensions.some((ext) =>
            pathname.endsWith(ext)
          );
          const isFromImageService = imageServices.some((service) =>
            url.hostname.includes(service)
          );

          if (!hasValidExtension && !isFromImageService) {
            newErrors.image =
              "Please enter a valid image URL (must end with .jpg, .png, .gif, .webp, .svg or be from a known image service)";
          }
        }
      } catch {
        newErrors.image =
          "Please enter a valid URL (e.g., https://example.com/image.jpg)";
      }
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError("Please fix the form errors before submitting.");
      return;
    }

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      image: formData.image.trim(),
      category: formData.category.trim(),
    };

    try {
      if (product) {
        onSave({ ...productData, id: product.id });
        showSuccess(`${productData.name} updated successfully!`);
      } else {
        onSave(productData);
        showSuccess(`${productData.name} added successfully!`);
      }
    } catch (error) {
      showError("Failed to save product. Please try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="px-6 py-4 space-y-4"
        >
          {/* Product Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm ${
                errors.description ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm ${
                errors.price ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm ${
                errors.image ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="https://images.unsplash.com/photo-example/image.jpg"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter a valid image URL ending with .jpg, .png, .gif, .webp, or
              .svg
            </p>
            {/* Image Preview */}
            {formData.image && !errors.image && (
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-1">Preview:</p>
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "block";
                  }}
                />
              </div>
            )}
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm ${
                errors.category ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Select a category</option>
              <option value="skincare">Skincare</option>
              <option value="makeup">Makeup</option>
              <option value="nails">Nails</option>
              <option value="fragrance">Fragrance</option>
              <option value="haircare">Hair Care</option>
              <option value="bodycare">Body Care</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            {product ? "Update Product" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
};
