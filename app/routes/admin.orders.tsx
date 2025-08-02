import type {
  MetaFunction,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useState, useEffect } from "react";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { AdminLayout } from "~/components/separateUserSide/admin/AdminLayout";
import { OrderList } from "~/components/separateUserSide/admin/OrderList";
import { OrderDetails } from "~/components/separateUserSide/admin/OrderDetails";
import { Order } from "~/lib/models";
import { orderService } from "~/lib/services.server";
import { calculateOrderStats } from "~/lib/utils/analytics";

export const meta: MetaFunction = () => {
  return [
    { title: "Orders - Admin Dashboard" },
    { name: "description", content: "Manage orders in the admin dashboard" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const orders = await orderService.getAll();
    console.log("Admin orders loader - Loading orders:", orders.length);
    return { orders };
  } catch (error) {
    console.error("Error loading orders:", error);
    return { orders: [], error: "Failed to load orders" };
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "updateStatus") {
      const orderId = Number(formData.get("orderId"));
      const status = formData.get("status") as Order["status"];
      const trackingNumber = formData.get("trackingNumber") as
        | string
        | undefined;

      if (!orderId || !status) {
        return json({ error: "Missing required fields" }, { status: 400 });
      }

      await orderService.updateStatus(orderId, status, trackingNumber);
      console.log(
        `Admin orders action - Updated order ${orderId} status to ${status}`
      );

      return json({ success: true });
    }

    return json({ error: "Invalid intent" }, { status: 400 });
  } catch (error) {
    console.error("Error in orders action:", error);
    return json({ error: "Failed to update order" }, { status: 500 });
  }
};

export default function AdminOrders() {
  // Use loader data for orders
  const { orders: initialOrders } = useLoaderData<typeof loader>();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const fetcher = useFetcher();

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = (
    orderId: number,
    status: Order["status"],
    trackingNumber?: string
  ) => {
    // Optimistically update the UI
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              trackingNumber: trackingNumber || order.trackingNumber,
            }
          : order
      )
    );

    // Update selected order if it's the one being updated
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status,
        trackingNumber: trackingNumber || selectedOrder.trackingNumber,
      });
    }

    // Submit to server
    const formData = new FormData();
    formData.append("intent", "updateStatus");
    formData.append("orderId", orderId.toString());
    formData.append("status", status);
    if (trackingNumber) {
      formData.append("trackingNumber", trackingNumber);
    }

    fetcher.submit(formData, { method: "post" });
  };

  // Calculate order statistics
  const orderStats = calculateOrderStats(orders);

  return (
    <AdminLayout currentPage="orders">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track customer orders
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Orders
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {orderStats.totalOrders}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Revenue
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      ${orderStats.totalRevenue.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Avg. Order Value
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      ${orderStats.averageOrderValue.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Orders
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {orderStats.statusCounts.pending || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Order Status Overview
            </h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(orderStats.statusCounts).map(
                ([status, count]) => {
                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case "pending":
                        return "bg-yellow-100 text-yellow-800";
                      case "processing":
                        return "bg-blue-100 text-blue-800";
                      case "shipped":
                        return "bg-purple-100 text-purple-800";
                      case "delivered":
                        return "bg-green-100 text-green-800";
                      case "cancelled":
                        return "bg-red-100 text-red-800";
                      default:
                        return "bg-gray-100 text-gray-800";
                    }
                  };

                  return (
                    <div key={status} className="text-center">
                      <div
                        className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                          status
                        )}`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </div>
                      <div className="mt-2 text-2xl font-bold text-gray-900">
                        {count}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Order List */}
        <OrderList
          orders={orders}
          onViewDetails={handleViewDetails}
          onUpdateStatus={handleUpdateStatus}
        />

        {/* Order Details Modal */}
        <OrderDetails
          order={selectedOrder}
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </AdminLayout>
  );
}
