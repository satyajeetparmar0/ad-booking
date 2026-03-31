import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '@/utils/api';
import { toast } from 'sonner';
import { Calendar, Package, Loader2 } from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data.bookings);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-[#14B8A6] text-[#050505]';
      case 'completed': return 'bg-[#06B6D4] text-white';
      case 'cancelled': return 'bg-[#FF2A2A] text-white';
      default: return 'bg-[#E5E5E5] text-[#525252]';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#06B6D4]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b border-[#E5E5E5] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl lg:text-5xl font-heading font-black text-[#050505] mb-2 tracking-tight">
            My Dashboard
          </h1>
          <p className="text-[#525252]">Welcome back, {user?.name}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-[#E5E5E5] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#525252] mb-2">
                  Total Bookings
                </p>
                <p className="text-4xl font-heading font-black text-[#050505]">
                  {bookings.length}
                </p>
              </div>
              <Package className="w-12 h-12 text-[#06B6D4]" />
            </div>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#525252] mb-2">
                  Active
                </p>
                <p className="text-4xl font-heading font-black text-[#050505]">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-[#14B8A6]" />
            </div>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#525252] mb-2">
                  Total Spent
                </p>
                <p className="text-4xl font-heading font-black text-[#050505]">
                  ₹{bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-[#06B6D4] text-3xl">₹</div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white border border-[#E5E5E5]">
          <div className="p-6 border-b border-[#E5E5E5]">
            <h2 className="text-2xl font-heading font-bold text-[#050505] tracking-tight">
              My Bookings
            </h2>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[#525252] mb-6">You haven't made any bookings yet</p>
              <button
                onClick={() => navigate('/ads')}
                className="bg-[#06B6D4] hover:bg-[#0891B2] text-white px-6 py-3 font-medium"
                data-testid="browse-ads-cta"
              >
                Browse Ads
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="bookings-table">
                <thead className="bg-[#F5F5F5]">
                  <tr>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-[0.2em] text-[#050505]">
                      Booking ID
                    </th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-[0.2em] text-[#050505]">
                      Ad Service
                    </th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-[0.2em] text-[#050505]">
                      Start Date
                    </th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-[0.2em] text-[#050505]">
                      Amount
                    </th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-[0.2em] text-[#050505]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.bookingId} className="border-t border-[#E5E5E5] hover:bg-[#FAFAFA]">
                      <td className="p-4 text-sm font-medium text-[#050505]" data-testid={`booking-id-${booking.bookingId}`}>
                        {booking.bookingId.slice(0, 8)}...
                      </td>
                      <td className="p-4 text-sm text-[#050505] font-medium">
                        {booking.adTitle}
                      </td>
                      <td className="p-4 text-sm text-[#525252]">
                        {new Date(booking.startDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm font-bold text-[#06B6D4]">
                        ₹{booking.totalPrice.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
