import React from "react";
import { Order } from "~/lib/models";

interface OrderDetailsProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (
    orderId: number,
    status: Order["status"],
    trackingNumber?: string
  ) => void;
}

// Configuration for print invoice
// To change the website URL that appears on printed invoices,
// simply update the 'companyWebsite' value below
const PRINT_CONFIG = {
  companyName: "Beauty Store",
  companyAddress: "123 Beauty Lane, Cosmetic City, CC 12345",
  companyPhone: "(555) 123-4567",
  companyEmail: "orders@beautystore.com",
  companyWebsite: "www.beautystore.com", // ← Change this URL as needed
};

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  if (!isOpen || !order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePrint = () => {
    // Show a brief tip for clean printing
    console.log(
      "💡 Print Tip: In the print dialog, click 'More settings' and uncheck 'Headers and footers' to remove the page URL from the bottom of the printed page."
    );

    // Create a hidden iframe for printing (no new tab)
    const printFrame = document.createElement("iframe");
    printFrame.style.position = "absolute";
    printFrame.style.top = "-1000px";
    printFrame.style.left = "-1000px";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "none";

    document.body.appendChild(printFrame);

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice #${order.id}</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }

            @media print {
              @page { margin: 0; }
              html, body { margin: 0; padding: 0; }
            }

            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 15mm 10mm;
              background: white;
              color: black;
              font-family: 'Arial', sans-serif;
              font-size: 8pt;
              line-height: 1.2;
              min-height: 100vh;
              box-sizing: border-box;
            }

            .print-container {
              max-height: 275mm;
              overflow: hidden;
            }

            .print-header {
              border-bottom: 1px solid #374151;
              padding-bottom: 6pt;
              margin-bottom: 8pt;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }

            .company-info {
              display: flex;
              align-items: flex-start;
              gap: 6pt;
            }

            .company-logo {
              width: 25pt;
              height: 25pt;
              background-color: #fce7f3;
              border-radius: 3pt;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              color: #ec4899;
              font-size: 10pt;
            }

            .invoice-info {
              text-align: right;
              background-color: #f9fafb;
              padding: 4pt;
              border-radius: 3pt;
              border: 1px solid #e5e7eb;
              min-width: 100pt;
            }

            .print-section {
              margin-bottom: 6pt;
            }

            .section-title {
              font-size: 9pt;
              font-weight: bold;
              margin-bottom: 3pt;
              color: black;
            }

            .info-box {
              background-color: #f9fafb;
              padding: 4pt;
              border-radius: 3pt;
              border: 1px solid #e5e7eb;
            }

            .grid-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8pt;
            }

            .print-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 4pt;
              font-size: 7pt;
            }

            .print-table th,
            .print-table td {
              border: 1px solid #374151;
              padding: 2pt 3pt;
              text-align: left;
              vertical-align: top;
            }

            .print-table th {
              background-color: #f3f4f6;
              font-weight: bold;
              font-size: 7pt;
            }

            .print-total-row {
              border-top: 2px solid #374151;
              font-weight: bold;
              background-color: #f9fafb;
            }

            .summary-table {
              width: 120pt;
              margin-left: auto;
              font-size: 7pt;
            }

            .footer {
              margin-top: 8pt;
              padding-top: 4pt;
              border-top: 1px solid #d1d5db;
              text-align: center;
              color: #6b7280;
              font-size: 6pt;
            }

            h1 { font-size: 14pt; margin: 0 0 2pt 0; }
            h2 { font-size: 12pt; margin: 0 0 2pt 0; }
            h3 { font-size: 9pt; margin: 0 0 3pt 0; }
            p { margin: 0 0 2pt 0; font-size: 7pt; }
            .font-semibold { font-weight: 600; }
            .text-right { text-align: right; }

            /* Compact layout for single page */
            .items-section {
              max-height: 100pt;
              overflow: hidden;
            }

            .compact-info {
              font-size: 6pt;
              line-height: 1.1;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="print-header">
              <div class="company-info">
                <div class="company-logo">BS</div>
                <div>
                  <h1>${PRINT_CONFIG.companyName}</h1>
                  <p class="compact-info">${PRINT_CONFIG.companyAddress}</p>
                  <p class="compact-info">Phone: ${
                    PRINT_CONFIG.companyPhone
                  } | ${PRINT_CONFIG.companyEmail}</p>
                </div>
              </div>
              <div class="invoice-info">
                <h2>INVOICE</h2>
                <p class="font-semibold">Order #${order.id}</p>
                <p class="compact-info">${formatDate(order.orderDate)}</p>
                <p class="compact-info">Status: ${
                  order.status.charAt(0).toUpperCase() + order.status.slice(1)
                }</p>
              </div>
            </div>

            <div class="print-section">
              <h3 class="section-title">Bill To:</h3>
              <div class="info-box">
                <p class="font-semibold">${order.customerName}</p>
                <p class="compact-info">${order.customerEmail}</p>
                <p class="compact-info">${order.shippingAddress}</p>
              </div>
            </div>

            <div class="print-section">
              <div class="grid-2">
                <div>
                  <h3 class="section-title">Order Info</h3>
                  <p class="compact-info"><span class="font-semibold">Payment:</span> ${
                    order.paymentMethod
                  }</p>
                  ${
                    order.trackingNumber
                      ? `<p class="compact-info"><span class="font-semibold">Tracking:</span> ${order.trackingNumber}</p>`
                      : ""
                  }
                </div>
                <div>
                  <h3 class="section-title">Summary</h3>
                  <p class="compact-info"><span class="font-semibold">Items:</span> ${
                    order.items.length
                  } | <span class="font-semibold">Total:</span> $${order.total.toFixed(
      2
    )}</p>
                </div>
              </div>
            </div>

            <div class="print-section items-section">
              <h3 class="section-title">Order Items</h3>
              <table class="print-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.productName}</td>
                      <td>$${item.price.toFixed(2)}</td>
                      <td>${item.quantity}</td>
                      <td>$${item.total.toFixed(2)}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>

            <div class="print-section">
              <table class="print-table summary-table">
                <tbody>
                  <tr>
                    <td class="font-semibold">Subtotal:</td>
                    <td class="text-right">$${order.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td class="font-semibold">Tax:</td>
                    <td class="text-right">$${order.tax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td class="font-semibold">Shipping:</td>
                    <td class="text-right">${
                      order.shipping === 0
                        ? "Free"
                        : `$${order.shipping.toFixed(2)}`
                    }</td>
                  </tr>
                  <tr class="print-total-row">
                    <td class="font-semibold">Total:</td>
                    <td class="text-right font-semibold">$${order.total.toFixed(
                      2
                    )}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="footer">
              <p>Thank you for your business! | ${
                PRINT_CONFIG.companyEmail
              } | ${PRINT_CONFIG.companyWebsite}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const printDoc =
      printFrame.contentDocument || printFrame.contentWindow?.document;
    if (printDoc) {
      printDoc.open();
      printDoc.write(printContent);
      printDoc.close();

      // Wait for content to load, then print directly
      printFrame.onload = () => {
        const printWindow = printFrame.contentWindow;
        if (printWindow) {
          // Try to disable browser headers/footers programmatically
          try {
            // For Chrome/Edge - disable headers and footers
            printWindow.print();
          } catch (e) {
            // Fallback for other browsers
            printWindow.print();
          }
        }
        // Remove the iframe after printing
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 1000);
      };
    }
  };

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Order #{order.id}
            </h2>
            <p className="text-sm text-gray-500">
              Placed on {formatDate(order.orderDate)}
            </p>
          </div>
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

        <div className="px-6 py-6">
          {/* Order Status and Actions */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="mt-3 sm:mt-0">
              <select
                value={order.status}
                onChange={(e) =>
                  onUpdateStatus(order.id, e.target.value as Order["status"])
                }
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Customer Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Name:
                  </span>
                  <p className="text-sm text-gray-900">{order.customerName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Email:
                  </span>
                  <p className="text-sm text-gray-900">{order.customerEmail}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Shipping Address:
                  </span>
                  <p className="text-sm text-gray-900">
                    {order.shippingAddress}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Payment Method:
                  </span>
                  <p className="text-sm text-gray-900">{order.paymentMethod}</p>
                </div>
                {order.trackingNumber && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Tracking Number:
                    </span>
                    <p className="text-sm text-gray-900 font-mono">
                      {order.trackingNumber}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Subtotal:
                  </span>
                  <span className="text-sm text-gray-900">
                    ${order.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Tax:
                  </span>
                  <span className="text-sm text-gray-900">
                    ${order.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Shipping:
                  </span>
                  <span className="text-sm text-gray-900">
                    {order.shipping === 0
                      ? "Free"
                      : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">
                      Total:
                    </span>
                    <span className="text-base font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Order Items
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={item.productImage}
                              alt={item.productName}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.productName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            title="Tip: Uncheck 'Headers and footers' in print settings to remove page URL"
          >
            Print Order
          </button>
        </div>
      </div>
    </div>
  );
};
