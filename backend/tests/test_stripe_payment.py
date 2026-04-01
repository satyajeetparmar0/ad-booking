"""
Stripe Payment Integration Tests for AdAdda
Tests the new Stripe payment flow that replaced Razorpay
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
CLIENT_EMAIL = "client@adadda.com"
CLIENT_PASSWORD = "client123"


class TestStripePaymentFlow:
    """Tests for Stripe payment integration"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token for client user"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": CLIENT_EMAIL, "password": CLIENT_PASSWORD}
        )
        assert response.status_code == 200, f"Login failed: {response.text}"
        return response.json().get("token")
    
    @pytest.fixture
    def auth_headers(self, auth_token):
        """Headers with auth token"""
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {auth_token}"
        }
    
    @pytest.fixture
    def sample_booking_data(self):
        """Sample booking data for payment tests"""
        return {
            "category": "Matrimonial",
            "city": "Delhi",
            "newspaperId": "test-newspaper-123",
            "newspaperName": "Times of India",
            "adType": "Classified Text",
            "adContent": "Looking for a suitable match for my son. Contact: 9876543210",
            "publishDate": "2026-02-20",
            "price": 750
        }
    
    def test_api_health(self):
        """Test API is running"""
        response = requests.get(f"{BASE_URL}/api")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"API Health: {data['message']}")
    
    def test_create_checkout_success(self, auth_headers, sample_booking_data):
        """Test creating a Stripe checkout session"""
        response = requests.post(
            f"{BASE_URL}/api/payment/create-checkout",
            headers=auth_headers,
            json={
                "bookingData": sample_booking_data,
                "originUrl": BASE_URL
            }
        )
        
        assert response.status_code == 200, f"Create checkout failed: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "url" in data, "Response should contain checkout URL"
        assert "sessionId" in data, "Response should contain session ID"
        
        # Verify URL is a valid Stripe checkout URL
        assert data["url"].startswith("https://checkout.stripe.com"), "URL should be Stripe checkout URL"
        
        # Verify session ID format (Stripe session IDs start with cs_)
        assert data["sessionId"].startswith("cs_"), "Session ID should start with cs_"
        
        print(f"Checkout session created: {data['sessionId'][:30]}...")
        return data["sessionId"]
    
    def test_create_checkout_without_auth(self, sample_booking_data):
        """Test that create-checkout requires authentication"""
        response = requests.post(
            f"{BASE_URL}/api/payment/create-checkout",
            headers={"Content-Type": "application/json"},
            json={
                "bookingData": sample_booking_data,
                "originUrl": BASE_URL
            }
        )
        
        # Should return 401 Unauthorized
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("Correctly rejected unauthenticated request")
    
    def test_create_checkout_missing_price(self, auth_headers):
        """Test create-checkout with missing price"""
        response = requests.post(
            f"{BASE_URL}/api/payment/create-checkout",
            headers=auth_headers,
            json={
                "bookingData": {
                    "category": "Matrimonial",
                    "city": "Delhi",
                    "newspaperName": "Times of India"
                    # Missing price
                },
                "originUrl": BASE_URL
            }
        )
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        data = response.json()
        assert "error" in data
        print(f"Correctly rejected missing price: {data['error']}")
    
    def test_create_checkout_invalid_price(self, auth_headers):
        """Test create-checkout with invalid price"""
        response = requests.post(
            f"{BASE_URL}/api/payment/create-checkout",
            headers=auth_headers,
            json={
                "bookingData": {
                    "category": "Matrimonial",
                    "city": "Delhi",
                    "newspaperName": "Times of India",
                    "price": -100  # Invalid negative price
                },
                "originUrl": BASE_URL
            }
        )
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        data = response.json()
        assert "error" in data
        print(f"Correctly rejected invalid price: {data['error']}")
    
    def test_checkout_status_valid_session(self, auth_headers, sample_booking_data):
        """Test checking status of a valid checkout session"""
        # First create a checkout session
        create_response = requests.post(
            f"{BASE_URL}/api/payment/create-checkout",
            headers=auth_headers,
            json={
                "bookingData": sample_booking_data,
                "originUrl": BASE_URL
            }
        )
        assert create_response.status_code == 200
        session_id = create_response.json()["sessionId"]
        
        # Now check its status
        status_response = requests.get(
            f"{BASE_URL}/api/payment/checkout-status/{session_id}",
            headers=auth_headers
        )
        
        assert status_response.status_code == 200, f"Status check failed: {status_response.text}"
        data = status_response.json()
        
        # Verify response structure
        assert "status" in data, "Response should contain status"
        assert "paymentStatus" in data, "Response should contain paymentStatus"
        
        # New session should be open and unpaid
        assert data["status"] == "open", f"Expected 'open', got {data['status']}"
        assert data["paymentStatus"] == "unpaid", f"Expected 'unpaid', got {data['paymentStatus']}"
        
        print(f"Session status: {data['status']}, Payment: {data['paymentStatus']}")
    
    def test_checkout_status_invalid_session(self, auth_headers):
        """Test checking status of an invalid session ID"""
        response = requests.get(
            f"{BASE_URL}/api/payment/checkout-status/cs_invalid_session_id_12345",
            headers=auth_headers
        )
        
        # Should return 500 (Stripe API error for invalid session)
        assert response.status_code == 500, f"Expected 500, got {response.status_code}"
        print("Correctly handled invalid session ID")
    
    def test_checkout_status_without_auth(self):
        """Test that checkout-status requires authentication"""
        response = requests.get(
            f"{BASE_URL}/api/payment/checkout-status/cs_test_123",
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("Correctly rejected unauthenticated status check")


class TestBookingFlowPrerequisites:
    """Tests for booking flow prerequisites (newspapers, categories)"""
    
    def test_get_newspapers(self):
        """Test fetching newspapers list"""
        response = requests.get(f"{BASE_URL}/api/newspapers")
        assert response.status_code == 200, f"Failed to get newspapers: {response.text}"
        data = response.json()
        # API returns {newspapers: [...]}
        assert "newspapers" in data, "Response should contain newspapers key"
        assert isinstance(data["newspapers"], list), "Newspapers should be a list"
        print(f"Found {len(data['newspapers'])} newspapers")
    
    def test_get_ads_categories(self):
        """Test fetching ad categories"""
        response = requests.get(f"{BASE_URL}/api/ads")
        assert response.status_code == 200, f"Failed to get ads: {response.text}"
        print("Ads endpoint accessible")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
