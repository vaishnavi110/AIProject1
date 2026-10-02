# Development Roadmap & Execution Plan

This document provides a phased, step-by-step development plan for implementing the Mini E-Commerce Demo Project. Each phase builds upon the previous one, ensuring incremental progress with testable milestones.

---

## Overview

| Phase | Focus Area | Estimated Effort |
| :--- | :--- | :--- |
| Phase 1 | Project Setup & Configuration | ~1 hour |
| Phase 2 | Backend: Database Models | ~1 hour |
| Phase 3 | Backend: Authentication System | ~2 hours |
| Phase 4 | Backend: Category & Product APIs | ~2 hours |
| Phase 5 | Backend: Order APIs | ~2 hours |
| Phase 6 | Frontend: Setup & Layout | ~1.5 hours |
| Phase 7 | Frontend: Authentication Pages | ~2 hours |
| Phase 8 | Frontend: Public Storefront | ~3 hours |
| Phase 9 | Frontend: Cart & Checkout | ~2.5 hours |
| Phase 10 | Frontend: Admin Dashboard | ~3 hours |
| Phase 11 | Integration Testing & Polish | ~2 hours |

**Total Estimated Effort**: ~22 hours

---

## Phase 1: Project Setup & Configuration

### 1.1 Initialize Project Structure

```text
Tasks:
├── Create root directory with /client and /server folders
├── Initialize /server with npm init
├── Initialize /client with Vite + React template
└── Create .gitignore for node_modules, .env, dist
```

### 1.2 Server Dependencies

```text
Production:
├── express
├── mongoose
├── jsonwebtoken
├── bcryptjs
├── cors
├── dotenv

Development:
└── nodemon
```

### 1.3 Client Dependencies

```text
Production:
├── react-router-dom
├── axios
├── react-hot-toast
├── lucide-react

Development:
├── tailwindcss
├── postcss
└── autoprefixer
```

### 1.4 Configuration Files

```text
├── server/.env (from .env.example template)
├── server/package.json scripts: { "dev": "nodemon src/server.js" }
├── client/tailwind.config.js
├── client/postcss.config.js
├── client/vite.config.js (proxy to backend)
└── client/src/index.css (Tailwind directives)
```

### Milestone ✅
- `npm run dev` starts backend on port 5000
- `npm run dev` starts frontend on port 5173
- Tailwind CSS classes render correctly
- MongoDB connection successful

---

## Phase 2: Backend — Database Models

### Tasks

```text
├── Create config/db.js (MongoDB connection with Mongoose)
├── Create models/User.js
│   ├── Schema: name, email, password, role
│   ├── Pre-save hook: bcrypt password hashing
│   └── Unique index on email
├── Create models/Category.js
│   ├── Schema: name (unique), description
│   └── Timestamps enabled
├── Create models/Product.js
│   ├── Schema: name, description, price, image, category (ref), stock
│   ├── Price validator: must be > 0
│   └── Stock validator: must be >= 0
└── Create models/Order.js
    ├── Schema: user (ref), products[], totalAmount, shippingAddress{}, status
    ├── Status enum: Pending, Confirmed, Shipped, Delivered, Cancelled
    └── Default status: Pending
```

### Milestone ✅
- All 4 models compile without errors
- Models can be imported and used in test queries
- Validators reject invalid data

---

## Phase 3: Backend — Authentication System

### Tasks

```text
├── Create utils/generateToken.js (JWT sign helper)
├── Create middleware/authMiddleware.js
│   └── Verify JWT, attach req.user
├── Create middleware/adminMiddleware.js
│   └── Check req.user.role === 'admin'
├── Create middleware/errorMiddleware.js
│   └── Centralized error handler
├── Create controllers/authController.js
│   ├── register: validate → check duplicate → hash password → create user → return token
│   └── login: validate → find user → compare password → return token
├── Create routes/authRoutes.js
│   ├── POST /api/auth/register
│   └── POST /api/auth/login
├── Create app.js (Express app setup with middleware chain)
├── Create server.js (Listen on PORT, connect to DB)
└── Create seed.js (Seed initial admin user)
```

### Milestone ✅
- Register endpoint creates user in MongoDB with hashed password
- Login endpoint returns valid JWT token
- Protected endpoint returns 401 without token
- Admin endpoint returns 403 for non-admin users
- Admin seed account works

---

## Phase 4: Backend — Category & Product APIs

### Tasks

