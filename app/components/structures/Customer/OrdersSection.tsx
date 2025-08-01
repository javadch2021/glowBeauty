import React from 'react';
import { Order } from '../../atoms/types/CustomerTypes';
import { OrderCard } from '../../partials/Customer/OrderCard';

interface OrdersSectionProps {
  orders: Order[];
}

export const OrdersSection: React.FC<OrdersSectionProps> = ({ orders }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Order Status</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};
