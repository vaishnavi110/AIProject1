# Frontend & UI/UX Specification

This document defines the complete frontend architecture, page layouts, component hierarchy, and UI/UX design guidelines for the **Mini E-Commerce Demo Project**.

---

## 1. Technology & Tooling

| Tool | Version | Purpose |
| :--- | :--- | :--- |
| React.js | 18+ | Component-based SPA framework |
| Vite | 5+ | Lightning-fast dev server and build tool |
| React Router DOM | 6+ | Client-side routing and navigation |
| Tailwind CSS | 3+ | Utility-first responsive styling |
| Axios | 1+ | HTTP client with JWT interceptor |
| Lucide React | Latest | Modern, consistent SVG icon library |
| React Hot Toast | Latest | Elegant toast notification system |

---

## 2. Application Routing Map

```text
/                         → HomePage (Public)
/products                 → ProductsPage (Public)
/products/:id             → ProductDetailsPage (Public)
/cart                     → CartPage (Public)
/login                    → LoginPage (Public, redirects if logged in)
/register                 → RegisterPage (Public, redirects if logged in)
/checkout                 → CheckoutPage (Customer Protected)
/my-orders                → MyOrdersPage (Customer Protected)
/admin                    → AdminDashboard (Admin Protected)
/admin/categories         → AdminCategories (Admin Protected)
/admin/products           → AdminProducts (Admin Protected)
/admin/orders             → AdminOrders (Admin Protected)
```

### Route Protection Components

| Component | Logic |
| :--- | :--- |
| `<ProtectedRoute>` | Checks `AuthContext` for valid token; redirects to `/login` if unauthenticated |
| `<AdminRoute>` | Extends `ProtectedRoute`; additionally checks `user.role === 'admin'`; redirects to `/` if not admin |

---

## 3. State Management

### 3.1 AuthContext (React Context API)

Manages user authentication state globally.

**State**:
```text
user       → { _id, name, email, role } | null
token      → JWT string | null
isLoading  → boolean (initial auth check)
```

**Methods**:
```text
login(email, password)     → Calls API, stores token in localStorage, sets user state
register(name, email, password, confirmPassword) → Calls API, auto-logs in
logout()                   → Clears localStorage, resets user/token to null
```

**Persistence**: Token and user data stored in `localStorage`. On app mount, reads from storage and validates.

---

### 3.2 CartContext (React Context API)

Manages shopping cart state with localStorage persistence.

**State**:
```text
cartItems  → [{ product (full object), quantity }]
cartCount  → Total number of items
cartTotal  → Sum of (price × quantity) for all items
```

**Methods**:
```text
addToCart(product)              → Add product with quantity 1, or increment if exists
updateQuantity(productId, qty) → Set specific quantity (bounded by stock)
removeFromCart(productId)      → Remove item entirely
clearCart()                    → Empty entire cart (post-order)
```

**Stock Enforcement**: `updateQuantity` caps quantity at `product.stock`. If `qty <= 0`, item is removed.

---

## 4. Component Architecture

### 4.1 Layout Components

```text
components/layout/
├── Navbar.jsx          → Responsive top navigation bar
│   ├── Logo / Brand name (links to /)
│   ├── Navigation links: Home, Products
│   ├── Cart icon with badge showing cartCount
│   ├── User menu: Login/Register OR User name + Logout
│   ├── Admin link (visible only if role === 'admin')
│   └── Mobile hamburger menu (collapsible)
│
├── Footer.jsx          → Simple footer with copyright
├── Container.jsx       → Max-width centered wrapper
├── ProtectedRoute.jsx  → Auth guard wrapper
└── AdminRoute.jsx      → Admin role guard wrapper
```

### 4.2 Common / Shared Components

```text
components/common/
├── Button.jsx          → Reusable button with variants (primary, secondary, danger, outline)
│                         Props: children, onClick, variant, disabled, loading, fullWidth
├── Input.jsx           → Styled input with label and error message
│                         Props: label, type, value, onChange, error, placeholder, required
├── Modal.jsx           → Overlay modal dialog
│                         Props: isOpen, onClose, title, children
├── ConfirmDialog.jsx   → Delete confirmation modal
│                         Props: isOpen, onConfirm, onCancel, message, loading
├── Badge.jsx           → Status badge with color coding
│                         Colors: Pending=yellow, Confirmed=blue, Shipped=purple, Delivered=green, Cancelled=red
├── Loader.jsx          → Centered spinner animation
├── EmptyState.jsx      → Illustration + message when no data exists
│                         Props: icon, title, message, actionLabel, onAction
└── Toast              → Configured via react-hot-toast (success, error styles)
```

### 4.3 Product Components