```text
├── Create controllers/categoryController.js
│   ├── getCategories: find all, sorted by name
│   ├── createCategory: validate name, check duplicate, create
│   ├── updateCategory: find by ID, update fields
│   └── deleteCategory: check for linked products, then delete
├── Create routes/categoryRoutes.js
│   ├── GET    /api/categories (public)
│   ├── POST   /api/categories (admin)
│   ├── PUT    /api/categories/:id (admin)
│   └── DELETE /api/categories/:id (admin)
├── Create controllers/productController.js
│   ├── getProducts: filter by category, search by name, populate category
│   ├── getProduct: find by ID, populate category
│   ├── createProduct: validate all fields, verify category exists, create
│   ├── updateProduct: find by ID, update fields
│   └── deleteProduct: find by ID, delete
└── Create routes/productRoutes.js
    ├── GET    /api/products (public, with ?category=&search= support)
    ├── GET    /api/products/:id (public)
    ├── POST   /api/products (admin)
    ├── PUT    /api/products/:id (admin)
    └── DELETE /api/products/:id (admin)
```

### Milestone ✅
- CRUD operations for categories work via API testing tool (Postman/Thunder Client)
- CRUD operations for products work
- Category filter and search query parameters return correct results
- Proper error responses for invalid data

---

## Phase 5: Backend — Order APIs

### Tasks

```text
├── Create controllers/orderController.js
│   ├── createOrder:
│   │   ├── Validate products array and shipping address
│   │   ├── Fetch each product from DB (get real price)
│   │   ├── Verify stock >= quantity for each item
│   │   ├── Calculate totalAmount server-side
│   │   ├── Create Order document with product snapshots
│   │   ├── Atomically decrement stock for each product
│   │   └── Return created order
│   ├── getMyOrders: find by req.user._id, sort by createdAt desc
│   ├── getAllOrders (admin): find all, populate user name/email, sort desc
│   └── updateOrderStatus (admin): validate status enum, update order
└── Create routes/orderRoutes.js
    ├── POST   /api/orders (auth)
    ├── GET    /api/orders/my-orders (auth)
    ├── GET    /api/admin/orders (admin)
    └── PATCH  /api/admin/orders/:id/status (admin)
```

### Milestone ✅
- Order creation validates stock and uses server-side prices
- Stock decrements correctly after order
- Customer sees only their orders
- Admin sees all orders
- Status updates persist correctly

---

## Phase 6: Frontend — Setup & Layout

### Tasks

```text
├── Configure Tailwind CSS with custom theme colors
├── Set up React Router in App.jsx with all routes
├── Create Axios instance with base URL and JWT interceptor
├── Create AuthContext with login, register, logout, persistence
├── Create CartContext with add, update, remove, clear, persistence
├── Create components/layout/Navbar.jsx
│   ├── Brand logo, nav links, cart badge, user menu
│   └── Mobile hamburger menu
├── Create components/layout/Footer.jsx
├── Create components/layout/Container.jsx
├── Create components/layout/ProtectedRoute.jsx
├── Create components/layout/AdminRoute.jsx
└── Create components/common/ (Button, Input, Modal, Loader, EmptyState, Badge, ConfirmDialog)
```

### Milestone ✅
- Navigation works across all routes
- Auth context persists login state across page refreshes
- Cart context persists items across page refreshes
- Protected routes redirect unauthenticated users
- Common components render correctly with different props

---

## Phase 7: Frontend — Authentication Pages

### Tasks

```text
├── Create pages/RegisterPage.jsx
│   ├── Form: name, email, password, confirm password
│   ├── Client-side validation with inline error messages
│   ├── Submit calls AuthContext.register()
│   └── Success: redirect to Home, toast message
├── Create pages/LoginPage.jsx
│   ├── Form: email, password
│   ├── Client-side validation
│   ├── Submit calls AuthContext.login()
│   └── Success: redirect to Home (or Admin if admin user)
└── Create services/authService.js
    ├── registerUser(data) → POST /api/auth/register
    └── loginUser(data) → POST /api/auth/login
```

### Milestone ✅
- Users can register and are auto-logged in
- Users can login and see their name in navbar
- Users can logout
- Form validation shows errors before submission
- Admin login redirects to admin dashboard

---

## Phase 8: Frontend — Public Storefront Pages

### Tasks

```text
├── Create services/productService.js & categoryService.js
├── Create components/product/ProductCard.jsx
├── Create components/product/ProductGrid.jsx
├── Create components/product/CategoryFilter.jsx
├── Create pages/HomePage.jsx
│   ├── Hero section with CTA
│   ├── Featured categories
│   └── Latest products grid (limit 8)
├── Create pages/ProductsPage.jsx
│   ├── Search input with debounced API call
│   ├── Category filter tabs
│   ├── Product grid with loading state
│   └── Empty state when no results
└── Create pages/ProductDetailsPage.jsx
    ├── Large product image
    ├── Product info: name, price, category, description
    ├── Stock availability indicator
    ├── Quantity selector (bounded by stock)
    └── Add to Cart button
```

### Milestone ✅
- Homepage displays hero, categories, and latest products
- Products page shows full catalog with search and filter
- Product details page shows all product information
- Category filter works correctly
- Search returns matching products
- Responsive grid adapts to screen size

---

## Phase 9: Frontend — Cart & Checkout

### Tasks

