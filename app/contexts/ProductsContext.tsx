import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "~/components/forms/Landing";
import { mockProducts } from "~/services/mockData";

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: number) => void;
  getNextId: () => number;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

interface ProductsProviderProps {
  children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  // Debug: Log when products state changes
  React.useEffect(() => {
    console.log(
      "ProductsProvider - Products state changed:",
      products.length,
      "products"
    );
    console.log(
      "ProductsProvider - Current products:",
      products.map((p) => ({ id: p.id, name: p.name }))
    );
  }, [products]);

  const getNextId = () => {
    return Math.max(...products.map((p) => p.id), 0) + 1;
  };

  const addProduct = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      id: getNextId(),
    };
    console.log("ProductsContext - Adding new product:", newProduct);
    setProducts((prev) => {
      const updated = [...prev, newProduct];
      console.log(
        "ProductsContext - Products after add:",
        updated.length,
        "total products"
      );
      return updated;
    });
  };

  const updateProduct = (updatedProduct: Product) => {
    console.log("ProductsContext - Updating product:", updatedProduct);
    setProducts((prev) => {
      const updated = prev.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      );
      console.log(
        "ProductsContext - Products after update:",
        updated.length,
        "total products"
      );
      return updated;
    });
  };

  const deleteProduct = (productId: number) => {
    console.log("ProductsContext - Deleting product with ID:", productId);
    setProducts((prev) => {
      const updated = prev.filter((product) => product.id !== productId);
      console.log(
        "ProductsContext - Products after delete:",
        updated.length,
        "total products"
      );
      return updated;
    });
  };

  const value: ProductsContextType = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getNextId,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = (): ProductsContextType => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};
