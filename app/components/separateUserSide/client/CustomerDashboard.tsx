/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: { name: string; quantity: number; price: number }[];
}

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  message: string;
}

const CustomerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'tickets' | 'history'>('profile');

  // Mock User Data
  const [user, setUser] = useState({
    name: 'Amina Khalil',
    email: 'amina@example.com',
    phone: '+1 234 567 890',
    address: '123 Beauty Lane, Cairo, Egypt',
    avatar: 'https://placehold.co/100x100?text=AM',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });

  // Mock Orders
  const orders: Order[] = [
    {
      id: 'ORD-2024-001',
      date: '2024-04-01',
      total: 89.97,
      status: 'delivered',
      items: [
        { name: 'Hydrating Facial Serum', quantity: 1, price: 29.99 },
        { name: 'Lip Gloss Trio', quantity: 2, price: 19.99 },
      ],
    },
    {
      id: 'ORD-2024-002',
      date: '2024-04-15',
      total: 54.98,
      status: 'shipped',
      items: [
        { name: 'Glow Highlighter', quantity: 1, price: 24.99 },
        { name: 'Nail Polish Set', quantity: 1, price: 22.99 },
      ],
    },
    {
      id: 'ORD-2024-003',
      date: '2024-05-01',
      total: 34.99,
      status: 'processing',
      items: [
        { name: 'Revitalizing Eye Cream', quantity: 1, price: 34.99 },
      ],
    },
    {
      id: 'ORD-2024-004',
      date: '2024-05-10',
      total: 18.99,
      status: 'cancelled',
      items: [
        { name: 'Clarifying Face Wash', quantity: 1, price: 18.99 },
      ],
    },
  ];

  // Mock Tickets
  const tickets: Ticket[] = [
    {
      id: 'TICK-001',
      subject: 'Missing item in order',
      status: 'open',
      createdAt: '2024-05-02',
      message: 'I received my order but the serum was missing.',
    },
    {
      id: 'TICK-002',
      subject: 'Return request',
      status: 'resolved',
      createdAt: '2024-04-20',
      message: 'Wanted to return opened nail polish.',
    },
  ];

  // Status Badge Colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSaveProfile = () => {
    setUser(editForm);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex items-center gap-4">
          <img
            src={user.avatar}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-4 border-pink-100"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            {[
              { key: 'profile', label: 'Profile' },
              { key: 'orders', label: 'Orders' },
              { key: 'tickets', label: 'Support' },
              { key: 'history', label: 'Purchase History' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
                    : 'text-gray-600 hover:text-pink-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setEditForm({ ...user });
                          setIsEditing(false);
                        }}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b">
                      <span className="font-medium">Name</span>
                      <span className="text-gray-600">{user.name}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="font-medium">Email</span>
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="font-medium">Phone</span>
                      <span className="text-gray-600">{user.phone}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="font-medium">Address</span>
                      <span className="text-gray-600 text-right max-w-xs">{user.address}</span>
                    </div>
                    <div className="pt-4">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Order Status</h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex flex-wrap justify-between items-start mb-3">
                        <div>
                          <span className="font-bold text-gray-800">{order.id}</span>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>
                          <strong>{order.items.length}</strong> item(s) • ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tickets Tab */}
            {activeTab === 'tickets' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Support Tickets</h2>
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{ticket.subject}</h3>
                        <span className="text-xs text-gray-500">{ticket.createdAt}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{ticket.message}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          ticket.status === 'open'
                            ? 'bg-red-100 text-red-800'
                            : ticket.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {ticket.status.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                  <button className="mt-4 text-pink-600 hover:underline text-sm font-medium">
                    + Open New Ticket
                  </button>
                </div>
              </div>
            )}

            {/* Purchase History Tab */}
            {activeTab === 'history' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Purchase History</h2>
                <div className="space-y-3">
                  {orders
                    .filter((o) => o.status !== 'cancelled')
                    .map((order) => (
                      <div key={order.id} className="bg-gray-50 p-4 rounded-lg">
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
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;