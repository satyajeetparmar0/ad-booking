# AdAdda API Documentation

## Base URL
```
Production: https://ad-booking-hub-1.preview.emergentagent.com/api
Local: http://localhost:8001/api
```

---

## Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Auth Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "client" // optional, defaults to "client"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client"
  }
}
```

---

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "admin@adadda.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "uuid-here",
    "name": "Admin User",
    "email": "admin@adadda.com",
    "role": "admin"
  }
}
```

---

### Get Current User
```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "userId": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client"
  }
}
```

---

## 📢 Ad Endpoints

### Get All Ads
```http
GET /api/ads
```

**Query Parameters:**
- `category` (optional): Filter by category
- `location` (optional): Filter by location
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `search` (optional): Search in title/description

**Example:**
```http
GET /api/ads?category=Digital&minPrice=10000&maxPrice=50000
```

**Response:**
```json
{
  "ads": [
    {
      "adId": "uuid-here",
      "title": "Google Display Network",
      "description": "Run targeted banner ads...",
      "category": "Digital",
      "price": 25000,
      "location": "Pan India",
      "imageUrl": "https://...",
      "duration": "7 Days",
      "features": ["Geo-targeting", "Analytics"],
      "isActive": true,
      "createdAt": "2025-03-31T..."
    }
  ]
}
```

---

### Get Single Ad
```http
GET /api/ads/:id
```

**Response:**
```json
{
  "ad": {
    "adId": "uuid-here",
    "title": "Google Display Network",
    ...
  }
}
```

---

### Create Ad (Admin Only)
```http
POST /api/ads
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "title": "Instagram Stories Ads",
  "description": "Full-screen vertical video ads...",
  "category": "Digital",
  "price": 18000,
  "location": "Pan India",
  "imageUrl": "https://...",
  "duration": "5 Days",
  "features": ["Swipe Up", "Analytics", "Video Format"]
}
```

**Response:**
```json
{
  "message": "Ad created successfully",
  "ad": { ... }
}
```

---

### Update Ad (Admin Only)
```http
PUT /api/ads/:id
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:** (same as create)

---

### Delete Ad (Admin Only)
```http
DELETE /api/ads/:id
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

## 📅 Booking Endpoints

### Create Booking
```http
POST /api/bookings
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "adId": "uuid-of-ad",
  "startDate": "2025-04-15",
  "adContent": "Your advertisement content here...",
  "paymentId": "pay_razorpay_payment_id" // from Razorpay
}
```

