# ShopSphere — Full-Stack E-Commerce Application

A clean, modular, full-stack e-commerce mobile application built with **Plain JavaScript**, **Node.js + Express + MongoDB** on the backend, and **React Native (Expo) + Redux Toolkit** on the frontend.

---

## Tech Stack

### Backend (`/backend`)
- **Runtime & Framework:** Node.js, Express.js (JavaScript)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) + `bcryptjs` password hashing
- **API Documentation:** Swagger UI (`swagger-jsdoc` & `swagger-ui-express`)
- **Validation & Security:** `cors`, `dotenv`, centralized error handling

### Frontend (`/frontend`)
- **Framework:** React Native (Expo SDK 52, Plain JavaScript)
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) + `AsyncStorage` persistence
- **Navigation:** React Navigation (Native Stack + Bottom Tabs)
- **Animations:** React Native `Animated` API (spring pressables, staggered card fades, toast banners, cart badge bounce)
- **HTTP Client:** Axios with automatic JWT Bearer token injection

---

## Features Implemented

1. **Authentication & Account Lifecycle**
   - User Registration & Login with JWT
   - Persistent login session via `AsyncStorage`
   - **Account Deletion** (permanently removes user profile, cart, wishlist, and order history)
2. **Product Catalog & Discovery**
   - Browse products with category filtering (`All`, `Electronics`, `Fashion`, `Home`, `Fitness`, `Accessories`)
   - Live keyword search
   - Detailed product view with ratings, stock status, and specifications
   - Database seeder (`npm run seed`) with realistic products and a demo account
3. **Shopping Cart & Wishlist (Extras Included)**
   - Add to cart, increment/decrement quantity, remove items, clear cart
   - Real-time subtotal, shipping, tax, and grand total calculation
   - Wishlist / Favorites toggle synced with backend
4. **Order Management (Pre-Payment Ready)**
   - Shipping address form & order creation (`Pending Payment` / `COD` status ready for Phase 2 Payment Gateway hook)
   - Order history screen with itemized status badges
5. **Profile Management**
   - View and update name, phone number, avatar URL, and default shipping address
   - Change password securely
6. **Interactive Swagger API Docs**
   - Full OpenAPI 3.0 specification accessible at `http://localhost:5000/api-docs`

---

## Project Structure

```text
ShopSphere/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection & Swagger configuration
│   │   ├── controllers/     # Route business logic (auth, products, cart, orders, user)
│   │   ├── middleware/      # JWT auth guard & centralized error handler
│   │   ├── models/          # Mongoose schemas (User, Product, Order)
│   │   ├── routes/          # Express routers with Swagger JSDoc annotations
│   │   ├── seed/            # Sample products & demo user seeder
│   │   └── app.js           # Express app setup
│   ├── server.js            # Entry point
│   ├── .env.example         # Environment variable template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance & endpoint services
│   │   ├── components/      # Reusable animated UI components
│   │   ├── navigation/      # AuthStack, MainTabs, RootNavigator
│   │   ├── screens/         # All application screens
│   │   ├── store/           # Redux Toolkit store & slices (auth, products, cart, orders)
│   │   └── theme/           # Colors, spacing, typography
│   ├── App.js               # Root component
│   ├── app.json             # Expo configuration
│   └── package.json
└── README.md
```

---

## Setup & Running Instructions

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update MONGO_URI and JWT_SECRET in .env if needed
npm run seed      # Populates sample products & demo user
npm run dev       # Starts server on http://localhost:5000
```
- **API Base URL:** `http://localhost:5000/api`
- **Swagger Documentation:** `http://localhost:5000/api-docs`
- **Demo Credentials (from seed):**
  - Email: `demo@shopsphere.com`
  - Password: `Password123!`

### 2. Frontend Setup
```bash
cd frontend
npm install
npx expo start
```
- **Important Networking Note:**
  - For **Android Emulator**, `src/api/client.js` automatically uses `http://10.0.2.2:5000/api`.
  - For **iOS Simulator**, it uses `http://localhost:5000/api`.
  - For a **Physical Device**, replace the `BASE_URL` in `frontend/src/api/client.js` with your computer's local Wi-Fi IPv4 address (e.g., `http://192.168.1.10:5000/api`).

---

## Roadmap — Next Phase (Payment Gateway Integration)
The backend `Order` model and `CheckoutScreen` already include `paymentStatus` (`pending` / `paid`) and `paymentMethod` fields, plus a dedicated `/api/orders/:id/pay` stub endpoint ready to be wired to Stripe or Razorpay in the final phase.
