# 👥 Users API Documentation

The `/users` path provides a comprehensive and diverse dataset for simulating user information and associated data such as carts, posts, and todos. This interface is ideal for testing and building user and permissions management software systems.
docs api-endpoints.md

---

## 📌 Index

1. [Fetch All Users](#1-Fetch-All-Users)
2. [Login and Fetch Token (Auth)](#2-Login-and-Fetch-Token-auth)
3. [Fetch Current Authorized User Data](#3-Fetch-Current-Authentic-User-Data)
4. [Fetch Single User by ID](#4-Fetch-Single-User-by-ID)
5. [Search for Users](#5-Search-for-Users)
6. [Filter Users](#6-Filter-Users)
7. [Pagination](#7-Pagination)
8. [Sort and Sort Users](#8-Sort and Sort Users)
9. [Fetch User-Affiliate Data (Trolleys, [Posts, Tasks](#9-Fetch-User-Data-Carts-Posts-Tasks)

10. [Basic Operations (Add, Edit, Delete)](#10-Basic-Operations-Add-Edit-Delete)

---

## 1. Fetch All Users

The path returns **30 users** by default. You can use the `limit` and `skip` parameters to navigate between pages.

- **Link:** `GET https://dummyjson.com/users`

```javascript
fetch('[https://dummyjson.com/users](https://dummyjson.com/users)')
  .then((res) => res.json())

  .then(console.log);
```

# 🛍️ Products API Documentation

The `/products` path provides a comprehensive and fully simulated dataset of product information for e-commerce stores; it includes prices, descriptions, dimensions, images, reviews, and ratings. This interface is ideal for building storefronts, demo apps, and testing search and filtering processes.

---

## 📌 Index

1. [Fetch All Products] (#1-Fetch-All-Products)
2. [Fetch Single Product by ID] (#2-Fetch-Single-Product-by-ID)
3. [Search for Products] (#3-Search-for-Products)
4. [Pagination & Selection] (#4-Pagination & Selection)
5. [Sorting Products] (#5-Sorting Products)
6. [Categories Links] (#6-Categories Links)
7. [CRUD Operations] (#7-CRUD Operations)

---

## 1. Fetch All Products

The path returns **30 products** by default. You can use the `limit` and `skip` parameters to navigate between pages.

- **Link:** `GET https://dummyjson.com/products`

````javascript
fetch('[https://dummyjson.com/products](https://dummyjson.com/products)')

.then(res => res.json())

.then(console.log);


# 🛒 Carts API Documentation

The `/carts` path provides a comprehensive system for simulating shopping carts, invoicing processes, and checkout within e-commerce stores. This interface connects products and users via a user ID (`userId`) to deliver an interactive shopping experience and accurate, automated calculations of prices and discounts.

---

## 📌 Index
1. [Fetch All Shopping Carts](#1-Fetch-All-Shopping-Carts)
2. [Fetch One Shopping Cart by ID](#2-Fetch-One-Shopping-Cart-by-ID)
3. [Fetch Carts Belonging to a Specific User](#3-Fetch-Carts-Belonging-to-a-Specific-User)
4. [CRUD Operations](#4-CRUD-Operations)

---

## 1. Fetch All Shopping Carts
The route returns **30 shopping carts** by default. Each cart contains details of the selected products, their prices, quantities, and total financial accounts.

* **Link:** `GET https://dummyjson.com/carts`

```javascript
fetch('[https://dummyjson.com/carts](https://dummyjson.com/carts)')
.then(res => res.json())
.then(console.log);




````
