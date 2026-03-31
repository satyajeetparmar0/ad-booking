import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, IndianRupee } from 'lucide-react';

const DateStep = ({ data, updateData, nextStep, prevStep }) => {
  const [selectedDate, setSelectedDate] = useState(data.publishDate || '');
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  useEffect(() => {
    calculatePrice();
  }, [data.adContent, data.adType, data.basePrice, data.pricePerWord]);

  const calculatePrice = () => {
    const wordCount = data.adContent.trim().split(/\s+/).filter(w => w.length > 0).length;
    let price = 0;

    if (data.adType === 'Classified Text') {
      price = data.basePrice + (wordCount * data.pricePerWord);
    } else if (data.adType === 'Classified Display') {
      price = data.basePrice * 1.5 + (wordCount * data.pricePerWord * 0.8);
    } else if (data.adType === 'Display Ad') {
      price = data.basePrice * 3;
    }

    setCalculatedPrice(Math.round(price));
    updateData({ price: Math.round(price) });
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    updateData({ publishDate: e.target.value });
  };

  const handleNext = () => {
    if (!selectedDate) {
      toast.error('Please select a publish date');
      return;
    }

    const selected = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected < today) {
      toast.error('Publish date cannot be in the past');
      return;
    }

    nextStep();
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Select Publish Date</h2>
      <p className="text-gray-600 mb-6 sm:mb-8">Choose when you want your ad to be published</p>

      <div className="max-w-2xl space-y-6">
        {/* Date Picker */}
        <div>
          <Label className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Publish Date *
          </Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={minDate}
            className="text-base h-12 border-2"
            data-testid="publish-date-input"
          />
          <p className="text-sm text-gray-500 mt-2">Your ad will be published on the selected date</p>
        </div>

        {/* Price Summary */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-300 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <IndianRupee className="w-5 h-5" />
            Price Breakdown
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Newspaper:</span>
              <span className="font-semibold">{data.newspaperName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ad Type:</span>
              <span className="font-semibold">{data.adType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base Price:</span>
              <span className="font-semibold">₹{data.basePrice}</span>
            </div>
            {data.adType !== 'Display Ad' && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Word Count:</span>
                  <span className="font-semibold">{data.adContent.trim().split(/\s+/).filter(w => w.length > 0).length} words</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price per Word:</span>
                  <span className="font-semibold">₹{data.pricePerWord}</span>
                </div>
              </>
            )}
            <div className="border-t-2 border-orange-300 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                <span className="text-2xl font-black text-orange-600">₹{calculatedPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
          <p><strong>Note:</strong> Payment will be processed in the next step. Your ad will be reviewed and published on the selected date after payment confirmation.</p>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <Button onClick={prevStep} variant="outline" size="lg">Back</Button>
        <Button onClick={handleNext} size="lg" className="bg-orange-500 hover:bg-orange-600" data-testid="next-button">Continue to Payment</Button>
      </div>
    </div>
  );
};

export default DateStep;
