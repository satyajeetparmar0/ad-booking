import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdCard from '@/components/AdCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/utils/api';
import { toast } from 'sonner';
import { Search, SlidersHorizontal } from 'lucide-react';

const AdListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    location: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchAds();
  }, [searchParams]);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.location) params.location = filters.location;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const response = await api.get('/ads', { params });
      setAds(response.data.ads);
    } catch (error) {
      toast.error('Failed to load ads');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.location) params.location = filters.location;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    setSearchParams(params);
    fetchAds();
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b border-[#E5E5E5] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl lg:text-5xl font-heading font-black text-[#050505] mb-4 tracking-tight">
            Browse Advertising Services
          </h1>
          <p className="text-[#525252]">
            {ads.length} ads available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#E5E5E5] p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-[#050505]" />
                <h3 className="text-lg font-heading font-bold text-[#050505]">
                  Filters
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#050505] mb-2 block">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252]" />
                    <Input
                      type="text"
                      placeholder="Search ads..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10 border-[#E5E5E5]"
                      data-testid="ad-search-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#050505] mb-2 block">
                    Category
                  </label>
                  <Select value={filters.category || "all"} onValueChange={(value) => handleFilterChange('category', value === "all" ? '' : value)}>
                    <SelectTrigger className="border-[#E5E5E5]" data-testid="category-filter">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Newspaper">Newspaper</SelectItem>
                      <SelectItem value="Radio">Radio</SelectItem>
                      <SelectItem value="TV">TV</SelectItem>
                      <SelectItem value="Digital">Digital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#050505] mb-2 block">
                    Location
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter location"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="border-[#E5E5E5]"
                    data-testid="location-filter-input"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#050505] mb-2 block">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="border-[#E5E5E5]"
                      data-testid="min-price-filter"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="border-[#E5E5E5]"
                      data-testid="max-price-filter"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  className="w-full bg-[#002FA7] hover:bg-[#002175] text-white py-2 px-4 font-medium transition-colors duration-200"
                  data-testid="apply-filters-button"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Ads Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white border border-[#E5E5E5] p-6 h-96 animate-pulse"></div>
                ))}
              </div>
            ) : ads.length === 0 ? (
              <div className="bg-white border border-[#E5E5E5] p-12 text-center">
                <p className="text-[#525252] text-lg">No ads found matching your criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {ads.map((ad) => (
                  <AdCard key={ad.adId} ad={ad} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdListing;
