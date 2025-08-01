import React from "react";
import { Ticket } from "../../atoms/types/CustomerTypes";
import { TicketCard } from "../../partials/Customer/TicketCard";
import { CustomerButton } from "../../atoms/ui/CustomerButton";

interface TicketsSectionProps {
  tickets: Ticket[];
}

export const TicketsSection: React.FC<TicketsSectionProps> = ({ tickets }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Support Tickets</h2>
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
        <CustomerButton variant="link" className="mt-4 text-sm font-medium">
          + Open New Ticket
        </CustomerButton>
      </div>
    </div>
  );
};
