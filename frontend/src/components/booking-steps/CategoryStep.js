import { Button } from '@/components/ui/button';
import { Briefcase, Home, GraduationCap, Heart, FileText, Building2, Bell, User, Car, Search } from 'lucide-react';

const categories = [
  { id: 'Matrimonial', name: 'Matrimonial', icon: Heart, color: 'bg-pink-100 hover:bg-pink-200 border-pink-300', iconColor: 'text-pink-600' },
  { id: 'Recruitment', name: 'Recruitment', icon: Briefcase, color: 'bg-blue-100 hover:bg-blue-200 border-blue-300', iconColor: 'text-blue-600' },
  { id: 'Property', name: 'Property', icon: Home, color: 'bg-green-100 hover:bg-green-200 border-green-300', iconColor: 'text-green-600' },
  { id: 'Education', name: 'Education', icon: GraduationCap, color: 'bg-purple-100 hover:bg-purple-200 border-purple-300', iconColor: 'text-purple-600' },
  { id: 'Business', name: 'Business', icon: Building2, color: 'bg-orange-100 hover:bg-orange-200 border-orange-300', iconColor: 'text-orange-600' },
  { id: 'Public Notice', name: 'Public Notice', icon: Bell, color: 'bg-red-100 hover:bg-red-200 border-red-300', iconColor: 'text-red-600' },
  { id: 'Obituary', name: 'Obituary', icon: FileText, color: 'bg-gray-100 hover:bg-gray-200 border-gray-300', iconColor: 'text-gray-600' },
  { id: 'Name Change', name: 'Name Change', icon: User, color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300', iconColor: 'text-yellow-700' },
  { id: 'Lost Found', name: 'Lost & Found', icon: Search, color: 'bg-cyan-100 hover:bg-cyan-200 border-cyan-300', iconColor: 'text-cyan-600' },
  { id: 'Vehicle', name: 'Vehicle', icon: Car, color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300', iconColor: 'text-indigo-600' }
];

const CategoryStep = ({ data, updateData, nextStep }) => {
  const handleSelect = (categoryId) => {
    updateData({ category: categoryId });
    setTimeout(nextStep, 300);
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Select Ad Category</h2>
      <p className="text-gray-600 mb-6 sm:mb-8">Choose the category that best fits your advertisement</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => handleSelect(category.id)}
              className={`${category.color} border-2 p-4 sm:p-6 flex flex-col items-center justify-center gap-3 transition-all hover:shadow-lg ${
                data.category === category.id ? 'ring-4 ring-orange-400 shadow-lg' : ''
              }`}
              data-testid={`category-${category.id}`}
            >
              <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${category.iconColor}`} />
              <span className="text-sm sm:text-base font-semibold text-gray-800 text-center">{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryStep;
