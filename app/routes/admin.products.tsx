import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { useState } from "react";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { ProductList } from "~/components/admin/ProductList";
import { ProductForm } from "~/components/admin/ProductForm";
import { Product } from "~/components/forms/Landing";
import { productStore } from "~/lib/productStore";

export const meta: MetaFunction = () => {
  return [
    { title: "Products - Admin Dashboard" },
    { name: "description", content: "Manage products in the admin dashboard" },
  ];
};

export const loader = async () => {
  const products = productStore.getAll();
  console.log("Admin loader - Loading products:", products.length);
  return { products };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType") as string;

  console.log("Admin action - Action type:", actionType);

  if (actionType === "add") {
    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      image: formData.get("image") as string,
      category: formData.get("category") as string,
    };
    const newProduct = productStore.add(productData);
    console.log("Admin action - Added product:", newProduct);
  } else if (actionType === "update") {
    const productData = {
      id: parseInt(formData.get("id") as string),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      image: formData.get("image") as string,
      category: formData.get("category") as string,
    };
    productStore.update(productData);
    console.log("Admin action - Updated product:", productData);
  } else if (actionType === "delete") {
    const productId = parseInt(formData.get("id") as string);
    productStore.delete(productId);
    console.log("Admin action - Deleted product ID:", productId);
  }

  return { success: true };
};

export default function AdminProducts() {
  // Use loader data for products
  const { products } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  console.log("AdminProducts component - Received products:", products.length);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      console.log("Admin - Deleting product ID:", productId);
      const formData = new FormData();
      formData.append("actionType", "delete");
      formData.append("id", productId.toString());

      await fetch("/admin/products", {
        method: "POST",
        body: formData,
      });

      revalidator.revalidate();
    }
  };

  const handleSaveProduct = async (
    productData: Omit<Product, "id"> | Product
  ) => {
    console.log("Admin - handleSaveProduct called with:", productData);
    const formData = new FormData();

    if ("id" in productData) {
      // Editing existing product
      console.log("Admin - Updating existing product with ID:", productData.id);
      formData.append("actionType", "update");
      formData.append("id", productData.id.toString());
    } else {
      // Adding new product
      console.log("Admin - Adding new product:", productData);
      formData.append("actionType", "add");
    }

    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price.toString());
    formData.append("image", productData.image);
    formData.append("category", productData.category);

    await fetch("/admin/products", {
      method: "POST",
      body: formData,
    });

    setIsFormOpen(false);
    setEditingProduct(null);
    revalidator.revalidate();
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <AdminLayout currentPage="products">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your product catalog
            </p>
          </div>
          <button
            onClick={handleAddProduct}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Product
          </button>
        </div>

        {/* Product List */}
        <ProductList
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />

        {/* Product Form Modal */}
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={handleCancelForm}
          isOpen={isFormOpen}
        />
      </div>
    </AdminLayout>
  );
}
