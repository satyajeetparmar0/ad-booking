"""
Backend API Tests for AdAdda Payment and Booking Flow
Tests: Payment order creation, booking creation, payment update, email confirmation
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
CLIENT_EMAIL = "client@adadda.com"
CLIENT_PASSWORD = "client123"
ADMIN_EMAIL = "admin@adadda.com"
ADMIN_PASSWORD = "admin123"


class TestAuth:
    """Authentication tests"""
    
    def test_client_login(self):
        """Test client login returns token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": CLIENT_EMAIL,
            "password": CLIENT_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == CLIENT_EMAIL
        assert data["user"]["role"] == "client"
    
    def test_admin_login(self):
        """Test admin login returns token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["user"]["role"] == "admin"
    
    def test_invalid_login(self):
        """Test invalid credentials return 401"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrong@email.com",
            "password": "wrongpass"
        })
        assert response.status_code == 401


@pytest.fixture
def client_token():
    """Get client auth token"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": CLIENT_EMAIL,
        "password": CLIENT_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("token")
    pytest.skip("Client authentication failed")


@pytest.fixture
def admin_token():
    """Get admin auth token"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("token")
    pytest.skip("Admin authentication failed")


@pytest.fixture
def newspaper_id():
    """Get a valid newspaper ID"""
    response = requests.get(f"{BASE_URL}/api/newspapers")
    if response.status_code == 200:
        newspapers = response.json().get("newspapers", [])
        if newspapers:
            return newspapers[0]["newspaperId"]
    pytest.skip("No newspapers available")


class TestNewspapers:
    """Newspaper API tests"""
    
    def test_get_newspapers(self):
        """Test fetching newspapers list"""
        response = requests.get(f"{BASE_URL}/api/newspapers")
        assert response.status_code == 200
        data = response.json()
        assert "newspapers" in data
        assert len(data["newspapers"]) > 0
        # Verify newspaper structure
        newspaper = data["newspapers"][0]
        assert "newspaperId" in newspaper
        assert "name" in newspaper
        assert "cities" in newspaper
        assert "basePrice" in newspaper


