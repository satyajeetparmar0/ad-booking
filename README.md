# AdAdda - Online Advertisement Booking Platform

AdAdda is a full-stack online advertisement booking platform similar to EasyBookAd/BookMyAd. It allows users to book newspaper ads across India through a simple multi-step process.

![AdAdda](https://customer-assets.emergentagent.com/job_ad-booking-hub-1/artifacts/6saqx3xl_AdAdda%20%281%29.png)

## 🎥 Documentary Video

To learn more about AdAdda and see a walkthrough of its features, watch documentary video:

[![Watch Demo](https://img.youtube.com/vi/9kZc-0BXPwo/0.jpg)](https://youtu.be/9kZc-0BXPwo)

## Features

- **Multi-Step Ad Booking Flow** — Category → Location/Newspaper → Ad Type → Compose → Publish Date → Review & Payment
- **Hero Image Carousel** — Auto-scrolling banner with advertising slides, navigation arrows, and dot indicators
- **Floating Contact Buttons** — Phone & WhatsApp quick-access buttons with popups, plus a "Call Back" request tab
- **Image Upload** — Upload ad images during the compose step via Emergent Object Storage
- **Stripe Payment Gateway** — Secure online payment integration (test mode)
- **Admin Dashboard** — Manage all bookings, track revenue, approve/reject ads
- **Client Dashboard** — View personal bookings and statuses
- **Email Confirmations** — Automated email notifications via Resend after successful booking
- **JWT Authentication** — Secure login and registration system
- **Responsive Design** — Works seamlessly on desktop and mobile

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Tailwind CSS, shadcn/ui, Lucide React |
| Backend    | Node.js, Express.js                     |
| Database   | MongoDB (Mongoose)                      |
| Auth       | JWT (JSON Web Tokens)                   |
| Payments   | Stripe                                |
| Email      | Resend                                  |
| Storage    | Emergent Object Storage                 |

## Project Structure

```
├── backend/
│   ├── models/          # Mongoose models (User, BookingNew, Newspaper)
│   ├── routes/          # API routes (auth, bookingsNew, newspapers, payment, email, upload)
│   ├── middleware/       # Auth middleware
│   ├── server.js        # Express entry point
│   └── seed.js          # Database seeder
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components (Navbar, HeroCarousel, FloatingContact, booking-steps/)
│   │   ├── pages/       # Page components (Home, BookNow, Login, Register, Dashboards)
│   │   ├── context/     # Auth context provider
│   │   └── utils/       # API utility
│   └── tailwind.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/satyajeetparmar0/ad-booking.git
   cd ad-booking
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in `/backend`:
   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=adadda
   JWT_SECRET=your-jwt-secret
   RESEND_API_KEY=your-resend-api-key
   SENDER_EMAIL=onboarding@resend.dev
   STRIPE_KEY_ID=your-razorpay-key-id
   STRIPE_KEY_SECRET=your-razorpay-key-secret
   ```

3. **Seed the Database**
   ```bash
   node seed.js
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
   yarn install
   ```

   Create a `.env` file in `/frontend`:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```

5. **Run the Application**
   ```bash
   # Terminal 1 - Backend
   cd backend && node server.js

   # Terminal 2 - Frontend
   cd frontend && yarn start
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| POST   | `/api/auth/register`      | Register new user        |
| POST   | `/api/auth/login`         | Login                    |
| GET    | `/api/newspapers`         | List all newspapers      |
| POST   | `/api/bookingsNew/create` | Create a new booking     |
| GET    | `/api/bookingsNew/my`     | Get user's bookings      |
| POST   | `/api/payment/create-order` | Create Stripe order  |
| GET    | `/api/admin/bookings`     | Admin - all bookings     |
| GET    | `/api/admin/revenue`      | Admin - revenue stats    |

## Contact

- **Phone:** +91 9973634393
- **Landline:** 123-321-0000

## License

This project is for personal/commercial use. All rights reserved.
