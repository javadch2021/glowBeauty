import React from "react";
import { Ticket } from "../../atoms/types/CustomerTypes";
import { CustomerStatusBadge } from "../../atoms/ui/CustomerStatusBadge";

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between mb-2">
        <h3 className="font-medium">{ticket.subject}</h3>
        <span className="text-xs text-gray-500">{ticket.createdAt}</span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{ticket.message}</p>
      <CustomerStatusBadge status={ticket.status} />
    </div>
  );
};
