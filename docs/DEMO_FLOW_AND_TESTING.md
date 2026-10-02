# Demo Flow & Test Scenarios

This document outlines the complete end-to-end demo flow and manual test scenarios for verifying all features of the Mini E-Commerce Demo Project.

---

## 1. Complete Demo Flow

The full project demonstration follows this sequential flow:

```text
Step 1:  Start MongoDB, Backend Server, and Frontend Dev Server
            │
Step 2:  Admin Login (pre-seeded or first admin account)
            │
Step 3:  Admin → Add Categories
            │   e.g., "Electronics", "Fashion", "Shoes"
            │
Step 4:  Admin → Add Products
            │   e.g., "Wireless Headphones" → Electronics, Stock: 15, Price: ₹2999
            │   e.g., "Running Shoes" → Shoes, Stock: 10, Price: ₹4999
            │   e.g., "Cotton T-Shirt" → Fashion, Stock: 20, Price: ₹799
            │
Step 5:  Open Public Website → Products appear on homepage and catalog
            │
Step 6:  Customer → Register new account
            │
Step 7:  Customer → Login
            │
Step 8:  Customer → Browse Products page
            │
Step 9:  Customer → Filter by "Electronics" category
            │
Step 10: Customer → Search "headphones"
            │
Step 11: Customer → View Product Details (Wireless Headphones)
            │
Step 12: Customer → Add to Cart (qty: 2)
            │
Step 13: Customer → View Cart → Verify items, quantities, total
            │
Step 14: Customer → Proceed to Checkout
            │
Step 15: Customer → Fill shipping address → Place Order (COD)
            │
Step 16: Verify: Cart is cleared after order
            │
Step 17: Customer → My Orders → Order visible with "Pending" status
            │
Step 18: Admin → Orders Panel → Same order appears
            │
Step 19: Admin → Update order status: Pending → Confirmed → Shipped → Delivered
            │
Step 20: Customer → My Orders → Status reflects the admin update
```

---

## 2. Pre-Seeded Admin Account

For demonstration purposes, seed one admin account during initial setup:

```text
Name:     Admin User
Email:    admin@shopease.com
Password: admin123
Role:     admin
```

This can be done via a seed script (`server/src/utils/seed.js`) that runs once to create the admin user if none exists.

---

## 3. Test Scenarios by Feature

### 3.1 Authentication Tests

| # | Scenario | Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| A1 | Register with valid data | Fill all fields correctly → Submit | Account created, auto-login, redirect to Home |
| A2 | Register with duplicate email | Use existing email → Submit | Error toast: "Email already registered" |
| A3 | Register with mismatched passwords | Enter different passwords → Submit | Error: "Passwords do not match" |
| A4 | Register with short password | Enter 3-char password → Submit | Error: "Password must be at least 6 characters" |
| A5 | Register with missing fields | Leave name empty → Submit | Error: "All fields are required" |
| A6 | Login with valid credentials | Enter correct email/password → Submit | Login success, redirect to Home |
| A7 | Login with wrong password | Enter incorrect password → Submit | Error: "Invalid email or password" |
| A8 | Login with non-existent email | Enter unregistered email → Submit | Error: "Invalid email or password" |
| A9 | Logout | Click Logout button | Token cleared, redirect to Home, protected routes inaccessible |
| A10 | Access protected route without login | Navigate to /my-orders directly | Redirect to /login |
| A11 | Admin login | Login with admin credentials | Redirect to admin dashboard, admin nav visible |
| A12 | Customer access admin route | Login as customer, navigate to /admin | Redirect to / (forbidden) |

---

### 3.2 Admin Category Management Tests

| # | Scenario | Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| C1 | Add category | Click "Add Category" → Fill name + description → Save | Category appears in table, success toast |
| C2 | Add duplicate category | Enter existing category name → Save | Error: "Category already exists" |
| C3 | Add category without name | Leave name empty → Save | Validation error shown |
| C4 | Edit category | Click Edit → Change name → Save | Category updated in table, success toast |
| C5 | Delete category (no products) | Click Delete → Confirm | Category removed, success toast |
| C6 | Delete category (has products) | Try to delete category with linked products | Error: "Cannot delete category with existing products" |
| C7 | View categories list | Navigate to Admin Categories | All categories displayed in table |

---

### 3.3 Admin Product Management Tests

| # | Scenario | Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| P1 | Add product | Fill all fields with valid data → Save | Product appears in table, success toast |
| P2 | Add product with negative price | Enter price: -10 → Save | Error: "Price must be a positive number" |
| P3 | Add product with negative stock | Enter stock: -5 → Save | Error: "Stock cannot be negative" |
| P4 | Add product without category | Leave category unselected → Save | Error: "Category is required" |
| P5 | Edit product | Click Edit → Change price and stock → Save | Product updated, success toast |
| P6 | Delete product | Click Delete → Confirm dialog → Confirm | Product removed from table and storefront |
| P7 | View products list | Navigate to Admin Products | All products with image, name, price, category, stock displayed |