```text
├── Create pages/CartPage.jsx
│   ├── List cart items with image, name, price
│   ├── Quantity controls [−] [qty] [+] (bounded by stock)
│   ├── Remove button per item
│   ├── Cart summary with subtotal
│   ├── "Proceed to Checkout" button
│   └── Empty state with "Continue Shopping" link
├── Create pages/CheckoutPage.jsx
│   ├── Order summary sidebar (items + total)
│   ├── Shipping form: name, phone, address, city, pincode
│   ├── Payment info: "Cash on Delivery" (display only)
│   ├── "Place Order" button with loading state
│   ├── On success: clear cart, show toast, redirect to My Orders
│   └── Redirect to cart if cart is empty
├── Create pages/MyOrdersPage.jsx
│   ├── List all user orders (newest first)
│   ├── Each order shows: items, total, status badge, date
│   └── Empty state: "No orders yet"
└── Create services/orderService.js
    ├── placeOrder(data) → POST /api/orders
    └── getMyOrders() → GET /api/orders/my-orders
```

### Milestone ✅
- Cart updates quantities correctly, bounded by stock
- Cart total recalculates dynamically
- Checkout validates shipping fields
- Order placement succeeds and clears cart
- My Orders displays order history with status badges

---

## Phase 10: Frontend — Admin Dashboard

### Tasks

```text
├── Create components/admin/AdminLayout.jsx (sidebar + content)
├── Create components/admin/Sidebar.jsx
├── Create pages/admin/AdminDashboard.jsx
│   ├── Summary cards: total products, categories, orders
│   └── Recent orders table
├── Create pages/admin/AdminCategories.jsx
│   ├── Categories data table
│   ├── "Add Category" button → opens CategoryForm modal
│   ├── Edit button → opens CategoryForm modal with data
│   ├── Delete button → ConfirmDialog → delete API call
│   └── Loading and empty states
├── Create pages/admin/AdminProducts.jsx
│   ├── Products data table (image, name, price, category, stock)
│   ├── "Add Product" button → opens ProductForm modal
│   ├── Edit button → opens ProductForm modal with data
│   ├── Delete button → ConfirmDialog → delete API call
│   └── Loading and empty states
├── Create pages/admin/AdminOrders.jsx
│   ├── Orders data table (ID, customer, items, total, status, date)
│   ├── Inline status dropdown (OrderStatusSelect)
│   ├── Expandable order details (items list, shipping address)
│   └── Loading and empty states
└── Create services/adminService.js
    ├── getAllOrders() → GET /api/admin/orders
    └── updateOrderStatus(id, status) → PATCH /api/admin/orders/:id/status
```

### Milestone ✅
- Admin dashboard shows summary statistics
- Categories CRUD works with modal forms
- Products CRUD works with modal forms and category dropdown
- Orders table displays all orders with status management
- Delete operations show confirmation dialog
- All admin routes protected from non-admin users

---

## Phase 11: Integration Testing & Polish

### Tasks

```text
├── End-to-end flow testing (full demo flow from Section 1)
├── Cross-browser testing (Chrome, Firefox, Safari, Edge)
├── Mobile responsiveness testing
├── Error handling verification
│   ├── Network errors show toast messages
│   ├── 401 errors trigger logout
│   └── Validation errors display inline
├── Loading states for all API calls
├── Empty states for all list views
├── Toast messages for all CRUD operations
├── Final UI/UX review and polish
│   ├── Consistent spacing and typography
│   ├── Smooth transitions
│   ├── Proper color contrast
│   └── Accessible form labels
└── Code cleanup
    ├── Remove console.logs
    ├── Add meaningful comments
    └── Verify .env.example is complete
```

### Milestone ✅
- Complete demo flow works without errors
- Application is responsive on all screen sizes
- All edge cases handled gracefully
- Clean, professional UI

---

## Dependency Installation Commands

### Server Setup

```bash
cd server
npm init -y
npm install express mongoose jsonwebtoken bcryptjs cors dotenv
npm install -D nodemon
```

### Client Setup

```bash
cd client
npm create vite@latest ./ -- --template react
npm install react-router-dom axios react-hot-toast lucide-react
npm install -D tailwindcss @tailwindcss/vite
```

---

## npm Scripts

### Server `package.json`

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "seed": "node src/utils/seed.js"
  }
}
```

### Client `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## Scope Boundaries (What NOT to Build)

The following features are explicitly **excluded** from this project:

| ❌ Excluded Feature | Reason |
| :--- | :--- |
| Payment Gateway (Stripe, Razorpay) | COD only; keeps project simple |
| Wishlist | Out of scope for mini project |
| Product Reviews & Ratings | Out of scope |
| Coupons & Discount Codes | Out of scope |
| Supplier / Multi-Vendor | Single admin only |
| Advanced Analytics Dashboard | Out of scope |
| Email Notifications | Out of scope |
| Image Upload (Multer/Cloudinary) | Using image URLs instead |
| Pagination | Optional enhancement for future |
| Unit / Integration Tests (automated) | Manual testing specified |
