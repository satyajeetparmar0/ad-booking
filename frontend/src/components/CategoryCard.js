import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ title, image, count }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="relative h-64 border border-[#E5E5E5] overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/ads?category=${title}`)}
      data-testid={`category-card-${title.toLowerCase()}`}
    >
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-200"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h3 className="text-3xl font-heading font-black text-white mb-2 tracking-tight">
          {title}
        </h3>
        {count !== undefined && (
          <p className="text-sm text-white/80 font-medium">
            {count} Ads Available
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
