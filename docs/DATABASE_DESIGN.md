# Database Design & Mongoose Schemas

This document provides complete data modeling specifications for MongoDB using Mongoose ODM for the **Mini E-Commerce Demo Project**.

In accordance with system specifications, **exactly four models** are used:
1. `User`
2. `Category`
3. `Product`
4. `Order`

---

## 1. Entity-Relationship Diagram (ERD)

```text
┌───────────────────────────┐                ┌───────────────────────────┐
│           User            │                │         Category          │
├───────────────────────────┤                ├───────────────────────────┤
│ _id (ObjectId, PK)        │                │ _id (ObjectId, PK)        │
│ name (String)             │                │ name (String, Unique)     │
│ email (String, Unique)    │                │ description (String)      │
│ password (String - hashed)│                │ createdAt (Date)          │
│ role (String: admin/user) │                │ updatedAt (Date)          │
│ createdAt (Date)          │                └─────────────┬─────────────┘
│ updatedAt (Date)          │                              │
└─────────────┬─────────────┘                              │ 1
              │ 1                                          │
              │                                            │
              │ has many                                   │ contains many
              │                                            │
              │ N                                          │ N
┌─────────────▼─────────────┐                ┌─────────────▼─────────────┐
│           Order           │                │          Product          │
├───────────────────────────┤                ├───────────────────────────┤
│ _id (ObjectId, PK)        │                │ _id (ObjectId, PK)        │
│ user (ObjectId, FK)       │◀─ ─ ─ ─ ─ ─ ─ ─│ category (ObjectId, FK)   │
│ products [                │  (referenced   │ name (String)             │
│   product (ObjectId, FK)  │─ ─ ─ ─ ─ ─ ─ ─▶│ description (String)      │
│   name (String)           │   at checkout) │ price (Number, >= 0)      │
│   price (Number)          │                │ image (String URL)        │
│   quantity (Number)       │                │ stock (Number, >= 0)      │
│   image (String)          │                │ createdAt (Date)          │
│ ]                         │                │ updatedAt (Date)          │
│ totalAmount (Number)      │                └───────────────────────────┘
│ shippingAddress {         │
│   name, phone, address,   │
│   city, pincode           │
│ }                         │
│ status (Enum)             │
│ createdAt (Date)          │
│ updatedAt (Date)          │
└───────────────────────────┘
```

---

## 2. Model Specifications

### 2.1 User Model (`models/User.js`)

Stores credentials and role privileges for both regular shoppers and administrators.

| Field | Type | Required | Unique | Default | Constraints & Rules |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto | Yes | Auto | MongoDB primary key |
| `name` | `String` | Yes | No | None | Trimmed, min length 2, max length 50 |
| `email` | `String` | Yes | Yes | None | Lowercased, trimmed, validated via RFC email regex |
| `password` | `String` | Yes | No | None | Min length 6 characters before hashing; stored as bcrypt hash |
| `role` | `String` | Yes | No | `'customer'` | Enum: `['customer', 'admin']` |
| `createdAt` | `Date` | Auto | No | Auto | Managed by Mongoose `{ timestamps: true }` |
| `updatedAt` | `Date` | Auto | No | Auto | Managed by Mongoose `{ timestamps: true }` |

#### Indexing Strategy:
* `email`: Unique index for $O(1)$ fast lookup during login and duplicate registration rejection.

#### Pre-Save Hook:
* Password hashing with `bcrypt.hash(password, 10)` triggered automatically whenever `password` is modified.

---

### 2.2 Category Model (`models/Category.js`)

Maintains catalog groupings for products.

| Field | Type | Required | Unique | Default | Constraints & Rules |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto | Yes | Auto | MongoDB primary key |
| `name` | `String` | Yes | Yes | None | Trimmed, min length 2, max length 60, capitalized display |
| `description`| `String` | No | No | `''` | Trimmed, optional summary of the category |
| `createdAt` | `Date` | Auto | No | Auto | Managed by Mongoose `{ timestamps: true }` |
| `updatedAt` | `Date` | Auto | No | Auto | Managed by Mongoose `{ timestamps: true }` |

