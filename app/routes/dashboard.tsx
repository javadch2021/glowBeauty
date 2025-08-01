import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { useState, useEffect } from "react";
import { getAuthenticatedCustomer } from "~/lib/auth.middleware";
import CustomerDashboard from "~/components/separateUserSide/client/CustomerDashboard";
import { DashboardTab } from "~/components/atoms/types/CustomerTypes";

export const meta: MetaFunction = () => {
  return [
    { title: "Customer Dashboard - GlowBeauty" },
    { name: "description", content: "Manage your profile, orders, and account settings" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Ensure user is authenticated
    const { customer } = await getAuthenticatedCustomer(request);
    
    if (!customer) {
      throw new Response("Unauthorized", { status: 401 });
    }

    // Get the tab parameter from URL
    const url = new URL(request.url);
    const tab = url.searchParams.get("tab") as DashboardTab | null;
    
    return json({ 
      customer,
      initialTab: tab || "profile"
    });
  } catch (error) {
    console.error("Dashboard loader error:", error);
    throw new Response("Unauthorized", { status: 401 });
  }
}

export default function DashboardRoute() {
  const { customer, initialTab } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);

  // Update URL when tab changes
  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab !== activeTab) {
      setSearchParams({ tab: activeTab });
    }
  }, [activeTab, searchParams, setSearchParams]);

  // Update active tab when URL changes
  useEffect(() => {
    const urlTab = searchParams.get("tab") as DashboardTab;
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams, activeTab]);

  return <CustomerDashboard initialTab={activeTab} customer={customer} />;
}
