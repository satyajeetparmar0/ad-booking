import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Newspaper, MapPin, Calendar, IndianRupee, CheckCircle, Users, Building } from 'lucide-react';

const NewHome = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Newspaper, title: '1000+ Newspapers', desc: 'All major newspapers across India' },
    { icon: MapPin, title: '200+ Cities', desc: 'Pan-India coverage' },
    { icon: Calendar, title: 'Same Day Publishing', desc: 'Quick processing' },
    { icon: IndianRupee, title: 'Best Prices', desc: 'Transparent pricing' }
  ];

  const categories = [
    'Matrimonial',
    'Recruitment',
    'Property',
    'Education',
    'Business',
    'Public Notice'
  ];

  const steps = [
    { step: '1', title: 'Select Category', desc: 'Choose your ad type' },
    { step: '2', title: 'Choose Newspaper', desc: 'Pick from 1000+ options' },
    { step: '3', title: 'Compose Ad', desc: 'Write your content' },
    { step: '4', title: 'Make Payment', desc: 'Secure online payment' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-yellow-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
              Book Newspaper Ads Online
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-orange-50 max-w-3xl mx-auto">
              Publish your ads in 1000+ newspapers across India. Easy, Fast & Affordable.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/book-now')}
              className="bg-white text-orange-600 hover:bg-orange-50 font-bold text-lg px-12 py-6 h-auto shadow-2xl"
              data-testid="book-ad-button"
            >
              <Newspaper className="mr-3 w-6 h-6" />
              Book Your Ad Now
            </Button>
            <p className="mt-4 text-orange-100 text-sm">No registration required to check prices</p>
          </div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
            <path fill="#FAFAFA" fillOpacity="1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Popular Ad Categories</h2>
            <p className="text-gray-600 text-lg">Select your category and publish in minutes</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => navigate('/book-now')}
                className="bg-white border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg p-6 transition-all group"
              >
                <div className="text-4xl mb-3">📰</div>
                <div className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {category}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">Simple 4-step process to publish your ad</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">Why Choose AdAdda?</h2>
              <div className="space-y-4">
                {[
                  'Instant Price Calculator',
                  '100% Safe & Secure Payment',
                  'Free Ad Designing Support',
                  '24/7 Customer Support',
                  'Published Bill & Ad Copy',
                  'All Major Newspapers Available'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <span className="text-lg text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border-2 border-orange-300 p-8 shadow-2xl">
              <div className="text-center mb-6">
                <Users className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Trusted by 50,000+ Customers</h3>
                <p className="text-gray-600">Join thousands who book ads with us daily</p>
              </div>
              <Button
                onClick={() => navigate('/book-now')}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold text-lg h-14"
              >
                Start Booking Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-orange-600 to-yellow-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Building className="w-20 h-20 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-5xl font-black mb-6">Ready to Publish Your Ad?</h2>
          <p className="text-xl mb-8 text-orange-50">Get started in minutes. No hidden charges.</p>
          <Button
            size="lg"
            onClick={() => navigate('/book-now')}
            className="bg-white text-orange-600 hover:bg-orange-50 font-bold text-xl px-16 py-7 h-auto shadow-2xl"
          >
            Book Ad Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default NewHome;
