# System Architecture & Design

This document details the architectural patterns, structural design, and technical decisions governing the **Mini E-Commerce Demo Project** using the **MERN Stack**.

---

## 1. High-Level Architectural Pattern

The application adopts a **Decoupled Client-Server (SPA + REST API)** architecture:

```text
┌────────────────────────────────────────────────────────┐
│                   Client Layer (SPA)                   │
│       React.js 18 + Vite + Tailwind CSS + Axios        │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / REST (JSON)
                            │ Bearer JWT Authentication
┌───────────────────────────▼────────────────────────────┐
│                   Server Layer (API)                   │
│           Node.js + Express.js REST Framework          │
│  - Middleware: Auth Guard, Admin Guard, CORS, Parser   │
│  - Controllers: Auth, Category, Product, Order         │
│  - Data Access: Mongoose ODM                           │
└───────────────────────────┬────────────────────────────┘
                            │ Wire Protocol
┌───────────────────────────▼────────────────────────────┐
│                  Database Layer (NoSQL)                │
│             MongoDB (Collections & Indexes)            │
└────────────────────────────────────────────────────────┘
```

---

## 2. Server Architecture (Node.js & Express)

The backend follows a strict **Layered MVC-Style Architecture** for clarity, maintainability, and clean separation of concerns:

```text
Request Incoming
    │
    ▼
[Express Built-in Middlewares]  (express.json, cors, morgan/logger)
    │
    ▼
[Routing Layer]                 (routes/authRoutes.js, productRoutes.js, ...)
    │
    ▼
[Security / Auth Middlewares]   (authMiddleware.js, adminMiddleware.js)
    │
    ▼
[Controller Layer]              (Business logic, validation, orchestrates models)
    │
    ▼
[Mongoose ODM / Model Layer]    (Data schemas, queries, validation rules)
    │
    ▼
[Database Layer]                (MongoDB instances)
    │
    ▼
[Error Handling Middleware]     (Centralized JSON error responses)
```

### Key Server Design Principles
1. **Stateless Operations**: No server-side session cookies or session state in memory. Authentication status is verified purely through stateless signed JWT tokens.
2. **Controller-Service Isolation**: Route definitions contain zero business logic; they only wire up URLs, middlewares, and controller handlers.
3. **Fail-Fast Error Pipeline**: All asynchronous controller logic passes unhandled errors to the centralized `errorMiddleware`, ensuring consistent error formatting and preventing server crashes.
4. **Data Integrity Enforcement**: All calculations affecting financial numbers (order total, unit prices) or inventory quantities (stock decrement) occur on the server within atomic database queries.

---

## 3. Client Architecture (React & Vite)

The frontend is an optimized **Single Page Application (SPA)** powered by Vite.

```text
               ┌───────────────────────────────┐
               │          App.jsx              │
               │   (React Router Container)    │
               └──────────────┬────────────────┘
                              │
         ┌────────────────────┴────────────────────┐
         │                                         │
┌────────▼────────┐                       ┌────────▼────────┐
│   AuthContext   │                       │   CartContext   │
│ (User & Token)  │                       │ (Items & Count) │
└────────┬────────┘                       └────────┬────────┘
         │                                         │
         └────────────────────┬────────────────────┘
                              │
               ┌──────────────▼────────────────┐
               │          Router Views         │
               │  - Public Storefront Pages    │
               │  - Customer Protected Pages   │
               │  - Admin Protected Routes     │
               └──────────────┬────────────────┘
                              │
               ┌──────────────▼────────────────┐
               │    Axios API Service Layer    │
               │  (Auto-attaches Auth Headers) │
               └───────────────────────────────┘
```

### Key Client Design Principles
1. **Centralized Authentication Context**: `AuthContext` exposes `user`, `token`, `login()`, `logout()`, and `isAdmin` flag, synchronizing with `localStorage`.
2. **Client-Side Cart Store**: `CartContext` maintains cart items, auto-syncing with `localStorage` so items persist on page reloads.
3. **Route Guards**: Custom components `<ProtectedRoute>` and `<AdminRoute>` block unauthorized users before rendering private views.
4. **Declarative Styling**: Utility-first styling with Tailwind CSS avoids CSS specificity collisions and ensures responsive layouts out of the box.

---

## 4. Sequence Diagrams

### 4.1 Authentication & Authorization Flow

```text
Customer/Admin                React Client                 Express API               MongoDB
      │                            │                            │                       │
      │ 1. Enter Credentials       │                            │                       │
      ├───────────────────────────>│                            │                       │
      │                            │ 2. POST /api/auth/login    │                       │
      │                            ├───────────────────────────>│                       │
      │                            │                            │ 3. Find User by Email │
      │                            │                            ├──────────────────────>│
      │                            │                            │<──────────────────────┤
      │                            │                            │ 4. bcrypt.compare()   │
      │                            │                            │ 5. Sign JWT Token     │
      │                            │ 6. Response {token, user}  │                       │
      │                            │<───────────────────────────┤                       │
      │                            │                            │                       │
      │                            │ 7. Store Token & Role      │                       │
      │ 8. Redirect (Home/Admin)   │                            │                       │
      │<───────────────────────────┤                            │                       │
```

---

### 4.2 Order Placement & Tamper-Proof Price Validation

```text
Customer                     React Client                 Express API               MongoDB
   │                              │                            │                       │
   │ 1. Click "Place Order"       │                            │                       │
   ├─────────────────────────────>│                            │                       │
   │                              │ 2. POST /api/orders        │                       │
   │                              │    (Items: id, qty ONLY)   │                       │
   │                              │    (Token in Header)       │                       │
   │                              ├───────────────────────────>│                       │
   │                              │                            │ 3. Verify JWT Token   │
   │                              │                            │ 4. For each item:     │
   │                              │                            │    Fetch Product by ID│
   │                              │                            ├──────────────────────>│
   │                              │                            │<──────────────────────┤
   │                              │                            │ 5. Check: stock >= qty│
   │                              │                            │ 6. Calc: Real Total   │
   │                              │                            │ 7. Create Order doc   │
   │                              │                            │ 8. Reduce stock ($inc)│
   │                              │                            ├──────────────────────>│
   │                              │                            │<──────────────────────┤
   │                              │ 9. 201 Created {order}     │                       │
   │                              │<───────────────────────────┤                       │
   │                              │                            │                       │
   │                              │ 10. Clear Cart Storage     │                       │
   │ 11. Show Success & Redirect  │                            │                       │
   │<─────────────────────────────┤                            │                       │
```

---

## 5. Environment Configuration Guidelines

### Server `.env` Structure
```ini
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/mini-ecommerce
JWT_SECRET=super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Client `.env` Structure
```ini
VITE_API_BASE_URL=http://localhost:5000/api
```
