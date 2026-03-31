import { Button } from '@/components/ui/button';
import { FileText, Image as ImageIcon, Maximize } from 'lucide-react';
import { toast } from 'sonner';

const adTypes = [
  {
    id: 'Classified Text',
    name: 'Classified Text Ad',
    description: 'Simple text-based advertisement. Charged per word.',
    icon: FileText,
    color: 'bg-blue-50 hover:bg-blue-100 border-blue-300',
    iconColor: 'text-blue-600',
    priceType: 'Per Word'
  },
  {
    id: 'Classified Display',
    name: 'Classified Display Ad',
    description: 'Text with borders and basic formatting. More prominent.',
    icon: ImageIcon,
    color: 'bg-purple-50 hover:bg-purple-100 border-purple-300',
    iconColor: 'text-purple-600',
    priceType: 'Fixed + Per Word'
  },
  {
    id: 'Display Ad',
    name: 'Display Ad',
    description: 'Full graphic advertisement with images and custom design.',
    icon: Maximize,
    color: 'bg-green-50 hover:bg-green-100 border-green-300',
    iconColor: 'text-green-600',
    priceType: 'Fixed Rate'
  }
];

const AdTypeStep = ({ data, updateData, nextStep, prevStep }) => {
  const handleSelect = (adTypeId) => {
    updateData({ adType: adTypeId });
  };

  const handleNext = () => {
    if (!data.adType) {
      toast.error('Please select an ad type');
      return;
    }
    nextStep();
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Select Ad Type</h2>
      <p className="text-gray-600 mb-6 sm:mb-8">Choose how you want your advertisement to appear</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl">
        {adTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => handleSelect(type.id)}
              className={`${type.color} border-2 p-6 text-left hover:shadow-lg transition-all ${
                data.adType === type.id ? 'ring-4 ring-orange-400 shadow-lg' : ''
              }`}
              data-testid={`adtype-${type.id}`}
            >
              <Icon className={`w-12 h-12 ${type.iconColor} mb-4`} />
              <h3 className="font-bold text-lg text-gray-900 mb-2">{type.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{type.description}</p>
              <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full">
                {type.priceType}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 mt-8">
        <Button onClick={prevStep} variant="outline" size="lg">Back</Button>
        <Button onClick={handleNext} size="lg" className="bg-orange-500 hover:bg-orange-600" data-testid="next-button">Continue</Button>
      </div>
    </div>
  );
};

export default AdTypeStep;
