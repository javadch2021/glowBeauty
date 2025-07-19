import { Product } from "~/components/forms/Landing";
import { mockProducts } from "~/services/mockData";

// In-memory store for products (in a real app, this would be a database)
let products: Product[] = [...mockProducts];

export const productStore = {
  // Get all products
  getAll: (): Product[] => {
    console.log('ProductStore - getAll called, returning', products.length, 'products');
    return [...products];
  },

  // Add a new product
  add: (productData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: Math.max(...products.map(p => p.id), 0) + 1
    };
    products.push(newProduct);
    console.log('ProductStore - Added product:', newProduct);
    console.log('ProductStore - Total products now:', products.length);
    return newProduct;
  },

  // Update an existing product
  update: (updatedProduct: Product): Product => {
    const index = products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      products[index] = updatedProduct;
      console.log('ProductStore - Updated product:', updatedProduct);
    }
    return updatedProduct;
  },

  // Delete a product
  delete: (productId: number): boolean => {
    const initialLength = products.length;
    products = products.filter(p => p.id !== productId);
    const deleted = products.length < initialLength;
    console.log('ProductStore - Deleted product ID:', productId, 'Success:', deleted);
    console.log('ProductStore - Total products now:', products.length);
    return deleted;
  },

  // Get a single product by ID
  getById: (productId: number): Product | undefined => {
    return products.find(p => p.id === productId);
  }
};
