import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { CustomerDashboard } from "~/components/partials/Customer/CustomerDashboard";
import { getAuthenticatedCustomer } from "~/lib/auth.middleware";

export const meta: MetaFunction = () => {
  return [
    { title: "Customer Dashboard - GlowBeauty" },
    { name: "description", content: "Manage your orders and profile" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // Check if customer is authenticated
    const { customer } = await getAuthenticatedCustomer(request);

    if (!customer) {
      // Redirect to home page if not authenticated
      return redirect("/?login=required");
    }

    // Get tab from URL params
    const url = new URL(request.url);
    const tab = url.searchParams.get("tab") || "profile";

    return json({
      customer,
      initialTab: tab,
    });
  } catch (error) {
    console.error("Dashboard loader error:", error);
    return redirect("/?error=dashboard");
  }
};

export default function Dashboard() {
  const { initialTab } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  // Get current tab from URL params, fallback to initialTab
  const currentTab = searchParams.get("tab") || initialTab;

  return <CustomerDashboard initialTab={currentTab} />;
}
}
