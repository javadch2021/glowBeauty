import React from "react";
import { Order } from "../../atoms/types/CustomerTypes";
import { CustomerStatusBadge } from "../../atoms/ui/CustomerStatusBadge";

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex flex-wrap justify-between items-start mb-3">
        <div>
          <span className="font-bold text-gray-800">{order.id}</span>
          <p className="text-sm text-gray-600">{order.date}</p>
        </div>
        <CustomerStatusBadge status={order.status} />
      </div>
      <div className="text-sm text-gray-600">
        <p>
          <strong>{order.items.length}</strong> item(s) • $
          {order.total.toFixed(2)}
        </p>
      </div>
    </div>
  );
};
