import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar } from 'lucide-react';

const AdCard = ({ ad }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white border border-[#E5E5E5] p-6 hover:-translate-y-1 transition-transform duration-200 cursor-pointer group"
      onClick={() => navigate(`/ads/${ad.adId}`)}
      data-testid={`ad-card-${ad.adId}`}
    >
      {ad.imageUrl && (
        <div className="w-full h-48 mb-4 overflow-hidden">
          <img 
            src={ad.imageUrl} 
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#050505] border border-[#E5E5E5] px-2 py-1">
          {ad.category}
        </span>
        {ad.duration && (
          <span className="text-xs text-[#525252] flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {ad.duration}
          </span>
        )}
      </div>
      
      <h3 className="text-xl font-heading font-bold text-[#050505] mb-2 group-hover:text-[#06B6D4] transition-colors duration-200">
        {ad.title}
      </h3>
      
      <p className="text-sm text-[#525252] mb-4 line-clamp-2">
        {ad.description}
      </p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 text-[#525252] text-xs">
          <MapPin className="w-4 h-4" />
          {ad.location}
        </div>
        <div className="text-2xl font-heading font-black text-[#06B6D4]">
          ₹{ad.price.toLocaleString()}
        </div>
      </div>
      
      <Button 
        className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/ads/${ad.adId}`);
        }}
        data-testid={`book-now-button-${ad.adId}`}
      >
        Book Now
      </Button>
    </div>
  );
};

export default AdCard;
