# REST API Specification

This document provides the complete REST API contract for the **Mini E-Commerce Demo Project**. All endpoints return JSON responses and expect JSON request bodies where applicable.

---

## Base URL

```
http://localhost:5000/api
```

---

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes

| Code | Meaning |
| :--- | :--- |
| `200` | OK — Successful GET / PUT / PATCH |
| `201` | Created — Successful POST |
| `400` | Bad Request — Validation error or malformed input |
| `401` | Unauthorized — Missing or invalid JWT token |
| `403` | Forbidden — User lacks required role (e.g., admin) |
| `404` | Not Found — Resource does not exist |
| `409` | Conflict — Duplicate resource (e.g., existing email) |
| `500` | Internal Server Error — Unexpected server failure |

---

## Authentication Headers

All protected routes require:

```
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication APIs (`/api/auth`)

### 1.1 Register Customer

```
POST /api/auth/register
```

**Access**: Public

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Validation Rules**:
| Field | Rules |
| :--- | :--- |
| `name` | Required, 2–50 characters |
| `email` | Required, valid email format, must be unique |
| `password` | Required, minimum 6 characters |
| `confirmPassword` | Required, must match `password` |

**Success Response** (`201 Created`):
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Registration successful"
}
```

**Error Responses**:
| Code | Condition |
| :--- | :--- |
| `400` | Missing fields, password too short, passwords don't match |
| `409` | Email already registered |

---

### 1.2 Login (Customer & Admin)

```
POST /api/auth/login
```

**Access**: Public

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules**:
| Field | Rules |
| :--- | :--- |
| `email` | Required, valid email format |
| `password` | Required |

