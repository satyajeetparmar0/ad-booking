import { useState } from 'react';
import { Button } from '@/components/ui/button';
import api from '@/utils/api';
import { toast } from 'sonner';
import { Loader2, CheckCircle, Calendar, MapPin, Newspaper, FileText, IndianRupee, CreditCard } from 'lucide-react';

const ReviewStep = ({ data, prevStep }) => {
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const originUrl = window.location.origin;

      const response = await api.post('/payment/create-checkout', {
        bookingData: {
          category: data.category,
          city: data.city,
          newspaperId: data.newspaperId,
          newspaperName: data.newspaperName,
          adType: data.adType,
          adContent: data.adContent,
          adImage: data.adImage || '',
          publishDate: data.publishDate,
          price: data.price
        },
        originUrl
      });

      if (response.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Payment initiation failed');
      setProcessing(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Review & Confirm</h2>
      <p className="text-gray-600 mb-6 sm:mb-8">Please review your ad details before payment</p>

      <div className="max-w-3xl">
        {/* Summary Card */}
        <div className="bg-white border-2 border-gray-200 shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Booking Summary</h3>
            <p className="text-orange-100">Please verify all details</p>
          </div>

          {/* Details */}
          <div className="p-6 space-y-6">
            {/* Category */}
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <div className="text-sm text-gray-500">Category</div>
                <div className="font-bold text-lg">{data.category}</div>
              </div>
            </div>

            {/* Location & Newspaper */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <div className="text-sm text-gray-500">City</div>
                  <div className="font-bold">{data.city}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Newspaper className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <div className="text-sm text-gray-500">Newspaper</div>
                  <div className="font-bold">{data.newspaperName}</div>
                </div>
              </div>
            </div>

            {/* Ad Type & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <div className="text-sm text-gray-500">Ad Type</div>
                  <div className="font-bold">{data.adType}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <div className="text-sm text-gray-500">Publish Date</div>
                  <div className="font-bold">{new Date(data.publishDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              </div>
            </div>

            {/* Ad Content */}
            <div className="border-t pt-6">
              <div className="text-sm text-gray-500 mb-2">Your Advertisement</div>
              <div className="bg-gray-50 border border-gray-200 p-4 text-sm whitespace-pre-wrap">
                {data.adContent}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Word Count: {data.adContent.trim().split(/\s+/).filter(w => w.length > 0).length} words
              </div>
            </div>

            {/* Price */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between bg-orange-50 border-2 border-orange-300 p-4">
                <span className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5" />
                  Total Amount
                </span>
                <span className="text-3xl font-black text-orange-600">{'\u20B9'}{data.price}</span>
              </div>
            </div>

            {/* Stripe Badge */}
            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
              <CreditCard className="w-4 h-4" />
              <span>Secured by Stripe</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <Button onClick={prevStep} variant="outline" size="lg" disabled={processing}>Back</Button>
          <Button
            onClick={handlePayment}
            size="lg"
            className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold"
            disabled={processing}
            data-testid="pay-now-button"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Redirecting to Stripe...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Pay {'\u20B9'}{data.price}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