**Response:**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "bookingId": "uuid-here",
    "userId": "user-uuid",
    "adId": "ad-uuid",
    "adTitle": "Google Display Network",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "startDate": "2025-04-15T00:00:00.000Z",
    "adContent": "Your ad content...",
    "totalPrice": 25000,
    "paymentStatus": "completed",
    "paymentId": "pay_xxx",
    "status": "confirmed",
    "createdAt": "2025-03-31T..."
  }
}
```

---

### Get My Bookings
```http
GET /api/bookings/my-bookings
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "bookings": [
    {
      "bookingId": "uuid",
      "adTitle": "Google Display Network",
      "startDate": "2025-04-15T...",
      "totalPrice": 25000,
      "paymentStatus": "completed",
      "status": "confirmed",
      ...
    }
  ]
}
```

---

### Get All Bookings (Admin Only)
```http
GET /api/bookings/all
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "bookings": [
    {
      "bookingId": "uuid",
      "userId": "user-uuid",
      "userName": "John Doe",
      "userEmail": "john@example.com",
      "adTitle": "Google Display Network",
      "startDate": "2025-04-15T...",
      "adContent": "Ad content here",
      "totalPrice": 25000,
      "paymentStatus": "completed",
      "paymentId": "pay_xxx",
      "status": "confirmed",
      "createdAt": "2025-03-31T..."
    }
  ]
}
```

---

### Update Booking Status (Admin Only)
```http
PATCH /api/bookings/:id/status
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "confirmed" // or "pending", "completed", "cancelled"
}
```

**Response:**
```json
{
  "message": "Booking status updated",
  "booking": { ... }
}
```

---

### Delete Booking (Admin Only)
```http
DELETE /api/bookings/:id
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "message": "Booking deleted successfully"
}
```

---

### Get Revenue Stats (Admin Only)
```http
GET /api/bookings/stats/revenue
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "totalRevenue": 150000,
  "paidBookings": 6,
  "totalBookings": 10,
  "pendingBookings": 4
}
```

---

## 💳 Payment Endpoints

### Create Razorpay Order
```http
POST /api/payment/create-order
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 25000, // in rupees
  "currency": "INR"
}
```

**Response:**
```json
{
  "orderId": "order_razorpay_order_id",
  "amount": 2500000, // in paise
  "currency": "INR",
  "keyId": "rzp_test_xxx"
}
```

---

### Verify Payment
```http
POST /api/payment/verify-payment
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_from_razorpay"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "paymentId": "pay_xxx"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": "Invalid payment signature"
}
```

---

## ✉️ Email Endpoints

### Send Booking Confirmation
```http
POST /api/email/send-confirmation
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "bookingId": "uuid",
  "adTitle": "Google Display Network",
  "startDate": "2025-04-15",
  "totalPrice": 25000
}
```

**Response:**
```json
{
  "message": "Email sent successfully",
  "emailId": "resend-email-id"
}
```

---

## 📤 File Upload Endpoint

### Upload File
```http
POST /api/upload
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
file: <binary data>
```

**Response:**
```json
{
  "message": "File uploaded successfully",
  "path": "adadda/uploads/user-id/uuid.jpg",
  "url": "https://.../api/files/adadda/uploads/user-id/uuid.jpg"
}
```

---

## 🔒 Error Responses

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
// or
{
  "error": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Ad not found"
}
// or
{
  "error": "Booking not found"
}
```

### 500 Server Error
```json
{
  "error": "Something went wrong!"
}
```

---

## 🧪 Testing with cURL

### Login
```bash
curl -X POST https://ad-booking-hub-1.preview.emergentagent.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@adadda.com",
    "password": "admin123"
  }'
```

### Get Ads
```bash
curl https://ad-booking-hub-1.preview.emergentagent.com/api/ads
```

### Create Booking (with token)
```bash
curl -X POST https://ad-booking-hub-1.preview.emergentagent.com/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "adId": "ad-uuid",
    "startDate": "2025-04-15",
    "adContent": "My ad content",
    "paymentId": "pay_xxx"
  }'
```

---

## 🎯 Complete Payment Flow

1. **Create Razorpay Order**
```javascript
const orderResponse = await fetch('/api/payment/create-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ amount: 25000, currency: 'INR' })
});
const { orderId, amount, keyId } = await orderResponse.json();
```

2. **Open Razorpay Checkout**
```javascript
const options = {
  key: keyId,
  amount: amount,
  currency: 'INR',
  order_id: orderId,
  handler: async function(response) {
    // Payment successful, verify it
    const verifyResponse = await fetch('/api/payment/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      })
    });
  }
};

const razorpay = new Razorpay(options);
razorpay.open();
```

3. **Create Booking with paymentId**
```javascript
await fetch('/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    adId: 'uuid',
    startDate: '2025-04-15',
    adContent: 'My ad',
    paymentId: response.razorpay_payment_id
  })
});
```

---

## 📝 Notes

- All dates should be in ISO 8601 format
- Amounts in payment endpoints are in paise (multiply by 100)
- JWT tokens expire in 7 days
- Admin role is required for ad management and booking oversight
- Payment signature verification is mandatory for security

---

**Need Help?** Check `/app/FEATURES_DOCUMENTATION.md` for detailed feature explanations!
