import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { AnalyticsDashboard } from "~/components/admin/AnalyticsDashboard";
import { productService, orderService } from "~/lib/services.server";
import { generateAnalyticsData } from "~/lib/utils/analytics";

export const meta: MetaFunction = () => {
  return [
    { title: "Analytics - Admin Dashboard" },
    {
      name: "description",
      content: "View analytics and insights in the admin dashboard",
    },
  ];
};

export const loader = async () => {
  try {
    const [products, orders] = await Promise.all([
      productService.getAll(),
      orderService.getAll(),
    ]);

    const analyticsData = generateAnalyticsData(orders, products);
    console.log("Admin analytics loader - Generated analytics data");
    return { analyticsData };
  } catch (error) {
    console.error("Error loading analytics data:", error);
    return {
      analyticsData: {
        salesByMonth: [],
        topProducts: [],
        ordersByStatus: [],
        revenueGrowth: [],
      },
      error: "Failed to load analytics data",
    };
  }
};

export default function AdminAnalytics() {
  // Use loader data for analytics
  const { analyticsData } = useLoaderData<typeof loader>();

  return (
    <AdminLayout currentPage="analytics">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Insights and performance metrics for your business
          </p>
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard analyticsData={analyticsData} />
      </div>
    </AdminLayout>
  );
}
