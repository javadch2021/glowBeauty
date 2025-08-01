import React from 'react';
import { Order } from '../../atoms/types/CustomerTypes';

interface PurchaseHistoryCardProps {
  order: Order;
}

export const PurchaseHistoryCard: React.FC<PurchaseHistoryCardProps> = ({ order }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between mb-2">
        <span className="font-medium">Order {order.id}</span>
        <span className="text-green-600 font-semibold">${order.total.toFixed(2)}</span>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        {order.items.map((item, i) => (
          <div key={i}>
            {item.quantity}x {item.name} (${(item.quantity * item.price).toFixed(2)})
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">Date: {order.date}</p>
    </div>
  );
};
