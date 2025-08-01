import React from 'react';
import { Order } from '../../atoms/types/CustomerTypes';
import { PurchaseHistoryCard } from '../../partials/Customer/PurchaseHistoryCard';

interface PurchaseHistorySectionProps {
  orders: Order[];
}

export const PurchaseHistorySection: React.FC<PurchaseHistorySectionProps> = ({ orders }) => {
  const completedOrders = orders.filter((o) => o.status !== 'cancelled');

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Purchase History</h2>
      <div className="space-y-3">
        {completedOrders.map((order) => (
          <PurchaseHistoryCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};
