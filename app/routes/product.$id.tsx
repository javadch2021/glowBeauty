import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { productService } from "~/lib/services.server";
import ProductPage from "~/components/partials/Product/ProductPage";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.product) {
    return [
      { title: "Product Not Found" },
      { name: "description", content: "The requested product could not be found." },
    ];
  }

  return [
    { title: `${data.product.name} - GlowBeauty` },
    { name: "description", content: data.product.description },
    { property: "og:title", content: data.product.name },
    { property: "og:description", content: data.product.description },
    { property: "og:image", content: data.product.image },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const productId = params.id;
  
  if (!productId) {
    throw new Response("Product ID is required", { status: 400 });
  }

  try {
    // Get the main product
    const product = await productService.getById(productId);
    
    if (!product) {
      throw new Response("Product not found", { status: 404 });
    }

    // Get related products (same category, excluding current product)
    const allProducts = await productService.getAll();
    const relatedProducts = allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);

    // Transform product to match ProductPage interface
    const transformedProduct = {
      id: parseInt(product.id),
      name: product.name,
      description: product.description,
      price: product.price,
      images: [product.image], // Convert single image to array
      category: product.category,
      inStock: true, // Default to in stock
      brand: "GlowBeauty", // Default brand
      features: [
        "Premium quality ingredients",
        "Dermatologist tested",
        "Cruelty-free",
        "Suitable for all skin types",
        "Fast-absorbing formula",
        "Long-lasting results"
      ]
    };

    const transformedRelatedProducts = relatedProducts.map(p => ({
      id: parseInt(p.id),
      name: p.name,
      description: p.description,
      price: p.price,
      images: [p.image],
      category: p.category,
      inStock: true,
      brand: "GlowBeauty"
    }));

    return json({ 
      product: transformedProduct, 
      relatedProducts: transformedRelatedProducts 
    });
  } catch (error) {
    console.error("Error loading product:", error);
    throw new Response("Failed to load product", { status: 500 });
  }
}

export default function ProductRoute() {
  const { product, relatedProducts } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleAddToCart = async (product: any, quantity: number) => {
    // Here you would typically:
    // 1. Add to cart state/context
    // 2. Make API call to add to cart
    // 3. Show success notification
    
    console.log(`Adding ${quantity} of ${product.name} to cart`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // You could also show a toast notification here
    alert(`Added ${quantity} ${product.name} to cart!`);
  };

  return (
    <ProductPage
      product={product}
      relatedProducts={relatedProducts}
      onBack={handleBack}
      onAddToCart={handleAddToCart}
    />
  );
}
