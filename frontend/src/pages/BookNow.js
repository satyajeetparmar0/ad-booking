import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

// Step components
import CategoryStep from '@/components/booking-steps/CategoryStep';
import LocationStep from '@/components/booking-steps/LocationStep';
import AdTypeStep from '@/components/booking-steps/AdTypeStep';
import ComposeStep from '@/components/booking-steps/ComposeStep';
import DateStep from '@/components/booking-steps/DateStep';
import ReviewStep from '@/components/booking-steps/ReviewStep';

const steps = [
  { id: 1, name: 'Category', component: CategoryStep },
  { id: 2, name: 'Location', component: LocationStep },
  { id: 3, name: 'Ad Type', component: AdTypeStep },
  { id: 4, name: 'Compose', component: ComposeStep },
  { id: 5, name: 'Publish Date', component: DateStep },
  { id: 6, name: 'Review & Pay', component: ReviewStep }
];

const BookNow = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    category: '',
    city: '',
    newspaperId: '',
    newspaperName: '',
    adType: '',
    adContent: '',
    adImage: '',
    publishDate: '',
    price: 0,
    basePrice: 0,
    pricePerWord: 0
  });

  useEffect(() => {
    if (!user) {
      toast.error('Please login to book an ad');
      navigate('/login');
    }
  }, [user, navigate]);

  const updateBookingData = (data) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Stepper */}
        <div className="bg-white border-2 border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 font-bold transition-all ${
                      currentStep > step.id
                        ? 'bg-green-500 border-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs sm:text-sm font-medium text-center ${
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="bg-white border-2 border-gray-200 p-6 sm:p-8 shadow-lg">
          <CurrentStepComponent
            data={bookingData}
            updateData={updateBookingData}
            nextStep={nextStep}
            prevStep={prevStep}
            currentStep={currentStep}
          />
        </div>
      </div>
    </div>
  );
};

export default BookNow;
