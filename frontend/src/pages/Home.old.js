import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CategoryCard from '@/components/CategoryCard';
import AdCard from '@/components/AdCard';
import api from '@/utils/api';
import { Search, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredAds, setFeaturedAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = [
    {
      title: 'Newspaper',
      image: 'https://images.unsplash.com/photo-1736248991839-67d11f7a5643?w=800',
    },
    {
      title: 'Digital',
      image: 'https://images.unsplash.com/photo-1763671727638-5bc55bb9c980?w=800',
    },
    {
      title: 'Radio',
      image: 'https://images.pexels.com/photos/5061702/pexels-photo-5061702.jpeg?w=800',
    },
    {
      title: 'TV',
      image: 'https://images.pexels.com/photos/7865064/pexels-photo-7865064.jpeg?w=800',
    },
  ];

  useEffect(() => {
    fetchFeaturedAds();
  }, []);

  const fetchFeaturedAds = async () => {
    try {
      const response = await api.get('/ads');
      setFeaturedAds(response.data.ads.slice(0, 3));
    } catch (error) {
      toast.error('Failed to load featured ads');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/ads?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-[60vh] sm:h-[70vh] flex items-center justify-center px-4"
        style={{
          backgroundImage: 'url(https://static.prod-images.emergentagent.com/jobs/04cdd440-5812-4210-a002-ebc215133211/images/8bd94e5a947c293a9c4c2d02d928d7b3aee696039aa48bbf16975dee9ed08e22.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-heading font-black text-white mb-4 sm:mb-6 tracking-tighter leading-tight">
            Your Gateway to <br className="hidden sm:block" />Strategic Advertising
          </h1>
          <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 font-medium max-w-2xl mx-auto px-4">
            Book premium advertising slots across Newspapers, TV, Radio, and Digital platforms.
            Reach millions with AdAdda.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto" data-testid="home-search-form">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-[#525252]" />
                <Input
                  type="text"
                  placeholder="Search for advertising services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 h-12 sm:h-14 bg-white border-white text-[#050505] text-sm sm:text-base"
                  data-testid="home-search-input"
                />
              </div>
              <Button 
                type="submit" 
                className="h-12 sm:h-14 px-6 sm:px-8 bg-[#06B6D4] hover:bg-[#0891B2] text-white"
                data-testid="home-search-button"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-[#050505] mb-2 tracking-tight">
              Browse by Category
            </h2>
            <p className="text-sm sm:text-base text-[#525252]">Choose your advertising medium</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </section>

      {/* Featured Ads Section */}
      <section className="bg-[#F5F5F5] py-12 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-[#050505] mb-2 tracking-tight">
                Featured Opportunities
              </h2>
              <p className="text-sm sm:text-base text-[#525252]">Trending advertising slots</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/ads')}
              className="border-[#E5E5E5] hover:bg-[#06B6D4] hover:text-white hover:border-[#06B6D4] mt-4 sm:mt-0"
              data-testid="view-all-ads-button"
            >
              View All
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-[#E5E5E5] p-6 h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {featuredAds.map((ad) => (
                <AdCard key={ad.adId} ad={ad} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24">
        <div className="bg-[#06B6D4] p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-4xl font-heading font-black text-white mb-4 tracking-tight">
            Ready to Amplify Your Brand?
          </h2>
          <p className="text-sm sm:text-base text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join thousands of businesses that trust AdAdda for their advertising needs.
            Book your slot today and watch your reach expand.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/ads')}
            className="bg-white text-[#06B6D4] hover:bg-[#F5F5F5] font-bold"
            data-testid="cta-browse-button"
          >
            Browse All Ads
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