```text
components/product/
├── ProductCard.jsx     → Individual product card in the grid
│   ├── Product image (fixed aspect ratio)
│   ├── Category badge
│   ├── Product name
│   ├── Price (formatted with currency)
│   ├── Stock indicator (In Stock / Out of Stock)
│   ├── "Add to Cart" button (disabled if out of stock)
│   └── Click navigates to /products/:id
│
├── ProductGrid.jsx     → Responsive grid container for ProductCards
│                         Grid: 1 col (mobile), 2 col (tablet), 3-4 col (desktop)
│
└── CategoryFilter.jsx  → Horizontal scrollable filter tabs
                          Shows: "All" + dynamically fetched category names
                          Highlights active filter
```

### 4.4 Admin Components

```text
components/admin/
├── AdminLayout.jsx     → Admin page wrapper with sidebar + main content area
├── Sidebar.jsx         → Vertical navigation sidebar
│   ├── Dashboard link
│   ├── Categories link
│   ├── Products link
│   ├── Orders link
│   └── Back to Store link
│
├── DataTable.jsx       → Reusable table component
│                         Props: columns, data, actions (edit, delete)
│                         Features: responsive (horizontal scroll on mobile)
│
├── CategoryForm.jsx    → Add/Edit category modal form
│                         Fields: name, description
│
├── ProductForm.jsx     → Add/Edit product modal form
│                         Fields: name, description, price, image URL, category (dropdown), stock
│
└── OrderStatusSelect.jsx → Dropdown to change order status
                            Options: Pending, Confirmed, Shipped, Delivered, Cancelled
```

---

## 5. Page Specifications

### 5.1 HomePage

```text
┌─────────────────────────────────────────────────┐
│                    Navbar                        │
├─────────────────────────────────────────────────┤
│                                                 │
│   Hero Section                                  │
│   "Welcome to ShopEase"                         │
│   "Find the best products at amazing prices"    │
│   [Browse Products] button                      │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│   Featured Categories (cards)                   │
│   ┌──────┐  ┌──────┐  ┌──────┐                │
│   │Elect.│  │Fash. │  │Shoes │                 │
│   └──────┘  └──────┘  └──────┘                │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│   Latest Products (grid of ProductCards)         │
│   Shows latest 8 products                       │
│   [View All Products] link                      │
│                                                 │
├─────────────────────────────────────────────────┤
│                    Footer                        │
└─────────────────────────────────────────────────┘
```

### 5.2 ProductsPage

```text
┌─────────────────────────────────────────────────┐
│                    Navbar                        │
├─────────────────────────────────────────────────┤
│                                                 │
│   Search Bar (full width input)                 │
│   [🔍 Search products...]                       │
│                                                 │
│   CategoryFilter tabs                           │
│   [All] [Electronics] [Fashion] [Shoes]         │
│                                                 │
│   ProductGrid                                   │
│   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐     │
│   │Card 1│  │Card 2│  │Card 3│  │Card 4│      │
│   └──────┘  └──────┘  └──────┘  └──────┘     │
│   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐     │
│   │Card 5│  │Card 6│  │Card 7│  │Card 8│      │
│   └──────┘  └──────┘  └──────┘  └──────┘     │
│                                                 │
│   EmptyState (if no products match filters)     │
│                                                 │
├─────────────────────────────────────────────────┤
│                    Footer                        │
└─────────────────────────────────────────────────┘
```

### 5.3 ProductDetailsPage

```text
┌─────────────────────────────────────────────────┐
│                    Navbar                        │
├─────────────────────────────────────────────────┤
│                                                 │
│   ┌──────────────┐  Product Name (h1)           │
│   │              │  Category Badge               │
│   │   Product    │  Price: ₹59.99               │
│   │    Image     │  Description text...          │
│   │              │  Stock: 15 available           │
│   │              │                               │
│   └──────────────┘  Quantity: [−] [2] [+]        │
│                     [Add to Cart] button          │
│                     (Disabled if out of stock)    │
│                                                 │
├─────────────────────────────────────────────────┤
│                    Footer                        │
└─────────────────────────────────────────────────┘
```

### 5.4 CartPage

```text
┌─────────────────────────────────────────────────┐
│                    Navbar                        │
├─────────────────────────────────────────────────┤
│                                                 │
│   Shopping Cart (h1)                            │
│                                                 │
│   ┌─────────────────────────────────────────┐   │
│   │ Image │ Name │ Price │ [−][qty][+] │ 🗑️ │   │
│   ├───────┼──────┼───────┼─────────────┼────┤   │
│   │  📷   │ Head │ ₹59  │ [−] 2 [+]  │ ❌ │   │
│   │  📷   │ Shoe │ ₹89  │ [−] 1 [+]  │ ❌ │   │
│   └─────────────────────────────────────────┘   │
│                                                 │
│   Cart Summary:                                 │
│   Subtotal: ₹207.97                            │
│   [Proceed to Checkout] button                  │
│                                                 │
│   EmptyState (if cart is empty):                │
│   "Your cart is empty"                          │
│   [Continue Shopping] link                      │
│                                                 │
├─────────────────────────────────────────────────┤
│                    Footer                        │
└─────────────────────────────────────────────────┘
```

### 5.5 CheckoutPage

