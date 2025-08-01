import { User, Order, Ticket } from '../types/CustomerTypes';

export const mockUser: User = {
  name: 'Amina Khalil',
  email: 'amina@example.com',
  phone: '+1 234 567 890',
  address: '123 Beauty Lane, Cairo, Egypt',
  avatar: 'https://placehold.co/100x100?text=AM',
};

export const mockOrders: Order[] = [
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

export const mockTickets: Ticket[] = [
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
