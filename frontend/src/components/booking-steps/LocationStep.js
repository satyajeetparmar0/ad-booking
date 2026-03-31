import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import api from '@/utils/api';
import { toast } from 'sonner';
import { Loader2, MapPin, Newspaper } from 'lucide-react';

const LocationStep = ({ data, updateData, nextStep, prevStep }) => {
  const [cities, setCities] = useState([]);
  const [newspapers, setNewspapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(data.city || '');

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchNewspapers(selectedCity);
    }
  }, [selectedCity]);

  const fetchCities = async () => {
    try {
      const response = await api.get('/newspapers/cities');
      setCities(response.data.cities);
    } catch (error) {
      toast.error('Failed to load cities');
    } finally {
      setLoading(false);
    }
  };

  const fetchNewspapers = async (city) => {
    try {
      const response = await api.get(`/newspapers/by-city/${city}`);
      setNewspapers(response.data.newspapers);
    } catch (error) {
      toast.error('Failed to load newspapers');
    }
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    updateData({ city, newspaperId: '', newspaperName: '' });
  };

  const handleNewspaperSelect = (newspaperId) => {
    const newspaper = newspapers.find(n => n.newspaperId === newspaperId);
    if (newspaper) {
      updateData({
        newspaperId: newspaper.newspaperId,
        newspaperName: newspaper.name,
        basePrice: newspaper.basePrice,
        pricePerWord: newspaper.pricePerWord
      });
    }
  };

  const handleNext = () => {
    if (!data.city) {
      toast.error('Please select a city');
      return;
    }
    if (!data.newspaperId) {
      toast.error('Please select a newspaper');
      return;
    }
    nextStep();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Select Location & Newspaper</h2>
      <p className="text-gray-600 mb-6 sm:mb-8">Choose your city and preferred newspaper</p>

      <div className="space-y-6 max-w-2xl">
        <div>
          <Label className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Select City
          </Label>
          <Select value={selectedCity} onValueChange={handleCityChange}>
            <SelectTrigger className="h-12 text-base" data-testid="city-select">
              <SelectValue placeholder="Choose your city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCity && newspapers.length > 0 && (
          <div>
            <Label className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              Select Newspaper
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {newspapers.map(newspaper => (
                <button
                  key={newspaper.newspaperId}
                  onClick={() => handleNewspaperSelect(newspaper.newspaperId)}
                  className={`border-2 p-4 text-left hover:shadow-lg transition-all ${
                    data.newspaperId === newspaper.newspaperId
                      ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-300'
                      : 'border-gray-300 hover:border-orange-300'
                  }`}
                  data-testid={`newspaper-${newspaper.newspaperId}`}
                >
                  <h3 className="font-bold text-lg text-gray-900">{newspaper.name}</h3>
                  <p className="text-sm text-gray-600">{newspaper.language}</p>
                  <p className="text-xs text-gray-500 mt-2">Base: ₹{newspaper.basePrice} | ₹{newspaper.pricePerWord}/word</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-8">
        <Button onClick={prevStep} variant="outline" size="lg">Back</Button>
        <Button onClick={handleNext} size="lg" className="bg-orange-500 hover:bg-orange-600" data-testid="next-button">Continue</Button>
      </div>
    </div>
  );
};

export default LocationStep;