**Success Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login successful"
}
```

**Error Responses**:
| Code | Condition |
| :--- | :--- |
| `400` | Missing email or password |
| `401` | Invalid email or password |

---

## 2. Category APIs (`/api/categories`)

### 2.1 Get All Categories

```
GET /api/categories
```

**Access**: Public

**Success Response** (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f...",
      "name": "Electronics",
      "description": "Electronic gadgets and devices",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 2.2 Create Category

```
POST /api/categories
```

**Access**: Admin only (JWT + Admin middleware)

**Request Body**:
```json
{
  "name": "Electronics",
  "description": "Electronic gadgets and devices"
}
```

**Validation Rules**:
| Field | Rules |
| :--- | :--- |
| `name` | Required, 2–60 characters, must be unique |
| `description` | Optional |

**Success Response** (`201 Created`):
```json
{
  "success": true,
  "data": {
    "_id": "64f...",
    "name": "Electronics",
    "description": "Electronic gadgets and devices",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Category created successfully"
}
```

**Error Responses**:
| Code | Condition |
| :--- | :--- |
| `400` | Missing name |
| `401` | No token provided |
| `403` | User is not admin |
| `409` | Category name already exists |

---

### 2.3 Update Category

```
PUT /api/categories/:id
```

**Access**: Admin only

**Request Body**:
```json
{
  "name": "Updated Electronics",
  "description": "Updated description"
}
```

**Success Response** (`200 OK`):
```json
{
  "success": true,
  "data": { ... },
  "message": "Category updated successfully"
}
```

**Error Responses**:
| Code | Condition |
| :--- | :--- |
| `400` | Invalid data |
| `404` | Category not found |
| `409` | Duplicate category name |

---

### 2.4 Delete Category

```
DELETE /api/categories/:id
```

**Access**: Admin only

**Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Error Responses**:
| Code | Condition |
| :--- | :--- |
| `400` | Category has associated products (prevent orphaned products) |
| `404` | Category not found |

---

## 3. Product APIs (`/api/products`)

### 3.1 Get All Products (with Filtering & Search)

```
GET /api/products
GET /api/products?category=64f...&search=phone
```

**Access**: Public

**Query Parameters**:
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `category` | `String` | Filter by category ID |
| `search` | `String` | Search by product name (case-insensitive partial match) |

**Success Response** (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f...",
      "name": "Wireless Headphones",
      "description": "High quality wireless headphones with noise cancellation",
      "price": 59.99,
      "image": "https://example.com/headphones.jpg",
      "category": {
        "_id": "64f...",
        "name": "Electronics"
      },
      "stock": 15,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 3.2 Get Single Product

```
GET /api/products/:id
```

**Access**: Public

**Success Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "_id": "64f...",
    "name": "Wireless Headphones",
    "description": "High quality wireless headphones with noise cancellation",
    "price": 59.99,
    "image": "https://example.com/headphones.jpg",
    "category": {
      "_id": "64f...",
      "name": "Electronics"
    },
    "stock": 15,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**:
| Code | Condition |
| :--- | :--- |
| `404` | Product not found |

---

### 3.3 Create Product

```
POST /api/products
```

**Access**: Admin only

**Request Body**:
```json
{
  "name": "Wireless Headphones",
  "description": "High quality wireless headphones with noise cancellation",
  "price": 59.99,
  "image": "https://example.com/headphones.jpg",
  "category": "64f...",
  "stock": 15
}
```

**Validation Rules**:
| Field | Rules |
| :--- | :--- |
| `name` | Required, 2–120 characters |
| `description` | Required |
| `price` | Required, must be a positive number (> 0) |
| `image` | Required, valid URL string |
| `category` | Required, must be a valid existing Category ID |
| `stock` | Required, must be a non-negative integer (≥ 0) |

**Success Response** (`201 Created`):
```json
{
  "success": true,
  "data": { ... },
  "message": "Product created successfully"
}
```

**Error Responses**:
| Code | Condition |
| :--- | :--- |
| `400` | Missing fields, invalid price, invalid stock, category not found |
| `401` | No token |
| `403` | Not admin |

---

### 3.4 Update Product

```
PUT /api/products/:id
```

**Access**: Admin only

**Request Body**: Same as Create (all fields optional for partial update)

**Success Response** (`200 OK`):
```json
{
  "success": true,
  "data": { ... },
  "message": "Product updated successfully"
}
```

---

### 3.5 Delete Product

```
DELETE /api/products/:id
```

**Access**: Admin only

**Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 4. Order APIs

### 4.1 Place Order (Customer)

```
POST /api/orders
```

**Access**: Authenticated customers

**Request Body**:
```json
{
  "products": [
    { "product": "64f...", "quantity": 2 },
    { "product": "64f...", "quantity": 1 }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "9876543210",
    "address": "123 Main Street, Apt 4B",
    "city": "Mumbai",
    "pincode": "400001"
  }
}
```

**Validation Rules**:
| Field | Rules |
| :--- | :--- |
| `products` | Required, non-empty array |
| `products[i].product` | Required, valid Product ID |
| `products[i].quantity` | Required, positive integer (≥ 1) |
| `shippingAddress.name` | Required, min 2 characters |
| `shippingAddress.phone` | Required, 10–15 digit number |
| `shippingAddress.address` | Required |
| `shippingAddress.city` | Required |
| `shippingAddress.pincode` | Required |

**Backend Processing**:
1. Verify JWT token → extract `user._id`
2. For each product in the array:
   - Fetch product from MongoDB by ID
   - Validate product exists
   - Validate `stock >= requested quantity`
   - Use **database price** (NOT the client-sent price)
3. Calculate `totalAmount = Σ(price × quantity)`
4. Create the Order document
5. Atomically decrement stock for each product (`$inc: { stock: -quantity }`)
6. Return the created order

**Success Response** (`201 Created`):
```json
{
  "success": true,
  "data": {
    "_id": "64f...",
    "user": "64f...",
    "products": [
      {
        "product": "64f...",
        "name": "Wireless Headphones",
        "price": 59.99,
        "quantity": 2,
        "image": "https://example.com/headphones.jpg"
      }
    ],
    "totalAmount": 119.98,
    "shippingAddress": { ... },
    "status": "Pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Order placed successfully"
}
```

**Error Responses**:
| Code | Condition |
| :--- | :--- |
| `400` | Empty products array, invalid quantity, insufficient stock, product not found |
| `401` | No token |

---

### 4.2 Get My Orders (Customer)

```
GET /api/orders/my-orders
```

**Access**: Authenticated customers

**Description**: Returns all orders placed by the authenticated user, sorted by `createdAt` descending (newest first).

**Success Response** (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f...",
      "products": [ ... ],
      "totalAmount": 119.98,
      "shippingAddress": { ... },
      "status": "Confirmed",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 4.3 Get All Orders (Admin)

```
GET /api/admin/orders
```

**Access**: Admin only

**Description**: Returns all orders across all customers, sorted by `createdAt` descending. Populates the `user` field with `name` and `email`.

**Success Response** (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f...",
      "user": {
        "_id": "64f...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "products": [ ... ],
      "totalAmount": 119.98,
      "shippingAddress": { ... },
      "status": "Pending",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 4.4 Update Order Status (Admin)

```
PATCH /api/admin/orders/:id/status
```

**Access**: Admin only

**Request Body**:
```json
{
  "status": "Confirmed"
}
```

**Validation Rules**:
| Field | Rules |
| :--- | :--- |
| `status` | Required, must be one of: `Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled` |

**Success Response** (`200 OK`):
```json
{
  "success": true,
  "data": { ... },
  "message": "Order status updated to Confirmed"
}
```

**Error Responses**:
| Code | Condition |
| :--- | :--- |
| `400` | Invalid status value |
| `404` | Order not found |

---

## 5. Middleware Pipeline Summary

```text
Request
  │
  ├── express.json()                 → Parse JSON body
  ├── cors({ origin: CLIENT_URL })   → Allow frontend origin
  │
  ├── [Public Routes]                → No middleware required
  │     GET /api/categories
  │     GET /api/products
  │     GET /api/products/:id
  │     POST /api/auth/register
  │     POST /api/auth/login
  │
  ├── [Customer Protected Routes]    → authMiddleware
  │     POST /api/orders
  │     GET /api/orders/my-orders
  │
  ├── [Admin Protected Routes]       → authMiddleware + adminMiddleware
  │     POST /api/categories
  │     PUT /api/categories/:id
  │     DELETE /api/categories/:id
  │     POST /api/products
  │     PUT /api/products/:id
  │     DELETE /api/products/:id
  │     GET /api/admin/orders
  │     PATCH /api/admin/orders/:id/status
  │
  └── errorMiddleware                → Catches all errors, sends JSON
```
