export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: { name: string; quantity: number; price: number }[];
}

export interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  message: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
}

export type DashboardTab = 'profile' | 'orders' | 'tickets' | 'history';
