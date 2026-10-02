# Mini E-Commerce Demo Project (MERN Stack)

A clean, modern, and production-ready architecture specification for a **Mini E-Commerce Demo Project** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with **Tailwind CSS**.

---

## 📑 Project Overview

This project is designed as an architectural blueprint for a focused, robust, and clean MERN e-commerce application. It emphasizes core e-commerce capabilities—secure JWT authentication, role-based access control (Admin vs. Customer), dynamic category & product management, client-side cart handling with stock constraints, and atomic Cash on Delivery (COD) checkout with real-time stock reduction.

> **Note**: This repository currently houses complete architectural, database, API, frontend, and security documentation. Application code implementation strictly follows these specifications.

---

## 🛠️ Tech Stack Specification

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React.js (v18+) with Vite | Fast SPA bundling, reactive component lifecycle |
| **Frontend Language** | JavaScript (ES6+) | Standard modern client logic |
| **Styling System** | Tailwind CSS (v3+) | Utility-first, clean, modern, fully responsive UI |
| **Icons & Feedback** | Lucide React / Toast notifications | Visual cues, modern icon set, feedback banners |
| **HTTP Client** | Axios | Configured with interceptors for JWT authorization |
| **Backend Runtime** | Node.js (LTS) | Asynchronous event-driven JavaScript server environment |
| **Backend Framework** | Express.js (v4+) | Minimalist RESTful API routing and middleware pipeline |
| **Database** | MongoDB | Document-oriented NoSQL database for flexible data modeling |
| **ODM** | Mongoose (v8+) | Schema validation, business logic hooks, and queries |
| **Authentication** | JSON Web Tokens (JWT) + bcryptjs | Stateless authorization tokens & salted password hashing |

---

## 🏗️ Project Directory Structure

The project is divided into two distinct workspaces (`client` and `server`):

```text
AIProject1/
├── README.md                           # Main project overview and setup guidelines
├── docs/                               # Comprehensive project documentation
│   ├── ARCHITECTURE.md                 # System architecture, data flow & structure
│   ├── DATABASE_DESIGN.md              # MongoDB Mongoose schemas, ERD & relations
│   ├── API_SPECIFICATION.md            # REST API endpoints, schemas & payloads
│   ├── FRONTEND_SPECIFICATION.md       # Client UI/UX, pages, components & state
│   ├── SECURITY_AND_VALIDATION.md      # Validation logic, security rules & JWT flow
│   ├── DEMO_FLOW_AND_TESTING.md        # Step-by-step demo flow and test scenarios
│   └── DEVELOPMENT_ROADMAP.md          # Phased development execution plan
│
├── client/                             # React + Vite Frontend application
│   ├── public/                         # Static assets and favicon
│   ├── src/
│   │   ├── assets/                     # Images, branding assets
│   │   ├── components/                 # Reusable UI components
│   │   │   ├── admin/                  # Admin layout, sidebar, tables, modal forms
│   │   │   ├── common/                 # Button, Input, Modal, Badge, Toast, Loader
│   │   │   ├── layout/                 # Navbar, Footer, Container, ProtectedRoute
│   │   │   └── product/                # ProductCard, ProductGrid, CategoryFilter
│   │   ├── context/                    # React Context (AuthContext, CartContext)
│   │   ├── hooks/                      # Custom hooks (useAuth, useCart)
│   │   ├── pages/                      # Application route views
│   │   │   ├── admin/                  # AdminCategories, AdminProducts, AdminOrders
│   │   │   ├── CartPage.jsx            # Shopping cart overview & quantity controls
│   │   │   ├── CheckoutPage.jsx        # Shipping details & COD order placement
│   │   │   ├── HomePage.jsx            # Featured hero, categories, product grid
│   │   │   ├── LoginPage.jsx           # User and Admin login form
│   │   │   ├── MyOrdersPage.jsx        # Customer past order history
│   │   │   ├── ProductDetailsPage.jsx  # Single product view & stock display
│   │   │   ├── ProductsPage.jsx        # Searchable, filterable catalog
│   │   │   └── RegisterPage.jsx        # Customer registration
│   │   ├── services/                   # Axios API service wrappers
│   │   ├── utils/                      # Currency formatters, local storage helpers
│   │   ├── App.jsx                     # Root application routing
│   │   ├── index.css                   # Tailwind CSS imports & custom utility rules
│   │   └── main.jsx                    # React DOM entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                             # Node.js + Express Backend application
    ├── src/
    │   ├── config/                     # Database connection (db.js) & env configs
    │   ├── controllers/                # Request handlers
    │   │   ├── authController.js       # Register, login, profile check
    │   │   ├── categoryController.js   # Category CRUD operations
    │   │   ├── productController.js    # Product CRUD, filters, search
    │   │   └── orderController.js      # Order creation, customer & admin orders
    │   ├── middleware/                 # Custom Express middlewares
    │   │   ├── authMiddleware.js       # JWT verification & customer context
    │   │   ├── adminMiddleware.js      # Admin role enforcement
    │   │   ├── errorMiddleware.js     # Centralized error handler
    │   │   └── validateMiddleware.js  # Request validation helpers
    │   ├── models/                     # Mongoose data models
    │   │   ├── User.js                 # User schema (customer / admin)
    │   │   ├── Category.js             # Category schema
    │   │   ├── Product.js              # Product schema with stock and category ref
    │   │   └── Order.js                # Order schema with items & address
    │   ├── routes/                     # API route declarations
    │   │   ├── authRoutes.js           # /api/auth
    │   │   ├── categoryRoutes.js       # /api/categories
    │   │   ├── productRoutes.js        # /api/products
    │   │   └── orderRoutes.js          # /api/orders & /api/admin/orders
    │   ├── utils/                      # JWT generation, seed helper
    │   ├── app.js                      # Express application setup & middleware chain
    │   └── server.js                   # Server entry point (port listener)
    ├── .env.example                    # Environment variable template
    └── package.json
```

