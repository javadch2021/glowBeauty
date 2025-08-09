import React, { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { useCustomerAuth } from "~/contexts/CustomerAuthContext";
import { useNotification } from "~/contexts/NotificationContext";
import { Order, Customer } from "~/lib/models";

interface CustomerDashboardProps {
  initialTab?: string;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  initialTab = "profile",
}) => {
  const { customer, isAuthenticated, updateCustomer } = useCustomerAuth();
  const { showError, showSuccess } = useNotification();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Customer>>({});

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

  const handleEditMode = () => {
    if (!customer) return;

    setEditForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
      address: customer.address || "",
    });
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditForm({});
  };

  const handleFormChange = (field: keyof Customer, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!customer) return;

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("name", editForm.name || "");
      formData.append("email", editForm.email || "");
      formData.append("phone", editForm.phone || "");
      formData.append("address", editForm.address || "");

      const response = await fetch("/api/customer/profile", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the customer context with new data
        if (updateCustomer) {
          updateCustomer(data.customer);
        }
        setIsEditMode(false);
        setEditForm({});
        showSuccess("Profile updated successfully!");
      } else {
        showError(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showError("Failed to update profile");
    } finally {
      setIsUpdating(false);
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
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
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
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                {!isEditMode && (
                  <button
                    onClick={handleEditMode}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditMode ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={editForm.name || ""}
                        onChange={(e) =>
                          handleFormChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) =>
                          handleFormChange("email", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={editForm.phone || ""}
                        onChange={(e) =>
                          handleFormChange("phone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        value={editForm.address || ""}
                        onChange={(e) =>
                          handleFormChange("address", e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isUpdating}
                      className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isUpdating ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
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
                    <p className="text-gray-900">
                      {customer.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <p className="text-gray-900">
                      {customer.address || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <p className="text-gray-900">
                      {formatDate(customer.joinDate)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Orders
                    </label>
                    <p className="text-gray-900">{customer.totalOrders}</p>
                  </div>
                </div>
              )}
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
              ) : orders.filter((order) => order.status === "delivered")
                  .length === 0 ? (
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
