<div align="center">

<img src="./banner.jpg" alt="ServiceHub — On-Demand Home Services Marketplace" width="100%" />

<br/>

<h3>India's Premium On-Demand Home Services Marketplace</h3>

<p>
  Book verified professionals for Cleaning, AC Repair, Salon, Plumbing, Electrician &amp; Pest Control — right from your doorstep.
</p>

<p>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Socket.IO-Real--Time-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Razorpay-Payments-0D74FF?style=for-the-badge&logo=razorpay&logoColor=white" alt="Razorpay" />
  <img src="https://img.shields.io/badge/Gemini-AI--Assistant-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
</p>

</div>

---

## 📋 Table of Contents

- [🚀 Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Getting Started](#️-getting-started)
  - [Prerequisites](#prerequisites)
  - [Option 1: Docker (Recommended)](#option-1-docker-recommended)
  - [Option 2: Manual Setup](#option-2-manual-setup)
- [🌱 Seed Data](#-seed-data)
- [🔐 Environment Variables](#-environment-variables)
- [📡 API Reference](#-api-reference)
- [🤖 Smart Engine](#-smart-engine)
- [👥 User Roles](#-user-roles)
- [🚢 Deployment](#-deployment)
- [🧪 Testing](#-testing)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🚀 Features

### For Customers
| Feature | Description |
|---|---|
| 🔍 **Service Discovery** | Browse & filter 50+ services across 6 categories with dynamic surge pricing |
| 🛒 **Multi-Service Cart** | Add multiple services, apply coupons, and view real-time price breakdown |
| 📅 **Smart Scheduling** | Pick date & time slots with conflict-free booking |
| 💳 **Razorpay Payments** | Secure checkout with UPI, card, and net banking |
| 📄 **PDF Invoices** | Auto-generated downloadable invoices for every booking |
| 📦 **Recurring Bookings** | Schedule weekly/monthly repeat services |
| 💰 **Wallet System** | Earn & redeem wallet credits on every booking |
| 🎁 **Referral Program** | Get rewards for every friend you invite |
| ⭐ **Reviews & Ratings** | Rate your experience after service completion |
| 🤖 **AI Assistant** | Gemini-powered chatbot for service recommendations |
| 🗺️ **Live Map Tracking** | Real-time provider location on interactive Leaflet map |
| 🔔 **Push Notifications** | Web push alerts for booking status updates |
| ⚖️ **Dispute Panel** | Raise and track service disputes with admin |

### For Service Providers
| Feature | Description |
|---|---|
| 📊 **Provider Dashboard** | Earnings overview, completed jobs, and ratings at a glance |
| 📆 **Availability Calendar** | Set working days, hours, and block-out dates |
| 📸 **Photo Uploads** | Upload work portfolio and KYC documents |
| ✅ **KYC Verification** | Submit Aadhaar/Voter ID for admin approval |
| 💬 **Real-time Chat** | Socket.IO powered messaging with customers |

### For Admins
| Feature | Description |
|---|---|
| 📈 **Analytics Dashboard** | Revenue trends, booking metrics, and conversion stats with Recharts |
| 👮 **KYC Management** | Review and approve/reject provider applications |
| 🏷️ **Coupon Management** | Create and manage promotional discount codes |
| ⚙️ **Service Management** | Add, edit, and remove service listings |
| 🚨 **Dispute Resolution** | View and resolve customer-provider disputes |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│   React 18 + Vite + TailwindCSS + React-Bootstrap           │
│   Redux Toolkit │ React Query │ React Router v6             │
│   Socket.IO Client │ Leaflet Maps │ Recharts                │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP + WebSocket
┌────────────────────────▼────────────────────────────────────┐
│                       API LAYER                              │
│     Express.js REST API (Node.js)                           │
│     JWT Auth │ Role-based Middleware │ Multer Uploads       │
│     Socket.IO Server │ Node-cron Jobs │ Web-Push            │
│     Razorpay │ Resend Email │ Twilio SMS │ Gemini AI        │
└────────────────────────┬────────────────────────────────────┘
                         │ Mongoose ODM
┌────────────────────────▼────────────────────────────────────┐
│                      DATA LAYER                              │
│          MongoDB (Atlas or Local via Docker)                 │
│   15 Collections: User, Provider, Booking, Service,         │
│   Category, Review, Wallet, Coupon, Dispute, Referral…      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **TailwindCSS v4** | Utility-first styling |
| **React Bootstrap** | Pre-built UI components |
| **Redux Toolkit** | Global state management |
| **TanStack Query** | Server state & caching |
| **React Router v6** | Client-side routing |
| **Socket.IO Client** | Real-time updates |
| **React Leaflet** | Interactive maps |
| **Recharts** | Data visualization |
| **Lucide React** | Icon library |
| **Canvas Confetti** | Celebration animations |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **MongoDB + Mongoose** | NoSQL database & ODM |
| **JSON Web Tokens** | Authentication & authorization |
| **bcryptjs** | Password hashing |
| **Socket.IO** | Real-time WebSocket server |
| **Razorpay** | Payment processing |
| **Google Generative AI** | Gemini AI chatbot |
| **PDFKit** | Invoice PDF generation |
| **Multer** | File & image uploads |
| **Resend** | Transactional email delivery |
| **Twilio** | SMS notifications |
| **Web-Push** | Browser push notifications |
| **Node-cron** | Scheduled recurring jobs |

### DevOps
| Technology | Purpose |
|---|---|
| **Docker + Compose** | Containerization |
| **Nginx** | Frontend reverse proxy |
| **Render** | Backend cloud deployment |
| **Jest + Supertest** | API testing framework |
| **MongoDB Memory Server** | In-memory DB for tests |

---

## 📁 Project Structure

```
ServiceHub/
├── 📄 docker-compose.yml          # Full-stack Docker orchestration
├── 📄 render.yaml                 # Render.com deployment config
├── 📄 package.json                # Root-level scripts
│
├── 🗂️ backend/
│   ├── server.js                  # Entry point with Socket.IO
│   ├── app.js                     # Express app setup & route mounting
│   ├── seed.js                    # Database seeder (demo data)
│   ├── Dockerfile
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   └── smartEngine.js         # 🧠 AI Provider Assignment & Surge Pricing
│   ├── middleware/
│   │   └── auth.js                # JWT verify + role guard
│   ├── models/                    # 15 Mongoose schemas
│   │   ├── User.js
│   │   ├── Provider.js
│   │   ├── Booking.js
│   │   ├── Service.js
│   │   ├── Category.js
│   │   ├── Review.js
│   │   ├── Wallet.js / WalletTransaction.js
│   │   ├── Coupon.js
│   │   ├── Dispute.js
│   │   ├── Referral.js
│   │   ├── RecurringBooking.js
│   │   ├── AvailabilityBlock.js
│   │   ├── ChatMessage.js
│   │   └── PushSubscription.js
│   ├── routes/                    # 17 REST API route modules
│   │   ├── auth.js                # Register, Login, Forgot/Reset Password
│   │   ├── bookings.js            # Full booking lifecycle
│   │   ├── services.js            # Services with dynamic pricing
│   │   ├── providers.js           # Provider profiles & matching
│   │   ├── admin.js               # Admin metrics & KYC management
│   │   ├── payments.js            # Razorpay orders & PDF invoices
│   │   ├── reviews.js             # Ratings & reviews
│   │   ├── wallet.js              # Credits & transactions
│   │   ├── referrals.js           # Referral tracking
│   │   ├── disputes.js            # Dispute management
│   │   ├── recurring.js           # Recurring bookings
│   │   ├── availability.js        # Provider calendar blocks
│   │   ├── notifications.js       # Web push subscriptions
│   │   ├── photos.js              # Image upload
│   │   ├── geocode.js             # OSM Nominatim geocoding (cached)
│   │   ├── ai.js                  # Gemini AI chatbot
│   │   └── user.js                # User profile & addresses
│   ├── services/
│   │   └── cronJobs.js            # Scheduled tasks
│   └── tests/
│       └── *.test.js              # Jest API tests
│
└── 🗂️ frontend/
    ├── index.html
    ├── vite.config.js
    ├── nginx.conf                 # Production nginx config
    ├── Dockerfile
    └── src/
        ├── App.jsx                # Route definitions
        ├── main.jsx
        ├── api.js                 # Axios base instance
        ├── contexts/
        │   └── AuthContext.jsx    # JWT auth context
        ├── components/
        │   ├── Home.jsx           # Landing page
        │   ├── ServiceList.jsx    # Browse & filter services
        │   ├── CartBooking.jsx    # Checkout flow
        │   ├── AdminDashboard.jsx # Admin analytics & management
        │   ├── AIAssistant.jsx    # Floating Gemini chatbot
        │   ├── Reviews.jsx        # Customer reviews section
        │   ├── Header.jsx         # Navigation bar
        │   └── ...
        └── pages/
            ├── Bookings.jsx
            ├── ProviderDashboard.jsx
            ├── AvailabilityCalendar.jsx
            ├── Wallet.jsx
            ├── Referral.jsx
            ├── DisputePanel.jsx
            └── RecurringBookings.jsx
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **Docker Desktop** (for Option 1) — OR — **MongoDB** locally (for Option 2)
- **Git**

### Option 1: Docker (Recommended)

The fastest way to run the entire stack with a single command.

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ServiceHub.git
cd ServiceHub

# 2. Start the full stack (MongoDB + Backend + Frontend)
docker compose up --build -d

# 3. Seed demo data
docker exec servicehub_backend node seed.js

# 4. Open in browser
# Frontend:    http://localhost
# Backend API: http://localhost:5000/api/health
```

### Option 2: Manual Setup

#### Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your values (see Environment Variables section)

# Seed demo data
npm run seed

# Start development server
npm run dev
# Server runs at http://localhost:5000
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# App runs at http://localhost:5173
```

---

## 🌱 Seed Data

Run the seeder to populate the database with demo users, services, providers, and coupons:

```bash
cd backend && npm run seed
```

This creates the following accounts (all with password: **`password123`**):

| Role | Email | Description |
|---|---|---|
| 👑 **Admin** | `admin@servicehub.com` | Full admin portal access |
| 👤 **Customer** | `customer@servicehub.com` | ServiceHub Plus subscriber |
| 🔧 **Provider** | `provider@servicehub.com` | Amit Kumar — Master Technician |
| 💅 **Provider** | `priya@servicehub.com` | Priya Verma — Beauty Expert |

**Demo Coupons:**
- `WELCOME50` — 50% off (up to ₹300) on orders above ₹499
- `FESTIVE20` — 20% off (up to ₹500) on orders above ₹799

---

## 🔐 Environment Variables

Create `backend/.env` from the example file:

```bash
cp backend/.env.example backend/.env
```

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT signing |
| `REFRESH_SECRET` | ✅ | Secret key for refresh tokens |
| `PORT` | ✅ | Server port (default: `5000`) |
| `RAZORPAY_KEY_ID` | ⚠️ | Razorpay API key (test mode) |
| `RAZORPAY_KEY_SECRET` | ⚠️ | Razorpay secret key |
| `GEMINI_API_KEY` | ⚠️ | Google AI Studio key for chatbot |
| `RESEND_API_KEY` | ⚠️ | Resend email API key |
| `TWILIO_ACCOUNT_SID` | ⚠️ | Twilio SID for SMS |
| `TWILIO_AUTH_TOKEN` | ⚠️ | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | ⚠️ | Twilio phone number |
| `VAPID_PUBLIC_KEY` | ⚠️ | Web Push VAPID public key |
| `VAPID_PRIVATE_KEY` | ⚠️ | Web Push VAPID private key |

> ✅ = Required for app to run | ⚠️ = Optional (features degrade gracefully with mock fallbacks)

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive JWT |
| `POST` | `/auth/forgot-password` | Send password reset email |
| `POST` | `/auth/reset-password/:token` | Reset password with token |

### Services
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/services` | List all services (supports `?category`, `?search`, `?scheduledDate`, `?timeSlot` for dynamic pricing) |
| `GET` | `/services/categories` | Get all service categories |
| `GET` | `/services/:id` | Get single service details |
| `POST` | `/services` | Create service (Admin only) |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/bookings` | Create a new booking |
| `GET` | `/bookings/my` | Get current user's bookings |
| `PATCH` | `/bookings/:id/status` | Update booking status |
| `POST` | `/bookings/:id/cancel` | Cancel a booking |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/payments/create-order` | Create Razorpay order |
| `POST` | `/payments/verify` | Verify payment signature |
| `GET` | `/payments/invoice/:bookingId` | Download PDF invoice |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/dashboard` | Platform analytics & metrics |
| `GET` | `/admin/providers/pending-kyc` | Providers awaiting review |
| `PATCH` | `/admin/providers/:id/kyc-status` | Approve/Reject KYC |
| `GET` | `/admin/coupons` | List all coupons |
| `POST` | `/admin/coupons` | Create a coupon |

### Other Endpoints
| Prefix | Description |
|---|---|
| `/api/reviews` | Service reviews & ratings |
| `/api/wallet` | Wallet balance & transactions |
| `/api/referrals` | Referral codes & rewards |
| `/api/disputes` | Dispute filing & resolution |
| `/api/providers` | Provider profiles & availability |
| `/api/recurring` | Recurring booking management |
| `/api/notifications` | Push notification subscriptions |
| `/api/geocode` | Address → coordinates (cached OSM Nominatim) |
| `/api/ai/chat` | Gemini AI chatbot conversation |
| `/api/health` | Health check endpoint |

---

## 🤖 Smart Engine

ServiceHub includes a custom **Smart Provider Assignment Algorithm** and **Dynamic Surge Pricing Engine** (`backend/config/smartEngine.js`):

### Auto-Assignment Algorithm

When a booking is created, the system automatically selects the best available provider using a weighted composite score:

```
Total Score = (Distance Score × 50%) + (Rating Score × 30%) + (Completion Rate × 20%)
```

**Steps:**
1. **Filter** — Only online, KYC-approved providers within the customer's service radius
2. **Conflict Detection** — Skip providers already booked at the same date/time slot
3. **Haversine Distance** — Calculate precise great-circle distance in km
4. **Rank** — Select the provider with the highest composite score
5. **Fallback** — If no ideal match found, assign the highest-rated available provider

### Dynamic Surge Pricing

Prices automatically adjust based on demand:
- **+15%** during peak time slots (09:00, 10:00, 18:00)
- **+10%** on weekends (Saturday & Sunday)

Surge pricing is displayed in real-time in the service listing UI with a visible surge badge.

---

## 👥 User Roles

| Role | Access Level |
|---|---|
| **Customer** | Browse services, book, pay, review, manage wallet & referrals |
| **Provider** | Manage availability, view assigned bookings, track earnings |
| **Admin** | Full platform control: KYC, coupons, services, analytics, disputes |

Routes are protected via JWT middleware with role-based authorization (`verifyToken` + `authorizeRoles`).

---

## 🚢 Deployment

### Deploy Backend to Render

1. Push your code to GitHub
2. Create a new **Web Service** on [Render.com](https://render.com)
3. Connect your GitHub repository — Render auto-detects `render.yaml`
4. Add your environment variables in the Render dashboard
5. Click **Deploy**!

### Deploy Frontend to Vercel

```bash
cd frontend
# vercel.json is already configured
npx vercel --prod
```

Set `VITE_API_URL` to your Render backend URL in Vercel environment settings.

### Full Docker Production Stack

```bash
# Build and launch all services
docker compose up --build -d

# View live logs
docker compose logs -f

# Stop all containers
docker compose down
```

---

## 🧪 Testing

Backend uses **Jest** + **Supertest** with an in-memory MongoDB for fully isolated, zero-configuration tests:

```bash
cd backend

# Run all tests
npm test

# Verbose output
npm test -- --verbose
```

Tests cover authentication flows, booking creation, and service API endpoints. MongoDB Memory Server spins up automatically — no local database required.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to your branch: `git push origin feature/your-amazing-feature`
5. **Open** a Pull Request

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ in India** 🇮🇳

<p>
  <a href="https://github.com/YOUR_USERNAME/ServiceHub/issues">Report Bug</a> ·
  <a href="https://github.com/YOUR_USERNAME/ServiceHub/issues">Request Feature</a>
</p>

</div>
“A web platform for booking and managing home services.”
