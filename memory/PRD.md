# AdAdda - Online Advertisement Booking Platform

## Original Problem Statement
Build "AdAdda", a full-stack online advertisement booking platform similar to EasyBookAd/BookMyAd with multi-step ad booking flow, image upload, payment integration, admin/client dashboards, and email confirmations.

## Tech Stack
- **Frontend:** React 18, React Router, Tailwind CSS, Lucide React, shadcn/ui
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT Auth
- **Payments:** Razorpay (test mode - keys may be restricted)
- **Email:** Resend
- **Image Upload:** Emergent Object Storage

## Architecture
```
/app/
├── backend/ (Node.js + Express on port 8001)
│   ├── models/ (User, Booking, BookingNew, Newspaper)
│   ├── routes/ (auth, bookings, bookingsNew, newspapers, payment, email, upload)
│   ├── middleware/ (auth)
│   ├── server.js, seed.js, seedNewspapers.js
├── frontend/ (React on port 3000)
│   ├── src/components/ (Navbar, HeroCarousel, FloatingContact, AdCard, CategoryCard, booking-steps/, ui/)
│   ├── src/pages/ (Home, BookNow, Login, Register, ClientDashboard, AdminDashboard)
│   ├── src/context/ (AuthContext)
│   ├── src/utils/ (api.js)
```

## What's Been Implemented

### Core Features (DONE)
- JWT Auth flow (Login, Register) & middleware
- Multi-step EasyBookAd booking flow (Category → Location/Newspaper → Ad Type → Compose → Date → Review & Payment)
- Client & Admin dashboards with revenue tracking
- MongoDB models and seeded Newspaper/City data
- Resend email integration for confirmations
- Image upload via Emergent Object Storage
- Price calculation in booking flow

### Homepage & UI (DONE - Feb 2026)
- **Hero Image Carousel** - Auto-scrolling (5s) with 3 slides, prev/next arrows (blue circles), dot indicators, smooth opacity transitions, "BOOK NOW" CTA overlay
- **Floating Contact Buttons** - Left side: Phone (red) + WhatsApp (green) with popups showing contact details
- **"Call Back" Tab** - Right side vertical red tab with callback request form (name + phone)
- **Navbar "Contact Us"** - Dropdown with phone + WhatsApp links
- **Bottom Contact Bar** - Mobile-only fixed bar with phone CTA
- Blue/orange gradient theme with AdAdda logo

## Known Issues
- **Razorpay Payment:** `BAD_REQUEST_ERROR: Authentication failed` - Test keys may be restricted/expired. Blocks final booking step.

## Prioritized Backlog

### P0 (Critical)
- Resolve Razorpay payment flow (get new keys or implement mock payment)

### P1 (Important)
- E2E test of full multi-step booking flow (Category → Payment)
- Verify image upload displays in Admin Dashboard

### P2 (Nice to have)
- Clean up legacy `Booking.js` model & `bookings.js` routes
- Mobile responsiveness polish across all pages
- Admin approval workflow improvements

### P3 (Future)
- SEO optimization
- Analytics dashboard enhancements
- Multi-language support