```text
┌─────────────────────────────────────────────────┐
│                    Navbar                        │
├─────────────────────────────────────────────────┤
│                                                 │
│   Checkout (h1)                                 │
│                                                 │
│   ┌── Shipping Details ──────┐  ┌── Summary ──┐│
│   │ Name:     [________]     │  │ Item 1  ₹59 ││
│   │ Phone:    [________]     │  │ Item 2  ₹89 ││
│   │ Address:  [________]     │  │             ││
│   │ City:     [________]     │  │ Total: ₹207 ││
│   │ Pincode:  [________]     │  │             ││
│   │                          │  │ Payment:    ││
│   │                          │  │ Cash on     ││
│   │                          │  │ Delivery    ││
│   └──────────────────────────┘  │             ││
│                                 │[Place Order]││
│                                 └─────────────┘│
│                                                 │
├─────────────────────────────────────────────────┤
│                    Footer                        │
└─────────────────────────────────────────────────┘
```

### 5.6 MyOrdersPage

```text
┌─────────────────────────────────────────────────┐
│                    Navbar                        │
├─────────────────────────────────────────────────┤
│                                                 │
│   My Orders (h1)                                │
│                                                 │
│   ┌─────────────────────────────────────────┐   │
│   │ Order #64f...   │ 15 Jan 2024           │   │
│   │ Items: Headphones ×2, Shoes ×1          │   │
│   │ Total: ₹207.97                          │   │
│   │ Status: [Confirmed] (colored badge)     │   │
│   └─────────────────────────────────────────┘   │
│                                                 │
│   ┌─────────────────────────────────────────┐   │
│   │ Order #64f...   │ 10 Jan 2024           │   │
│   │ Items: T-Shirt ×3                       │   │
│   │ Total: ₹89.97                           │   │
│   │ Status: [Delivered] (green badge)       │   │
│   └─────────────────────────────────────────┘   │
│                                                 │
│   EmptyState: "No orders yet"                   │
│                                                 │
├─────────────────────────────────────────────────┤
│                    Footer                        │
└─────────────────────────────────────────────────┘
```

### 5.7 Admin Dashboard

```text
┌─────────────────────────────────────────────────┐
│                    Navbar                        │
├────────────┬────────────────────────────────────┤
│            │                                    │
│  Sidebar   │  Dashboard (h1)                    │
│            │                                    │
│  Dashboard │  ┌──────┐ ┌──────┐ ┌──────┐      │
│  Categories│  │  📦  │ │  📂  │ │  📋  │      │
│  Products  │  │ Prod │ │ Cat  │ │Orders│       │
│  Orders    │  │  25  │ │  5   │ │  12  │      │
│            │  └──────┘ └──────┘ └──────┘      │
│  ─────────│                                    │
│  Back to   │  Recent Orders Table               │
│  Store     │  ┌──────────────────────────┐     │
│            │  │ ID │ User │ Total │ Stat │     │
│            │  ├────┼──────┼───────┼──────┤     │
│            │  │... │ John │ ₹207  │Pend. │     │
│            │  └──────────────────────────┘     │
│            │                                    │
├────────────┴────────────────────────────────────┤
│                    Footer                        │
└─────────────────────────────────────────────────┘
```

### 5.8 Admin Categories / Products / Orders Pages

Follow the same sidebar layout with:
- **Categories**: DataTable with Name, Description, Actions (Edit/Delete) + "Add Category" button + CategoryForm modal
- **Products**: DataTable with Image, Name, Price, Category, Stock, Actions + "Add Product" button + ProductForm modal
- **Orders**: DataTable with Order ID, Customer, Items count, Total, Status, Date + OrderStatusSelect dropdown inline

---

## 6. Responsive Design Breakpoints

| Breakpoint | Width | Layout Behavior |
| :--- | :--- | :--- |
| **Mobile** | `< 640px` | Single column, hamburger menu, stacked forms, full-width cards |
| **Tablet** | `640px – 1023px` | 2-column product grid, collapsible sidebar |
| **Desktop** | `≥ 1024px` | 3–4 column grid, fixed sidebar, spacious layout |

---

## 7. UI/UX Standards

| Aspect | Implementation |
| :--- | :--- |
| **Loading States** | Show `<Loader>` spinner during all API calls |
| **Empty States** | Show `<EmptyState>` with icon, message, and CTA when lists are empty |
| **Toast Messages** | Success: green toast for create/update/delete. Error: red toast for failures |
| **Confirm Dialogs** | Show `<ConfirmDialog>` before all destructive actions (delete category, product, remove from cart) |
| **Form Validation** | Inline error messages below each field, red border on invalid fields |
| **Disabled States** | Buttons show loading spinner and become disabled during API calls |
| **Stock Indicators** | Green text "In Stock (15)" or red text "Out of Stock" |
| **Status Badges** | Color-coded: Pending (yellow), Confirmed (blue), Shipped (purple), Delivered (green), Cancelled (red) |
