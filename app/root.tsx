import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { ProductsProvider } from "~/contexts/ProductsContext";
import { NotificationProvider } from "~/contexts/NotificationContext";
import NotificationContainer from "~/components/partials/Notification/NotificationContainer";
import { CustomerAuthProvider } from "~/contexts/CustomerAuthContext";
import { CartProvider } from "~/contexts/CartContext";
import { optionalAuth } from "~/lib/auth.middleware";
import type { AuthCustomer } from "~/lib/models";

import "./tailwind.css";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("Root loader - Request URL:", request.url);
  const { customer, headers } = await optionalAuth(request);
  console.log(
    "Root loader - Customer:",
    customer ? `ID: ${customer.id}` : "Not authenticated"
  );

  return Response.json({ customer }, { headers });
}

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="overflow-x-hidden">
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Global image error handler to catch placeholder requests
              document.addEventListener('error', function(e) {
                if (e.target && e.target.tagName === 'IMG') {
                  const img = e.target;
                  if (img.src.includes('placeholder.com')) {
                    console.warn('Blocked placeholder.com request:', img.src);
                    img.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop';
                  }
                }
              }, true);
            `,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  const { customer } = useLoaderData<typeof loader>();

  return (
    <NotificationProvider>
      <CustomerAuthProvider customer={customer}>
        <CartProvider>
          <ProductsProvider>
            <Outlet />
            <NotificationContainer />
          </ProductsProvider>
        </CartProvider>
      </CustomerAuthProvider>
    </NotificationProvider>
  );
}
