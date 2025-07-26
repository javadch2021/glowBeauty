import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Landing } from "../components/forms/Landing"; // Import the Landing component
import { productService } from "~/lib/services.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Beauty Store - Discover Your Radiance" },
    {
      name: "description",
      content:
        "Transform your beauty routine with our premium collection of skincare and cosmetics.",
    },
  ];
};

export const loader = async () => {
  try {
    const products = await productService.getAll();
    console.log("Home loader - Loading products:", products.length);
    return { products };
  } catch (error) {
    console.error("Error loading products for home:", error);
    return { products: [], error: "Failed to load products" };
  }
};

export default function Index() {
  const { products } = useLoaderData<typeof loader>();
  console.log("Home component - Received products:", products.length);

  return <Landing products={products} />;
}
