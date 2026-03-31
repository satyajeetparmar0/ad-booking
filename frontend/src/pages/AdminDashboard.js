import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import api from '@/utils/api';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Loader2, Package, Calendar, Users } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ads');
  const [ads, setAds] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Newspaper',
    price: '',
    location: '',
    imageUrl: '',
    duration: '',
    features: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      toast.error('Admin access required');
      return;
    }
    fetchData();
  }, [user, navigate, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'ads') {
        const response = await api.get('/ads');
        setAds(response.data.ads);
      } else {
        const response = await api.get('/bookings/all');
        setBookings(response.data.bookings);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAd = () => {
    setEditingAd(null);
    setFormData({
      title: '',
      description: '',
      category: 'Newspaper',
      price: '',
      location: '',
      imageUrl: '',
      duration: '',
      features: ''
    });
    setDialogOpen(true);
  };

  const handleEditAd = (ad) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description,
      category: ad.category,
      price: ad.price,
      location: ad.location,
      imageUrl: ad.imageUrl || '',
      duration: ad.duration || '',
      features: ad.features?.join(', ') || ''
    });
    setDialogOpen(true);
  };

  const handleSubmitAd = async (e) => {
    e.preventDefault();
    
    const adData = {
      ...formData,
      price: Number(formData.price),
      features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(Boolean) : []
    };

    try {
      if (editingAd) {
        await api.put(`/ads/${editingAd.adId}`, adData);
        toast.success('Ad updated successfully');
      } else {
        await api.post('/ads', adData);
        toast.success('Ad created successfully');
      }
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save ad');
    }
  };

  const handleDeleteAd = async (adId) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;

    try {
      await api.delete(`/ads/${adId}`);
      toast.success('Ad deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete ad');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status });
      toast.success('Booking status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
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
            Admin Dashboard
          </h1>
          <p className="text-[#525252]">Manage ads and bookings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-[#E5E5E5] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#525252] mb-2">
                  Total Ads
                </p>
                <p className="text-4xl font-heading font-black text-[#050505]">
                  {ads.length}
                </p>
              </div>
              <Package className="w-12 h-12 text-[#06B6D4]" />
            </div>
          </div>

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
              <Calendar className="w-12 h-12 text-[#14B8A6]" />
            </div>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#525252] mb-2">
                  Revenue
                </p>
                <p className="text-4xl font-heading font-black text-[#050505]">
                  ₹{bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}
                </p>
              </div>
              <Users className="w-12 h-12 text-[#06B6D4]" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-[#E5E5E5] mb-6">
          <div className="flex border-b border-[#E5E5E5]">
            <button
              onClick={() => setActiveTab('ads')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'ads'
                  ? 'text-[#06B6D4] border-b-2 border-[#06B6D4]'
                  : 'text-[#525252] hover:text-[#050505]'
              }`}
              data-testid="ads-tab"
            >
              Manage Ads
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'bookings'
                  ? 'text-[#06B6D4] border-b-2 border-[#06B6D4]'
                  : 'text-[#525252] hover:text-[#050505]'
              }`}
              data-testid="bookings-tab"
            >
              All Bookings
            </button>
          </div>
        </div>

        {/* Ads Management */}
        {activeTab === 'ads' && (
          <div className="bg-white border border-[#E5E5E5]">
            <div className="p-6 border-b border-[#E5E5E5] flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold text-[#050505] tracking-tight">
                All Ads
              </h2>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={handleCreateAd}
                    className="bg-[#06B6D4] hover:bg-[#0891B2] text-white"
                    data-testid="create-ad-button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Ad
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-heading font-bold">
                      {editingAd ? 'Edit Ad' : 'Create New Ad'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitAd} className="space-y-4" data-testid="ad-form">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        data-testid="ad-title-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        rows={4}
                        data-testid="ad-description-input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger data-testid="ad-category-select">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Newspaper">Newspaper</SelectItem>
                            <SelectItem value="Radio">Radio</SelectItem>
                            <SelectItem value="TV">TV</SelectItem>
                            <SelectItem value="Digital">Digital</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          required
                          data-testid="ad-price-input"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          required
                          data-testid="ad-location-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          placeholder="e.g., 30 Seconds"
                          data-testid="ad-duration-input"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://..."
                        data-testid="ad-image-url-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="features">Features (comma separated)</Label>
                      <Input
                        id="features"
                        value={formData.features}
                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                        placeholder="Feature 1, Feature 2, Feature 3"
                        data-testid="ad-features-input"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1 bg-[#06B6D4] hover:bg-[#0891B2]" data-testid="save-ad-button">
                        {editingAd ? 'Update Ad' : 'Create Ad'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full" data-testid="ads-table">
                <thead className="bg-[#F5F5F5]">
                  <tr>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-[0.2em] text-[#050505]">Title</th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-[0.2em] text-[#050505]">Category</th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-[0.2em] text-[#050505]">Location</th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-[0.2em] text-[#050505]">Price</th>
                    <th className="text-right p-4 text-xs font-bold uppercase tracking-[0.2em] text-[#050505]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ads.map((ad) => (
                    <tr key={ad.adId} className="border-t border-[#E5E5E5] hover:bg-[#FAFAFA]">
                      <td className="p-4 text-sm font-medium text-[#050505]">{ad.title}</td>
                      <td className="p-4 text-sm text-[#525252]">{ad.category}</td>
                      <td className="p-4 text-sm text-[#525252]">{ad.location}</td>
                      <td className="p-4 text-sm font-bold text-[#06B6D4]">₹{ad.price.toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAd(ad)}
                            data-testid={`edit-ad-${ad.adId}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAd(ad.adId)}
                            className="text-[#FF2A2A] hover:bg-[#FF2A2A] hover:text-white"
                            data-testid={`delete-ad-${ad.adId}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Management */}
        {activeTab === 'bookings' && (
          <div className="bg-white border border-[#E5E5E5]">
            <div className="p-6 border-b border-[#E5E5E5]">
              <h2 className="text-2xl font-heading font-bold text-[#050505] tracking-tight">
                All Bookings
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full" data-testid="admin-bookings-table">
                <thead className="bg-[#F5F5F5]">
                  <tr>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-[0.2em] text-[#050505]">Booking ID</th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-[0.2em] text-[#050505]">Client</th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-[0.2em] text-[#050505]">Ad Service</th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-[0.2em] text-[#050505]">Date</th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-[0.2em] text-[#050505]">Amount</th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-[0.2em] text-[#050505]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.bookingId} className="border-t border-[#E5E5E5] hover:bg-[#FAFAFA]">
                      <td className="p-4 text-sm font-medium text-[#050505]">{booking.bookingId.slice(0, 8)}...</td>
                      <td className="p-4 text-sm text-[#525252]">{booking.userName}</td>
                      <td className="p-4 text-sm text-[#525252]">{booking.adTitle}</td>
                      <td className="p-4 text-sm text-[#525252]">{new Date(booking.startDate).toLocaleDateString()}</td>
                      <td className="p-4 text-sm font-bold text-[#06B6D4]">₹{booking.totalPrice.toLocaleString()}</td>
                      <td className="p-4">
                        <Select 
                          value={booking.status} 
                          onValueChange={(value) => handleUpdateBookingStatus(booking.bookingId, value)}
                        >
                          <SelectTrigger className={`w-32 ${getStatusColor(booking.status)}`} data-testid={`status-select-${booking.bookingId}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
