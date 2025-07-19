import type { MetaFunction } from "@remix-run/node";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { AnalyticsDashboard } from "~/components/admin/AnalyticsDashboard";
import { useProducts } from "~/contexts/ProductsContext";
import { mockOrders, generateAnalyticsData } from "~/services/mockData";

export const meta: MetaFunction = () => {
  return [
    { title: "Analytics - Admin Dashboard" },
    {
      name: "description",
      content: "View analytics and insights in the admin dashboard",
    },
  ];
};

export default function AdminAnalytics() {
  // Use products context for real-time data
  const { products } = useProducts();

  // Generate analytics data from current data - in a real app, this would come from a loader
  const analyticsData = generateAnalyticsData(mockOrders, products);

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
