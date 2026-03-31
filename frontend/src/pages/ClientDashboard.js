import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '@/utils/api';
import { toast } from 'sonner';
import { Calendar, Package, Loader2, Newspaper, MapPin } from 'lucide-react';

const NewClientDashboard = () => {
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
      const response = await api.get('/bookings-new/my-bookings');
      setBookings(response.data.bookings);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2 tracking-tight">
            My Bookings
          </h1>
          <p className="text-orange-100">Welcome back, {user?.name}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-white border-2 border-gray-200 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Total Bookings
                </p>
                <p className="text-4xl font-black text-gray-900">
                  {bookings.length}
                </p>
              </div>
              <Package className="w-12 h-12 text-orange-500" />
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Active
                </p>
                <p className="text-4xl font-black text-gray-900">
                  {bookings.filter(b => b.bookingStatus === 'confirmed').length}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Total Spent
                </p>
                <p className="text-4xl font-black text-gray-900">
                  ₹{bookings.reduce((sum, b) => sum + b.price, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-orange-500 text-3xl font-black">₹</div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white border-2 border-gray-200 shadow-lg">
          <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-orange-50 to-yellow-50">
            <h2 className="text-2xl font-black text-gray-900">
              My Advertisement Bookings
            </h2>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center">
              <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-6">You haven't booked any ads yet</p>
              <button
                onClick={() => navigate('/book-now')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 font-bold transition-colors"
                data-testid="book-ad-cta"
              >
                Book Your First Ad
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="bookings-table">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-gray-700">
                      Booking ID
                    </th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-gray-700">
                      Category
                    </th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-gray-700">
                      Newspaper
                    </th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-gray-700">
                      City
                    </th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-gray-700">
                      Publish Date
                    </th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-gray-700">
                      Amount
                    </th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.bookingId} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="p-4 text-sm font-mono text-gray-900" data-testid={`booking-id-${booking.bookingId}`}>
                        {booking.bookingId.slice(0, 8)}...
                      </td>
                      <td className="p-4 text-sm font-semibold text-gray-900">
                        {booking.category}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Newspaper className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium text-gray-900">{booking.newspaperName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {booking.city}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(booking.publishDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-4 text-sm font-bold text-orange-600">
                        ₹{booking.price.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${getStatusColor(booking.bookingStatus)}`}>
                          {booking.bookingStatus}
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

export default NewClientDashboard;
