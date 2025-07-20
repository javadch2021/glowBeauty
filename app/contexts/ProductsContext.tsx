import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "~/lib/models";

interface ProductsContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  loading: boolean;
  error: string | null;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

interface ProductsProviderProps {
  children: ReactNode;
  initialProducts?: Product[];
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({
  children,
  initialProducts = [],
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const value: ProductsContextType = {
    products,
    setProducts,
    loading,
    error,
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
