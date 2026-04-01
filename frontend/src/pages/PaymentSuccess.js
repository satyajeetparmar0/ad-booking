import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/utils/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking'); // checking, success, failed
  const [bookingId, setBookingId] = useState(null);
  const polledRef = useRef(false);

  useEffect(() => {
    if (!sessionId || polledRef.current) return;
    polledRef.current = true;

    let attempts = 0;
    const maxAttempts = 8;
    const pollInterval = 2500;

    const poll = async () => {
      try {
        const res = await api.get(`/payment/checkout-status/${sessionId}`);
        const data = res.data;

        if (data.paymentStatus === 'paid') {
          setStatus('success');
          if (data.bookingId) setBookingId(data.bookingId);
          return;
        }

        if (data.status === 'expired') {
          setStatus('failed');
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, pollInterval);
        } else {
          setStatus('failed');
        }
      } catch {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, pollInterval);
        } else {
          setStatus('failed');
        }
      }
    };

    poll();
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Session</h2>
          <p className="text-gray-600 mb-6">No payment session found.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white border-2 border-gray-200 shadow-2xl p-8 text-center" data-testid="payment-result">
          {status === 'checking' && (
            <>
              <Loader2 className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment...</h2>
              <p className="text-gray-600">Please wait while we confirm your payment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-2">Your ad booking has been confirmed.</p>
              {bookingId && (
                <p className="text-sm text-gray-500 mb-6">
                  Booking ID: <span className="font-mono font-bold">{bookingId.substring(0, 8).toUpperCase()}</span>
                </p>
              )}
              <p className="text-sm text-green-600 mb-6">A confirmation email has been sent to your registered email address.</p>
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold"
                  data-testid="go-to-dashboard-btn"
                >
                  View My Bookings
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Home
                </Button>
              </div>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
              <p className="text-gray-600 mb-6">Something went wrong. Please try again.</p>
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate('/book-now')}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold"
                >
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Home
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
