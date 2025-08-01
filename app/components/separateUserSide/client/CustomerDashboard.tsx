import React, { useState, useEffect } from "react";
import { DashboardTab, User } from "../../atoms/types/CustomerTypes";
import {
  mockUser,
  mockOrders,
  mockTickets,
} from "../../atoms/data/mockCustomerData";
import { DashboardHeader } from "../../partials/Customer/DashboardHeader";
import { DashboardTabs } from "../../partials/Customer/DashboardTabs";
import { ProfileSection } from "../../structures/Customer/ProfileSection";
import { OrdersSection } from "../../structures/Customer/OrdersSection";
import { TicketsSection } from "../../structures/Customer/TicketsSection";
import { PurchaseHistorySection } from "../../structures/Customer/PurchaseHistorySection";

interface CustomerDashboardProps {
  initialTab?: DashboardTab;
  customer?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  initialTab = "profile",
  customer,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);

  // Initialize user data from customer prop or fallback to mock data
  const initialUser: User = customer
    ? {
        name: customer.name,
        email: customer.email,
        phone: customer.phone || mockUser.phone,
        address: customer.address || mockUser.address,
        avatar: mockUser.avatar, // Keep mock avatar for now
      }
    : mockUser;

  const [user, setUser] = useState<User>(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<User>({ ...user });

  // Update active tab when initialTab prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleFormChange = (field: keyof User, value: string) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleSaveProfile = () => {
    setUser(editForm);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({ ...user });
    setIsEditing(false);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileSection
            user={user}
            editForm={editForm}
            isEditing={isEditing}
            onFormChange={handleFormChange}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
            onEdit={handleEditProfile}
          />
        );
      case "orders":
        return <OrdersSection orders={mockOrders} />;
      case "tickets":
        return <TicketsSection tickets={mockTickets} />;
      case "history":
        return <PurchaseHistorySection orders={mockOrders} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <DashboardHeader user={user} />

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="p-6">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