---

## 🎯 Key System Features

### 1. Authentication & Role-Based Authorization
- **Customer**: Register (`Name`, `Email`, `Password`, `Confirm Password`), Login, Logout.
- **Admin**: Dedicated admin privileges, access to protected admin APIs and dashboard.
- **Security**: Passwords encrypted via `bcrypt` (10 salt rounds); stateless session management via JSON Web Tokens with expiry.

### 2. Admin Dashboard
- **Category Management**: Create, view, update, delete product categories (`Name`, `Description`).
- **Product Management**: Create, edit, delete, view products (`Product name`, `Description`, `Price`, `Image`, `Category`, `Stock`).
- **Order Management**: View incoming orders across all customers, inspect shipping details and order items, update order statuses (`Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`).

### 3. Public Customer Storefront
- **Pages**: Home, Products Catalog, Product Details, Cart, Checkout, Login, Register, My Orders.
- **Catalog Navigation**: Live search by product name/description, instant category filter tabs (e.g. *All | Electronics | Fashion | Shoes*).
- **Responsive Layout**: Mobile-first design with smooth collapsible menus and optimized grid cards.

### 4. Cart & Stock Enforcement
- Add to cart, real-time quantity increment/decrement, line-item removal.
- Client-side checks preventing quantities from exceeding available stock.
- Dynamic total price recalculation.

### 5. Secure Checkout & Order Processing
- Checkout with shipping fields: `Name`, `Phone`, `Address`, `City`, `Pincode`.
- Payment method: **Cash on Delivery (COD)**.
- **Tamper-Proof Pricing**: Backend re-queries product database for actual prices and validates current stock availability before creating the order.
- **Stock Decrement**: Atomic stock reduction on order placement.
- Automatic cart cleanup upon order confirmation.

---

## 🔄 End-to-End Demo Flow

```text
Admin Login
   ↓
Add Category (e.g. Electronics, Fashion, Shoes)
   ↓
Add Product (e.g. Wireless Headphones, Stock: 15, Price: $59.99)
   ↓
Product Appears Immediately on Public Storefront
   ↓
Customer Registers / Logs In
   ↓
Customer Browses & Filters Catalog
   ↓
Adds Item to Cart (Quantity bounded by Stock)
   ↓
Proceeds to Checkout (Enters Shipping Address)
   ↓
Places Order (Cash on Delivery)
   ↓
Backend Re-validates Price & Deducts Stock in MongoDB
   ↓
Customer Reviews Order under "My Orders"
   ↓
Admin Inspects Order in Admin Panel & Updates Status (e.g. Pending → Confirmed → Shipped)
```

---

## 📚 Complete Documentation Index

For detailed specifications, refer to the documents in the `/docs` directory:

1. [System Architecture & Design](docs/ARCHITECTURE.md)
2. [Database Design & Schemas](docs/DATABASE_DESIGN.md)
3. [REST API Specification](docs/API_SPECIFICATION.md)
4. [Frontend & UI/UX Specification](docs/FRONTEND_SPECIFICATION.md)
5. [Security & Validation Rules](docs/SECURITY_AND_VALIDATION.md)
6. [Demo Flow & Test Scenarios](docs/DEMO_FLOW_AND_TESTING.md)
7. [Development Roadmap & Execution Plan](docs/DEVELOPMENT_ROADMAP.md)

---

## 🚀 Environment Requirements (For Future Implementation)

* **Node.js**: v18.x or v20.x LTS
* **MongoDB**: MongoDB Community Server 6.x/7.x or MongoDB Atlas cluster
* **Package Manager**: npm v9+ or yarn v1.22+
* **Browser**: Chrome, Edge, Safari, Firefox (Modern evergreen browsers)
