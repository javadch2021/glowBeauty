import React, { useState, useEffect } from "react";
import { useCustomerAuth } from "~/contexts/CustomerAuthContext";
import { useNotification } from "~/contexts/NotificationContext";
import { Order } from "~/lib/models";

interface CustomerDashboardProps {
  initialTab?: string;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  initialTab = "profile",
}) => {
  const { customer, isAuthenticated } = useCustomerAuth();
  const { showError } = useNotification();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Fetch orders when orders tab is active
  useEffect(() => {
    if (activeTab === "orders" && isAuthenticated) {
      fetchOrders();
    }
  }, [activeTab, isAuthenticated]);

  // Update active tab from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get("tab");
    if (tab && ["profile", "orders", "tickets", "history"].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const response = await fetch("/api/customer/orders", {
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOrders(data.orders);
      } else {
        showError(data.error || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      showError("Failed to fetch orders");
    } finally {
      setIsLoadingOrders(false);
    }
  };

  if (!isAuthenticated || !customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: Order["status"]) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "orders", label: "Orders" },
    { key: "tickets", label: "Support" },
    { key: "history", label: "Purchase History" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex items-center gap-4">
          <div className="w-16 h-16 bg-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
            {customer.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {customer.name}
            </h1>
            <p className="text-gray-600">{customer.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-white rounded-t-lg">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === tab.key
                  ? "text-pink-600 border-b-2 border-pink-600 bg-pink-50"
                  : "text-gray-600 hover:text-pink-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-lg p-6">
          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <p className="text-gray-900">{customer.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <p className="text-gray-900">{customer.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <p className="text-gray-900">{customer.phone || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <p className="text-gray-900">{customer.address || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <p className="text-gray-900">{formatDate(customer.joinDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Orders
                  </label>
                  <p className="text-gray-900">{customer.totalOrders}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
              {isLoadingOrders ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No orders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex flex-wrap justify-between items-start mb-3">
                        <div>
                          <span className="font-bold text-gray-800">
                            Order #{order.id}
                          </span>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.orderDate)}
                          </p>
                        </div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>
                          <strong>{order.items.length}</strong> item(s) • $
                          {order.total.toFixed(2)}
                        </p>
                        {order.trackingNumber && (
                          <p className="mt-1">
                            Tracking: <strong>{order.trackingNumber}</strong>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "tickets" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Support Tickets</h2>
              <div className="text-center py-8">
                <p className="text-gray-500">No support tickets found</p>
                <p className="text-sm text-gray-400 mt-2">
                  Contact support if you need assistance
                </p>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Purchase History</h2>
              {isLoadingOrders ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                </div>
              ) : orders.filter((order) => order.status === "delivered").length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No completed purchases found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders
                    .filter((order) => order.status === "delivered")
                    .map((order) => (
                      <div key={order.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Order #{order.id}</span>
                          <span className="text-green-600 font-semibold">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          {order.items.map((item, i) => (
                            <div key={i}>
                              {item.quantity}x {item.productName} ($
                              {item.total.toFixed(2)})
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Date: {formatDate(order.orderDate)}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
