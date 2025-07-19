import React from "react";
import { Customer } from "../forms/Landing";

interface CustomerDetailsProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  customer,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !customer) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Mock order history data - in a real app, this would come from props or API
  const orderHistory = [
    {
      id: 1,
      date: "2024-01-15",
      total: 89.99,
      status: "Delivered",
      items: 3,
    },
    {
      id: 2,
      date: "2024-01-08",
      total: 156.5,
      status: "Delivered",
      items: 2,
    },
    {
      id: 3,
      date: "2023-12-22",
      total: 45.0,
      status: "Delivered",
      items: 1,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Customer Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Customer Info */}
        <div className="px-6 py-6">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-16 w-16">
              <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xl font-medium text-gray-700">
                  {customer.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {customer.name}
              </h3>
              <p className="text-sm text-gray-500">
                Customer since {formatDate(customer.joinDate)}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Contact Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-gray-900">
                    {customer.email}
                  </span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-sm text-gray-900">
                    {customer.phone}
                  </span>
                </div>
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-3 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm text-gray-900">
                    {customer.address}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Order Statistics
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Orders:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {customer.totalOrders}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Spent:</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${customer.totalSpent.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Average Order:</span>
                  <span className="text-sm font-medium text-gray-900">
                    $
                    {customer.totalOrders > 0
                      ? (customer.totalSpent / customer.totalOrders).toFixed(2)
                      : "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              Recent Orders
            </h4>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderHistory.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(order.date)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {order.items}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
