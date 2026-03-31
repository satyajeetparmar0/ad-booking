import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import api from '@/utils/api';
import { toast } from 'sonner';
import { MapPin, Calendar, CheckCircle2, Loader2 } from 'lucide-react';

const AdDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    adContent: ''
  });

  useEffect(() => {
    fetchAd();
  }, [id]);

  const fetchAd = async () => {
    try {
      const response = await api.get(`/ads/${id}`);
      setAd(response.data.ad);
    } catch (error) {
      toast.error('Failed to load ad details');
      navigate('/ads');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }

    setBooking(true);
    try {
      // Create Razorpay order
      const orderResponse = await api.post('/payment/create-order', {
        amount: ad.price,
        currency: 'INR'
      });

      const { orderId, amount, keyId } = orderResponse.data;

      // Initialize Razorpay
      const options = {
        key: keyId,
        amount: amount,
        currency: 'INR',
        name: 'AdAdda',
        description: ad.title,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await api.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.data.success) {
              // Create booking
              const bookingResponse = await api.post('/bookings', {
                adId: ad.adId,
                startDate: bookingData.startDate,
                adContent: bookingData.adContent,
                paymentId: response.razorpay_payment_id
              });

              // Send confirmation email
              try {
                await api.post('/email/send-confirmation', {
                  email: user.email,
                  name: user.name,
                  bookingId: bookingResponse.data.booking.bookingId,
                  adTitle: ad.title,
                  startDate: bookingData.startDate,
                  totalPrice: ad.price
                });
                toast.success('Payment successful! Booking confirmed. Check your email for details.');
              } catch (emailError) {
                console.error('Email send failed:', emailError);
                toast.success('Payment successful! Booking confirmed.');
              }

              navigate('/dashboard');
            }
          } catch (error) {
            toast.error('Payment verification failed');
            setBooking(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: {
          color: '#06B6D4'
        },
        modal: {
          ondismiss: function() {
            setBooking(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Payment initiation failed');
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#06B6D4]" />
      </div>
    );
  }

  if (!ad) return null;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
          {/* Left: Ad Details */}
          <div>
            {ad.imageUrl && (
              <div className="w-full h-64 sm:h-96 mb-4 sm:mb-6 overflow-hidden border border-[#E5E5E5]">
                <img 
                  src={ad.imageUrl} 
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#050505] border border-[#E5E5E5] px-3 py-1">
                {ad.category}
              </span>
              {ad.duration && (
                <span className="text-xs sm:text-sm text-[#525252] flex items-center gap-1">
                  <Calendar className="w-3 sm:w-4 h-3 sm:h-4" />
                  {ad.duration}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-[#050505] mb-4 tracking-tight">
              {ad.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 pb-6 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-2 text-[#525252]">
                <MapPin className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="font-medium text-sm sm:text-base">{ad.location}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-heading font-black text-[#06B6D4]">
                ₹{ad.price.toLocaleString()}
              </div>
            </div>

            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#050505] mb-3 sm:mb-4 tracking-tight">
                Description
              </h2>
              <p className="text-sm sm:text-base text-[#525252] leading-relaxed">
                {ad.description}
              </p>
            </div>

            {ad.features && ad.features.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#050505] mb-3 sm:mb-4 tracking-tight">
                  Features
                </h2>
                <ul className="space-y-2">
                  {ad.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm sm:text-base text-[#525252]">
                      <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-[#06B6D4] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: Booking Form */}
          <div>
            <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 lg:sticky lg:top-24">
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#050505] mb-4 sm:mb-6 tracking-tight">
                Book Online Ad
              </h2>

              {!user ? (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-sm sm:text-base text-[#525252] mb-4">Please login to book this online advertising slot</p>
                  <Button 
                    onClick={() => navigate('/login')}
                    className="bg-[#06B6D4] hover:bg-[#0891B2] text-white w-full sm:w-auto"
                    data-testid="login-to-book-button"
                  >
                    Login to Book
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-4 sm:space-y-6" data-testid="booking-form">
                  <div>
                    <Label htmlFor="startDate" className="text-xs font-bold uppercase tracking-[0.2em] text-[#050505] mb-2 block">
                      Campaign Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={bookingData.startDate}
                      onChange={(e) => setBookingData(prev => ({ ...prev, startDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="border-[#E5E5E5]"
                      data-testid="booking-date-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="adContent" className="text-xs font-bold uppercase tracking-[0.2em] text-[#050505] mb-2 block">
                      Your Ad Content / Message
                    </Label>
                    <Textarea
                      id="adContent"
                      value={bookingData.adContent}
                      onChange={(e) => setBookingData(prev => ({ ...prev, adContent: e.target.value }))}
                      placeholder="Enter the content for your online advertisement..."
                      required
                      rows={6}
                      className="border-[#E5E5E5] text-sm sm:text-base"
                      data-testid="ad-content-input"
                    />
                    <p className="text-xs text-[#525252] mt-2">This ad will be placed online on the selected platform</p>
                  </div>

                  <div className="border-t border-[#E5E5E5] pt-4 sm:pt-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <span className="text-sm sm:text-base text-[#525252] font-medium">Total Amount</span>
                      <span className="text-2xl sm:text-3xl font-heading font-black text-[#06B6D4]">
                        ₹{ad.price.toLocaleString()}
                      </span>
                    </div>

                    <Button 
                      type="submit"
                      disabled={booking}
                      className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white h-12 text-sm sm:text-base"
                      data-testid="confirm-booking-button"
                    >
                      {booking ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        'Proceed to Payment'
                      )}
                    </Button>

                    <p className="text-xs text-[#525252] text-center mt-4">
                      Secure payment powered by Razorpay
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetails;