---

### 3.4 Public Storefront Tests

| # | Scenario | Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| S1 | View homepage | Navigate to / | Hero section, categories, latest products visible |
| S2 | View all products | Navigate to /products | All products displayed in responsive grid |
| S3 | Filter by category | Click "Electronics" tab | Only Electronics products shown |
| S4 | Filter "All" | Click "All" tab | All products from all categories shown |
| S5 | Search products | Type "headphones" in search bar | Only matching products displayed |
| S6 | Search with no results | Type "xyznoexist" in search bar | Empty state: "No products found" |
| S7 | View product details | Click on a product card | Product detail page with image, name, price, description, stock |
| S8 | Out of stock product | View product with stock = 0 | "Out of Stock" label, Add to Cart disabled |
| S9 | Responsive layout | Resize browser to mobile/tablet/desktop | Grid adjusts columns, navbar collapses to hamburger |

---

### 3.5 Cart Tests

| # | Scenario | Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| CT1 | Add to cart | Click "Add to Cart" on product | Item added, cart count badge increases |
| CT2 | Add same product twice | Click "Add to Cart" twice on same product | Quantity incremented (not duplicate entry) |
| CT3 | Increase quantity | Click [+] button in cart | Quantity increases, total updates |
| CT4 | Decrease quantity | Click [−] button in cart | Quantity decreases, total updates |
| CT5 | Decrease to zero | Click [−] until quantity hits 0 | Item removed from cart |
| CT6 | Exceed stock | Try to increase beyond available stock | Quantity capped at stock, further clicks disabled/ignored |
| CT7 | Remove item | Click 🗑️ delete button on item | Item removed, total recalculated |
| CT8 | Empty cart | Remove all items | Empty state: "Your cart is empty" + "Continue Shopping" link |
| CT9 | Cart persistence | Add items → Refresh page | Cart items still present (localStorage) |
| CT10 | Cart total accuracy | Add multiple products with different quantities | Total = Σ(price × qty) matches displayed total |

---

### 3.6 Checkout & Order Tests

| # | Scenario | Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| O1 | Successful order | Fill all shipping fields → Place Order | Order created, cart cleared, redirect to My Orders |
| O2 | Missing shipping field | Leave phone empty → Place Order | Validation error on phone field |
| O3 | Invalid phone | Enter 3-digit phone → Place Order | Error: "Invalid phone number" |
| O4 | Stock validation (backend) | Place order for qty > current stock | Error: "Insufficient stock for: {product}" |
| O5 | Price tamper prevention | (API test) Send modified price in payload | Server uses DB price, not client price |
| O6 | View my orders | Navigate to /my-orders after placing order | All past orders listed, newest first |
| O7 | Order status display | View order in My Orders | Status badge shows "Pending" |
| O8 | Stock reduction | After order, check product stock | Stock reduced by ordered quantity |
| O9 | Checkout without login | Navigate to /checkout without auth | Redirect to /login |
| O10 | Checkout with empty cart | Navigate to /checkout with 0 items | Redirect to /cart or show message |

---

### 3.7 Admin Order Management Tests

| # | Scenario | Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| AO1 | View all orders | Navigate to Admin Orders | All customer orders displayed with user info |
| AO2 | Update status to Confirmed | Select "Confirmed" from dropdown | Status updated, success toast |
| AO3 | Update status to Shipped | Select "Shipped" → Save | Status changes to Shipped |
| AO4 | Update status to Delivered | Select "Delivered" → Save | Status changes to Delivered |
| AO5 | Update status to Cancelled | Select "Cancelled" → Save | Status changes to Cancelled |
| AO6 | View order details | Click/expand an order row | Full order details: items, quantities, shipping address, total |
| AO7 | Status reflected for customer | Admin updates status | Customer sees updated status on My Orders page |

---

## 4. Edge Cases & Error Handling Tests

| # | Scenario | Expected Behavior |
| :--- | :--- | :--- |
| E1 | Expired JWT token | API returns 401; user auto-logged out, redirected to login |
| E2 | Invalid product ID in URL | 404 page or "Product not found" message |
| E3 | Server down / network error | Toast: "Something went wrong, please try again" |
| E4 | Concurrent stock depletion | Order fails gracefully if stock runs out between cart and checkout |
| E5 | Delete confirmation cancel | Click Delete → Click "Cancel" on dialog → Nothing happens |
| E6 | Rapid button clicks | Submit buttons disabled after first click, preventing duplicate submissions |

---

## 5. Browser Compatibility

| Browser | Version | Support |
| :--- | :--- | :--- |
| Chrome | 90+ | ✅ Full |
| Firefox | 90+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Mobile Chrome | Latest | ✅ Full |
| Mobile Safari | Latest | ✅ Full |