class TestPaymentOrderCreation:
    """Payment order creation tests"""
    
    def test_create_order_success(self, client_token):
        """Test Razorpay order creation with valid amount"""
        response = requests.post(
            f"{BASE_URL}/api/payment/create-order",
            headers={"Authorization": f"Bearer {client_token}"},
            json={"amount": 500, "currency": "INR"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "orderId" in data
        assert data["orderId"].startswith("order_")
        assert "amount" in data
        assert data["amount"] == 50000  # Amount in paise
        assert "keyId" in data
        assert data["keyId"] == "rzp_test_SYJ6uGZ5kOHaJV"
    
    def test_create_order_unauthorized(self):
        """Test order creation without auth returns 401"""
        response = requests.post(
            f"{BASE_URL}/api/payment/create-order",
            json={"amount": 500, "currency": "INR"}
        )
        assert response.status_code == 401


class TestPaymentVerification:
    """Payment verification tests"""
    
    def test_verify_payment_invalid_signature(self, client_token):
        """Test payment verification with invalid signature"""
        response = requests.post(
            f"{BASE_URL}/api/payment/verify-payment",
            headers={"Authorization": f"Bearer {client_token}"},
            json={
                "razorpay_order_id": "order_test123",
                "razorpay_payment_id": "pay_test123",
                "razorpay_signature": "invalid_signature"
            }
        )
        assert response.status_code == 400
        data = response.json()
        assert data["success"] == False
        assert "Invalid payment signature" in data["error"]


class TestBookingCreation:
    """Booking creation tests"""
    
    def test_create_booking_success(self, client_token, newspaper_id):
        """Test booking creation with valid data"""
        response = requests.post(
            f"{BASE_URL}/api/bookings-new/create",
            headers={"Authorization": f"Bearer {client_token}"},
            json={
                "category": "Matrimonial",
                "city": "Delhi",
                "newspaperId": newspaper_id,
                "adType": "Classified Text",
                "adContent": "Test ad content for testing purposes",
                "publishDate": "2026-03-01",
                "price": 500
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert "booking" in data
        booking = data["booking"]
        assert "bookingId" in booking
        assert booking["category"] == "Matrimonial"
        assert booking["paymentStatus"] == "pending"
        assert booking["bookingStatus"] == "pending"
        return booking["bookingId"]
    
    def test_create_booking_invalid_category(self, client_token, newspaper_id):
        """Test booking creation with invalid category"""
        response = requests.post(
            f"{BASE_URL}/api/bookings-new/create",
            headers={"Authorization": f"Bearer {client_token}"},
            json={
                "category": "InvalidCategory",
                "city": "Delhi",
                "newspaperId": newspaper_id,
                "adType": "Classified Text",
                "adContent": "Test content",
                "publishDate": "2026-03-01",
                "price": 500
            }
        )
        assert response.status_code == 500  # Validation error
    
    def test_create_booking_invalid_adtype(self, client_token, newspaper_id):
        """Test booking creation with invalid ad type"""
        response = requests.post(
            f"{BASE_URL}/api/bookings-new/create",
            headers={"Authorization": f"Bearer {client_token}"},
            json={
                "category": "Matrimonial",
                "city": "Delhi",
                "newspaperId": newspaper_id,
                "adType": "InvalidType",
                "adContent": "Test content",
                "publishDate": "2026-03-01",
                "price": 500
            }
        )
        assert response.status_code == 500  # Validation error


class TestPaymentUpdate:
    """Payment update tests"""
    
    def test_update_payment_status(self, client_token, newspaper_id):
        """Test updating payment status after successful payment"""
        # First create a booking
        create_response = requests.post(
            f"{BASE_URL}/api/bookings-new/create",
            headers={"Authorization": f"Bearer {client_token}"},
            json={
                "category": "Recruitment",
                "city": "Mumbai",
                "newspaperId": newspaper_id,
                "adType": "Classified Display",
                "adContent": "Hiring software engineers. Apply now!",
                "publishDate": "2026-03-15",
                "price": 750
            }
        )
        assert create_response.status_code == 201
        booking_id = create_response.json()["booking"]["bookingId"]
        
        # Update payment status
        update_response = requests.patch(
            f"{BASE_URL}/api/bookings-new/{booking_id}/payment",
            headers={"Authorization": f"Bearer {client_token}"},
            json={
                "paymentId": "pay_test_payment_update",
                "paymentStatus": "completed"
            }
        )
        assert update_response.status_code == 200
        data = update_response.json()
        assert data["booking"]["paymentStatus"] == "completed"
        assert data["booking"]["bookingStatus"] == "confirmed"
        assert data["booking"]["paymentId"] == "pay_test_payment_update"


class TestEmailConfirmation:
    """Email confirmation tests"""
    
    def test_send_confirmation_email(self):
        """Test email confirmation endpoint"""
        response = requests.post(
            f"{BASE_URL}/api/email/send-confirmation",
            json={
                "email": "test@example.com",
                "name": "Test User",
                "bookingId": "test-booking-email",
                "adTitle": "Test Ad Title",
                "startDate": "2026-03-01",
                "totalPrice": 500
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "Email sent successfully" in data["message"]


class TestMyBookings:
    """User bookings retrieval tests"""
    
    def test_get_my_bookings(self, client_token):
        """Test fetching user's bookings"""
        response = requests.get(
            f"{BASE_URL}/api/bookings-new/my-bookings",
            headers={"Authorization": f"Bearer {client_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "bookings" in data
        assert isinstance(data["bookings"], list)


class TestAdminBookings:
    """Admin booking management tests"""
    
    def test_get_all_bookings(self, admin_token):
        """Test admin can fetch all bookings"""
        response = requests.get(
            f"{BASE_URL}/api/bookings-new/all",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "bookings" in data
    
    def test_get_revenue_stats(self, admin_token):
        """Test admin can fetch revenue stats"""
        response = requests.get(
            f"{BASE_URL}/api/bookings-new/stats/revenue",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "totalRevenue" in data
        assert "totalBookings" in data


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
