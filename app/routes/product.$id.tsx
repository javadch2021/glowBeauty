import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { productService } from "~/lib/services.server";
import ProductPage from "~/components/partials/Product/ProductPage";
import { useCart } from "~/contexts/CartContext";
import { optionalAuth } from "~/lib/auth.middleware";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.product) {
    return [
      { title: "Product Not Found" },
      {
        name: "description",
        content: "The requested product could not be found.",
      },
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

export async function loader({ params, request }: LoaderFunctionArgs) {
  const productId = params.id;

  if (!productId) {
    throw new Response("Product ID is required", { status: 400 });
  }

  try {
    // Get authentication state
    const { customer, headers } = await optionalAuth(request);
    // Get the main product
    const product = await productService.getById(productId);

    if (!product) {
      throw new Response("Product not found", { status: 404 });
    }

    // Get related products (same category, excluding current product)
    const allProducts = await productService.getAll();
    const relatedProducts = allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
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
        "Long-lasting results",
      ],
    };

    const transformedRelatedProducts = relatedProducts.map((p) => ({
      id: parseInt(p.id),
      name: p.name,
      description: p.description,
      price: p.price,
      images: [p.image],
      category: p.category,
      inStock: true,
      brand: "GlowBeauty",
    }));

    return json(
      {
        product: transformedProduct,
        relatedProducts: transformedRelatedProducts,
        customer,
      },
      { headers }
    );
  } catch (error) {
    console.error("Error loading product:", error);
    throw new Response("Failed to load product", { status: 500 });
  }
}

export default function ProductRoute() {
  const { product, relatedProducts } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleAddToCart = async (product: any, quantity: number) => {
    console.log("Product page - Adding to cart:", {
      id: product.id,
      name: product.name,
      image: product.images?.[0] || product.image,
      price: product.price,
      quantity,
    });

    try {
      await addToCart(
        product.id,
        product.name,
        product.images?.[0] || product.image, // Use first image from array or single image field
        product.price,
        quantity
      );
      console.log("Product page - Successfully added to cart");
      // The addToCart function from useCart already shows success notification
    } catch (error) {
      console.error("Product page - Failed to add to cart:", error);
    }
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
