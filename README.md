# 🛍️ StyleVerse — Gen Z Fashion E-Commerce

A fully functional, visually stunning fashion e-commerce platform with Gen Z-focused design aesthetics. Built with **Next.js**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB**.

![StyleVerse](https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800)

## ✨ Features

### 🎨 User-Facing Site
- **Homepage** — Hero section, categories, new arrivals, trending, bestsellers
- **Product Browsing** — Filter by category, price, tags; sort and search
- **Product Details** — Image gallery, sizes, colors, reviews, related products
- **Shopping Cart** — Add/remove items, quantity controls, price summary
- **Wishlist** — Save favorite products
- **Checkout** — Multi-step (address → payment → review), saved addresses
- **Order Tracking** — Visual progress bar (Placed → Shipped → Delivered)
- **User Profile** — Profile info, address management (CRUD)
- **Authentication** — Sign up, login, logout with JWT

### 🛠️ Admin Panel (`/admin`)
- **Dashboard** — Stats (products, orders, users, revenue)
- **Product Management** — Full CRUD with images, sizes, colors, tags
- **Category Management** — Add/edit/delete categories
- **Order Management** — View all orders, update status
- **User Management** — View all registered users

### 🎯 Extra Features
- Search bar with instant results
- Product ratings & reviews
- Discount badges & sale banners
- Newsletter signup section
- Lazy loading images
- Smooth animations (Framer Motion)
- Mobile-first responsive design
- Marquee promo banner

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS 3 |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Animations | Framer Motion |
| Icons | React Icons (Feather) |
| HTTP Client | Axios |
| Notifications | React Hot Toast |

---

## 📁 Project Structure

```
antigravity/
├── backend/
│   ├── config/         # Database connection
│   ├── controllers/    # Route handlers
│   ├── middleware/      # Auth middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── seed/           # Database seeder
│   ├── server.js       # Entry point
│   └── .env            # Environment variables
├── frontend/
│   ├── src/
│   │   ├── app/        # Next.js pages
│   │   │   ├── admin/      # Admin panel
│   │   │   ├── cart/       # Shopping cart
│   │   │   ├── checkout/   # Checkout flow
│   │   │   ├── login/      # Login page
│   │   │   ├── register/   # Registration
│   │   │   ├── orders/     # Order history
│   │   │   ├── products/   # Product listing & details
│   │   │   ├── profile/    # User profile
│   │   │   ├── wishlist/   # Wishlist
│   │   │   └── page.js     # Homepage
│   │   ├── components/ # Reusable components
│   │   ├── context/    # React contexts (Auth, Cart, Wishlist)
│   │   └── lib/        # API client & utilities
│   └── tailwind.config.js
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- **Node.js** v18+ installed
- **MongoDB** running locally on port 27017 (or MongoDB Atlas URI)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/styleverse
JWT_SECRET=styleverse_super_secret_key_2024
JWT_EXPIRE=7d
NODE_ENV=development
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

This creates:
- 6 categories (Men, Women, Kids, Accessories, Footwear, Beauty)
- 22 products with images, reviews, and tags
- 2 users:
  - **Admin**: `admin@styleverse.com` / `admin123`
  - **User**: `user@test.com` / `test123`

### 4. Run the App

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

### 5. Open in Browser

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| Admin Panel | http://localhost:3000/admin |

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@styleverse.com | admin123 |
| User | user@test.com | test123 |

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user
- `PUT /api/auth/addresses` — Update addresses
- `GET /api/auth/users` — List all users (admin)

### Products
- `GET /api/products` — List (filter, sort, paginate)
- `GET /api/products/:id` — Single product
- `POST /api/products` — Create (admin)
- `PUT /api/products/:id` — Update (admin)
- `DELETE /api/products/:id` — Delete (admin)
- `POST /api/products/:id/reviews` — Add review

### Cart
- `GET /api/cart` — Get cart
- `POST /api/cart` — Add item
- `PUT /api/cart/:itemId` — Update quantity
- `DELETE /api/cart/:itemId` — Remove item
- `DELETE /api/cart` — Clear cart

### Wishlist
- `GET /api/wishlist` — Get wishlist
- `POST /api/wishlist` — Toggle item

### Orders
- `POST /api/orders` — Create order
- `GET /api/orders` — User's orders
- `GET /api/orders/:id` — Single order
- `GET /api/orders/admin/all` — All orders (admin)
- `PUT /api/orders/:id/status` — Update status (admin)

### Categories
- `GET /api/categories` — List all
- `POST /api/categories` — Create (admin)
- `PUT /api/categories/:id` — Update (admin)
- `DELETE /api/categories/:id` — Delete (admin)
