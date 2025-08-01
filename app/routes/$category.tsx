import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { productService } from "~/lib/services.server";
import ProductPage from "~/components/partials/Product/ProductPage";
import { useCart } from "~/contexts/CartContext";

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  if (!data?.product) {
    return [
      { title: "Product Not Found" },
      {
        name: "description",
        content: "The requested product could not be found.",
      },
    ];
  }

  const category = params.category || "products";

  return [
    {
      title: `${data.product.name} - ${
        category.charAt(0).toUpperCase() + category.slice(1)
      } | GlowBeauty`,
    },
    { name: "description", content: data.product.description },
    { property: "og:title", content: data.product.name },
    { property: "og:description", content: data.product.description },
    { property: "og:image", content: data.product.images?.[0] || "" },
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const category = params.category;
  const url = new URL(request.url);
  const productId = url.searchParams.get("id");

  if (!category) {
    throw new Response("Category is required", { status: 400 });
  }

  if (!productId) {
    throw new Response("Product ID is required", { status: 400 });
  }

  try {
    // Convert productId to number
    const productIdNumber = parseInt(productId, 10);

    if (isNaN(productIdNumber)) {
      throw new Response("Invalid product ID", { status: 400 });
    }

    // Get the main product
    const product = await productService.getById(productIdNumber);

    if (!product) {
      throw new Response("Product not found", { status: 404 });
    }

    // Verify the product belongs to the requested category
    if (product.category.toLowerCase() !== category.toLowerCase()) {
      throw new Response("Product not found in this category", { status: 404 });
    }

    // Get related products (same category, excluding current product)
    const allProducts = await productService.getAll();
    const relatedProducts = allProducts
      .filter(
        (p) =>
          p.category.toLowerCase() === category.toLowerCase() &&
          p.id !== product.id
      )
      .slice(0, 4);

    // Transform product to match ProductPage interface
    const transformedProduct = {
      id: product.id, // product.id is already a number
      name: product.name,
      description: product.description,
      price: product.price,
      images: [product.image], // Convert single image to array
      category: product.category,
      inStock: true, // Default to in stock
      brand: "GlowBeauty", // Default brand
      features: getCategoryFeatures(product.category),
    };

    const transformedRelatedProducts = relatedProducts.map((p) => ({
      id: p.id, // p.id is already a number
      name: p.name,
      description: p.description,
      price: p.price,
      images: [p.image],
      category: p.category,
      inStock: true,
      brand: "GlowBeauty",
    }));

    return Response.json({
      product: transformedProduct,
      relatedProducts: transformedRelatedProducts,
      category,
    });
  } catch (error) {
    console.error("Error loading product:", error);
    throw new Response("Failed to load product", { status: 500 });
  }
}

// Get category-specific features
function getCategoryFeatures(category: string): string[] {
  const categoryFeatures: Record<string, string[]> = {
    skincare: [
      "Dermatologist tested",
      "Hypoallergenic formula",
      "Non-comedogenic",
      "Suitable for all skin types",
      "Fast-absorbing",
      "Long-lasting hydration",
    ],
    makeup: [
      "Long-wearing formula",
      "Buildable coverage",
      "Cruelty-free",
      "Paraben-free",
      "Easy to blend",
      "Professional quality",
    ],
    nails: [
      "Chip-resistant formula",
      "Quick-drying",
      "High-gloss finish",
      "Long-lasting color",
      "Strengthening formula",
      "Easy application",
    ],
    fragrance: [
      "Long-lasting scent",
      "Premium ingredients",
      "Alcohol-free",
      "Suitable for sensitive skin",
      "Travel-friendly size",
      "Unique blend",
    ],
    haircare: [
      "Sulfate-free",
      "Color-safe",
      "Nourishing formula",
      "Suitable for all hair types",
      "Strengthening ingredients",
      "Natural extracts",
    ],
  };

  return (
    categoryFeatures[category.toLowerCase()] || [
      "Premium quality ingredients",
      "Dermatologist tested",
      "Cruelty-free",
      "Suitable for all skin types",
      "Fast-absorbing formula",
      "Long-lasting results",
    ]
  );
}

export default function CategoryProductRoute() {
  const { product, relatedProducts } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleBack = () => {
    navigate("/"); // Go back to home page
  };

  const handleAddToCart = async (product: any, quantity: number) => {
    console.log(`Adding ${quantity} of ${product.name} to cart`);

    try {
      await addToCart(
        product.id,
        product.name,
        product.images?.[0] || product.image, // Use first image from array or single image field
        product.price,
        quantity
      );
      // The addToCart function from useCart already shows success notification
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const handleProductClick = (product: any) => {
    // Navigate to the clicked product's page
    const productUrl = `/${product.category}?id=${product.id}`;
    navigate(productUrl);
  };

  return (
    <ProductPage
      product={product}
      relatedProducts={relatedProducts}
      onBack={handleBack}
      onAddToCart={handleAddToCart}
      onProductClick={handleProductClick}
    />
  );
}
