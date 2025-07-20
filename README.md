# Beauty E-commerce Platform

A modern, full-stack e-commerce platform built with Remix, TypeScript, and MongoDB. Features a beautiful landing page for customers and a comprehensive admin dashboard for managing products, orders, and customers.

## 🚀 Features

### Customer Features

- **Beautiful Landing Page** with hero section and product showcase
- **Product Search & Filtering** by name, description, and category
- **Shopping Cart** with add/remove functionality
- **Responsive Design** optimized for all devices
- **User Authentication** with login and registration

### Admin Dashboard

- **Product Management** - Add, edit, delete, and view products
- **Customer Management** - View customer details and order history
- **Order Management** - Track orders with status updates
- **Analytics Dashboard** - Sales charts, top products, and revenue insights
- **Activity Logging** - Track all admin actions for audit purposes
- **Real-time Updates** - Changes sync immediately across all views

## 🛠 Tech Stack

- **Frontend**: Remix, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Database**: MongoDB with Mongoose ODM
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom components
- **Type Safety**: Full TypeScript implementation

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd learningRemix
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/remix_ecommerce
   NODE_ENV=development
   ```

4. **Database Setup**

   ```bash
   # Seed the database with sample data
   npm run seed

   # Check database status
   npm run seed:status

   # Reset database (optional)
   npm run seed:reset
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 🗂 Project Structure

```
app/
├── components/           # Reusable UI components
│   ├── admin/           # Admin dashboard components
│   ├── forms/           # Form components
│   └── partials/        # Page sections and layouts
├── contexts/            # React contexts for state management
├── lib/                 # Core application logic
│   ├── data/           # Seed data and fixtures
│   ├── models.ts       # TypeScript interfaces and types
│   ├── mongodb.ts      # MongoDB connection and configuration
│   ├── seed.ts         # Database seeding utilities
│   ├── services/       # Business logic and data services
│   └── utils/          # Utility functions and helpers
├── routes/             # Remix routes (pages and API endpoints)
├── styles/             # Global styles and Tailwind config
└── entry.client.tsx    # Client-side entry point
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript type checking
- `npm run seed` - Seed database with sample data
- `npm run seed:status` - Check database status
- `npm run seed:reset` - Reset and reseed database

## 🌐 Routes

### Public Routes

- `/` - Landing page with product showcase
- `/home` - Alternative home page route

### Admin Routes

- `/admin` - Admin dashboard overview
- `/admin/products` - Product management
- `/admin/customers` - Customer management
- `/admin/orders` - Order management
- `/admin/analytics` - Analytics and reports

## 🗄 Database Schema

### Products

```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}
```

### Customers

```typescript
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
}
```

### Orders

```typescript
interface Order {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  status: "pending" | "processing" | "shipped" | "delivered";
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
}
```

## 🔧 Configuration

### MongoDB Configuration

The application uses MongoDB for data persistence. Configure your connection in the `.env` file:

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/remix_ecommerce

# MongoDB Atlas (cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/remix_ecommerce
```

### Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Setup

Ensure your production environment has:

- Node.js runtime
- MongoDB database access
- Environment variables configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Remix](https://remix.run/) - Full stack web framework
- Styled with [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- Database powered by [MongoDB](https://www.mongodb.com/) - NoSQL database
- Images from [Unsplash](https://unsplash.com/) - Beautiful stock photography

---

**Happy coding!** 🎉