#### Indexing Strategy:
* `name`: Unique index to prevent duplicate category names.

---

### 2.3 Product Model (`models/Product.js`)

Maintains inventory items, descriptions, images, pricing, and category mapping.

| Field | Type | Required | Unique | Default | Constraints & Rules |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto | Yes | Auto | MongoDB primary key |
| `name` | `String` | Yes | No | None | Trimmed, min length 2, max length 120 |
| `description`| `String` | Yes | No | None | Detailed description of the product |
| `price` | `Number` | Yes | No | None | Min value `0.01` (strictly positive number) |
| `image` | `String` | Yes | No | None | Valid HTTP/HTTPS image URL or absolute path string |
| `category` | `ObjectId` | Yes | No | None | Reference to `Category` collection (`ref: 'Category'`) |
| `stock` | `Number` | Yes | No | `0` | Min value `0` (stock cannot be negative) |
| `createdAt` | `Date` | Auto | No | Auto | Managed by Mongoose `{ timestamps: true }` |
| `updatedAt` | `Date` | Auto | No | Auto | Managed by Mongoose `{ timestamps: true }` |

#### Indexing Strategy:
* `category`: Index for fast category filtering queries (`{ category: 1 }`).
* `name` & `description`: Compound Text index (`{ name: 'text', description: 'text' }`) or regex-optimized index for search queries.

---

### 2.4 Order Model (`models/Order.js`)

Records customer purchase transactions, shipping destination, snapshot item data, and fulfillment state.

| Field | Type | Required | Default | Description & Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto | Auto | MongoDB primary key |
| `user` | `ObjectId` | Yes | None | Reference to `User` collection (`ref: 'User'`) |
| `products` | `[OrderItem]` | Yes | None | Array of purchased items (min 1 item) |
| `products[i].product`| `ObjectId`| Yes | None | Reference to original `Product` (`ref: 'Product'`) |
| `products[i].name` | `String` | Yes | None | Snapshot product name at moment of purchase |
| `products[i].price`| `Number` | Yes | None | Snapshot unit price validated against database price |
| `products[i].quantity`| `Number`| Yes | None | Min value `1`; requested quantity |
| `products[i].image`| `String` | Yes | None | Snapshot product thumbnail image URL |
| `totalAmount` | `Number` | Yes | None | Final computed order total: $\sum (price \times quantity)$ |
| `shippingAddress` | `Object` | Yes | None | Embedded shipping information subdocument |
| `shippingAddress.name` | `String` | Yes | None | Full recipient name (min 2 chars) |
| `shippingAddress.phone`| `String` | Yes | None | Valid contact number (10-15 digits) |
| `shippingAddress.address`| `String`| Yes | None | Street address / apartment / house info |
| `shippingAddress.city` | `String` | Yes | None | Delivery city |
| `shippingAddress.pincode`| `String`| Yes | None | Postal / ZIP code |
| `status` | `String` | Yes | `'Pending'` | Enum: `['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']` |
| `createdAt` | `Date` | Auto | Auto | Order placement timestamp |
| `updatedAt` | `Date` | Auto | Auto | Status update timestamp |

#### Indexing Strategy:
* `user`: Index for fetching customer purchase history rapidly (`{ user: 1, createdAt: -1 }`).
* `status`: Index for admin order management filtering (`{ status: 1 }`).

---

## 3. Data Integrity & Stock Consistency Rules

1. **Snapshot Item Preservation**: When an order is placed, product attributes (`name`, `price`, `image`) are copied into the order document. If an admin edits the product price or description later, historical order records remain immutable and accurate.
2. **Atomic Stock Decrement**: Order creation uses atomic operations or validation checks:
   ```javascript
   // Atomic stock decrement ensuring stock never goes below zero
   const updatedProduct = await Product.findOneAndUpdate(
     { _id: item.productId, stock: { $gte: item.quantity } },
     { $inc: { stock: -item.quantity } },
     { new: true }
   );
   ```
3. **No Direct Price Acceptance**: Prices submitted in the request payload by the frontend are strictly ignored. The server looks up current prices from MongoDB to calculate `totalAmount`.
