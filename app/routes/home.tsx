import { useLoaderData } from "@remix-run/react";
import { Landing } from "../components/forms/Landing"; // Import the Landing component
import { productStore } from "~/lib/productStore";

export const loader = async () => {
  const products = productStore.getAll();
  console.log("Home loader - Loading products:", products.length);
  return { products };
};

export default function Home() {
  const { products } = useLoaderData<typeof loader>();
  console.log("Home component - Received products:", products.length);

  return <Landing products={products} />;
}
