# Security & Validation Rules

This document defines all security measures, validation logic, and protective patterns for both the **frontend** (React client) and **backend** (Express API) of the Mini E-Commerce Demo Project.

---

## 1. Authentication & Authorization Architecture

### 1.1 JWT Token Lifecycle

```text
User Login / Register
        │
        ▼
Server validates credentials
        │
        ▼
Server signs JWT with:
  - Payload: { userId, role }
  - Secret: process.env.JWT_SECRET
  - Expiry: 7 days (configurable)
        │
        ▼
Token returned to client
        │
        ▼
Client stores token in localStorage
        │
        ▼
Axios interceptor attaches token to all requests:
  Authorization: Bearer <token>
        │
        ▼
Server authMiddleware verifies token on protected routes
        │
        ▼
Server adminMiddleware checks role === 'admin' on admin routes
```

### 1.2 Auth Middleware (`authMiddleware.js`)

**Purpose**: Validates JWT token and attaches user info to `req.user`.

**Logic**:
1. Extract token from `Authorization` header (`Bearer <token>`)
2. If no token → return `401 Unauthorized`
3. Verify token using `jwt.verify(token, JWT_SECRET)`
4. If expired or invalid → return `401 Unauthorized`
5. Find user by decoded `userId` in MongoDB (exclude password)
6. If user not found → return `401 Unauthorized`
7. Attach `req.user = user` and call `next()`

### 1.3 Admin Middleware (`adminMiddleware.js`)

**Purpose**: Checks if authenticated user has admin privileges.

**Logic**:
1. Must run after `authMiddleware` (depends on `req.user`)
2. Check `req.user.role === 'admin'`
3. If not admin → return `403 Forbidden`
4. If admin → call `next()`

---

## 2. Password Security

| Aspect | Implementation |
| :--- | :--- |
| **Hashing Algorithm** | bcrypt with 10 salt rounds |
| **Storage** | Only hashed passwords stored in MongoDB; plain text never persisted |
| **Comparison** | `bcrypt.compare(plainPassword, hashedPassword)` during login |
| **Password in Responses** | Password field excluded from all API responses using Mongoose `select: false` or manual exclusion |
| **Minimum Length** | 6 characters (enforced on both frontend and backend) |

---

## 3. Frontend Validation Rules

All validations run on the client side for UX feedback. **These do NOT replace backend validation**.

### 3.1 Registration Form

| Field | Validation |
| :--- | :--- |
| `name` | Required; 2–50 characters |
| `email` | Required; valid email format (regex check) |
| `password` | Required; minimum 6 characters |
| `confirmPassword` | Required; must exactly match `password` |

### 3.2 Login Form

| Field | Validation |
| :--- | :--- |
| `email` | Required; valid email format |
| `password` | Required; non-empty |

### 3.3 Category Form (Admin)

| Field | Validation |
| :--- | :--- |
| `name` | Required; 2–60 characters |
| `description` | Optional; no constraints |

### 3.4 Product Form (Admin)

| Field | Validation |
| :--- | :--- |
| `name` | Required; 2–120 characters |
| `description` | Required; non-empty |
| `price` | Required; must be a positive number (> 0) |
| `image` | Required; valid URL format |
| `category` | Required; must select a category from dropdown |
| `stock` | Required; must be a non-negative integer (≥ 0) |

### 3.5 Checkout Form

| Field | Validation |
| :--- | :--- |
| `name` | Required; 2+ characters |
| `phone` | Required; 10–15 digits |
| `address` | Required; non-empty |
| `city` | Required; non-empty |
| `pincode` | Required; valid format |

### 3.6 Cart Quantity

| Rule | Implementation |
| :--- | :--- |
| Minimum quantity | 1 (below 1 removes item) |
| Maximum quantity | Capped at `product.stock` |
| Out of stock | "Add to Cart" button disabled |

---

## 4. Backend Validation Rules

Backend validation is the **authoritative source of truth**. All data is re-validated server-side.

### 4.1 Registration Endpoint

```text
POST /api/auth/register
```

| Check | Action on Failure |
| :--- | :--- |
| All fields present (name, email, password, confirmPassword) | 400: "All fields are required" |
| Name length 2–50 | 400: "Name must be between 2 and 50 characters" |
| Valid email format | 400: "Please provide a valid email" |
| Password length ≥ 6 | 400: "Password must be at least 6 characters" |
| password === confirmPassword | 400: "Passwords do not match" |
| Email uniqueness (MongoDB query) | 409: "Email already registered" |

### 4.2 Login Endpoint

```text
POST /api/auth/login
```

| Check | Action on Failure |
| :--- | :--- |
| Email and password present | 400: "Email and password are required" |
| User exists in database | 401: "Invalid email or password" |
| bcrypt.compare matches | 401: "Invalid email or password" |

