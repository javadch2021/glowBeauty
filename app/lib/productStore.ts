import { Product } from "~/lib/models";
import { productService, activityService } from "~/lib/services.server";

export const productStore = {
  // Get all products
  getAll: async (): Promise<Product[]> => {
    try {
      const products = await productService.getAll();
      console.log(
        "ProductStore - getAll called, returning",
        products.length,
        "products"
      );
      return products;
    } catch (error) {
      console.error("ProductStore - Error getting all products:", error);
      return [];
    }
  },

  // Add a new product
  add: async (productData: Omit<Product, "id">): Promise<Product> => {
    try {
      const newProduct = await productService.create(productData);
      await activityService.logProductActivity(newProduct.name, "added");
      console.log("ProductStore - Added product:", newProduct);
      return newProduct;
    } catch (error) {
      console.error("ProductStore - Error adding product:", error);
      throw error;
    }
  },

  // Update an existing product
  update: async (updatedProduct: Product): Promise<Product> => {
    try {
      const updated = await productService.update(updatedProduct);
      await activityService.logProductActivity(updated.name, "updated");
      console.log("ProductStore - Updated product:", updated);
      return updated;
    } catch (error) {
      console.error("ProductStore - Error updating product:", error);
      throw error;
    }
  },

  // Delete a product
  delete: async (productId: number): Promise<boolean> => {
    try {
      const product = await productService.getById(productId);
      const deleted = await productService.delete(productId);
      if (deleted && product) {
        await activityService.logProductActivity(product.name, "deleted");
      }
      console.log(
        "ProductStore - Deleted product ID:",
        productId,
        "Success:",
        deleted
      );
      return deleted;
    } catch (error) {
      console.error("ProductStore - Error deleting product:", error);
      return false;
    }
  },

  // Get a single product by ID
  getById: async (productId: number): Promise<Product | null> => {
    try {
      return await productService.getById(productId);
    } catch (error) {
      console.error("ProductStore - Error getting product by ID:", error);
      return null;
    }
  },

  // Get products by category
  getByCategory: async (category: string): Promise<Product[]> => {
    try {
      return await productService.getByCategory(category);
    } catch (error) {
      console.error(
        "ProductStore - Error getting products by category:",
        error
      );
      return [];
    }
  },
};