> **Security Note**: Use the same generic message for both "user not found" and "wrong password" to prevent user enumeration attacks.

### 4.3 Category Endpoints

| Check | Action on Failure |
| :--- | :--- |
| Name present and 2–60 chars | 400: "Category name is required" |
| Name unique in database | 409: "Category already exists" |
| Category ID valid and exists (for update/delete) | 404: "Category not found" |
| No products using category (for delete) | 400: "Cannot delete category with existing products" |

### 4.4 Product Endpoints

| Check | Action on Failure |
| :--- | :--- |
| All required fields present | 400: "All fields are required" |
| Price is a positive number | 400: "Price must be a positive number" |
| Stock is a non-negative integer | 400: "Stock cannot be negative" |
| Category ID exists in Categories collection | 400: "Invalid category" |
| Product ID valid and exists (for update/delete) | 404: "Product not found" |

### 4.5 Order Placement

| Check | Action on Failure |
| :--- | :--- |
| Products array is non-empty | 400: "Order must contain at least one product" |
| Each product ID exists in database | 400: "Product not found: {id}" |
| Each quantity is ≥ 1 | 400: "Quantity must be at least 1" |
| Stock ≥ requested quantity (per product) | 400: "Insufficient stock for: {productName}" |
| All shipping address fields present | 400: "All shipping fields are required" |
| Phone is 10–15 digits | 400: "Invalid phone number" |

### 4.6 Order Status Update

| Check | Action on Failure |
| :--- | :--- |
| Status is valid enum value | 400: "Invalid status value" |
| Order ID exists | 404: "Order not found" |

---

## 5. Critical Security Principle: Server-Side Price Calculation

**NEVER trust prices sent from the frontend.**

When creating an order, the backend must:

```text
1. Receive only product IDs and quantities from the client
2. Fetch each product's current price from MongoDB
3. Calculate totalAmount on the server:
   totalAmount = Σ (dbProduct.price × requestedQuantity)
4. Store the server-calculated price in the order document
```

This prevents price tampering attacks where a malicious user could modify the request payload to send a lower price.

---

## 6. Stock Integrity

### Atomic Stock Decrement Pattern

To prevent overselling in concurrent scenarios:

```javascript
// For each item in the order:
const result = await Product.findOneAndUpdate(
  { 
    _id: item.productId, 
    stock: { $gte: item.quantity }  // Only if sufficient stock
  },
  { 
    $inc: { stock: -item.quantity }  // Atomic decrement
  },
  { new: true }
);

if (!result) {
  // Stock insufficient — abort order
  throw new Error(`Insufficient stock for product: ${item.productId}`);
}
```

This ensures:
- Stock is checked and decremented atomically
- Race conditions between concurrent orders are handled
- Stock can never go below zero

---

## 7. API Security Middleware Stack

```text
Request
  │
  ├─ express.json({ limit: '10mb' })    → Limit payload size
  ├─ cors({ origin: CLIENT_URL })        → Restrict cross-origin access
  ├─ helmet() (optional)                 → Set secure HTTP headers
  │
  ├─ Public routes                       → No auth needed
  ├─ authMiddleware                      → JWT verification for customer routes
  ├─ authMiddleware + adminMiddleware    → JWT + role check for admin routes
  │
  └─ errorMiddleware                     → Catch-all error handler
```

---

## 8. Error Handling Strategy

### Centralized Error Middleware

```text
errorMiddleware(err, req, res, next)
  │
  ├─ Mongoose ValidationError  → 400 with field-level messages
  ├─ Mongoose CastError        → 400 "Invalid ID format"
  ├─ Duplicate Key Error (11000) → 409 "Resource already exists"
  ├─ JsonWebTokenError          → 401 "Invalid token"
  ├─ TokenExpiredError          → 401 "Token expired"
  ├─ Custom AppError            → Use specified statusCode and message
  └─ Unknown Error              → 500 "Internal server error"
```

### Frontend Error Handling

- All Axios calls wrapped in try-catch
- Error responses displayed via toast notifications
- Network errors show "Something went wrong, please try again"
- 401 errors trigger automatic logout and redirect to login page (via Axios response interceptor)

---

## 9. Security Checklist Summary

| ✅ | Security Measure |
| :--- | :--- |
| ✅ | Passwords hashed with bcrypt (10 salt rounds) |
| ✅ | JWT tokens with expiration (7 days) |
| ✅ | Auth middleware on all protected routes |
| ✅ | Admin middleware on all admin routes |
| ✅ | Server-side price calculation (never trust client prices) |
| ✅ | Atomic stock decrement (prevent overselling) |
| ✅ | Input validation on both frontend and backend |
| ✅ | Generic error messages for login (prevent enumeration) |
| ✅ | Password excluded from API responses |
| ✅ | CORS restricted to frontend origin |
| ✅ | Centralized error handling (no stack traces in production) |
| ✅ | Payload size limits |
