import { useState } from 'react';
import { Phone, X } from 'lucide-react';

const FloatingContact = () => {
  const [showPhone, setShowPhone] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showCallback, setShowCallback] = useState(false);

  return (
    <>
      {/* Left Side - Phone & WhatsApp Buttons */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-1" data-testid="floating-contact-left">
        {/* Phone Button */}
        <div className="relative">
          <button
            onClick={() => { setShowPhone(!showPhone); setShowWhatsApp(false); }}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors duration-200 shadow-lg rounded-r-lg"
            data-testid="floating-phone-btn"
            aria-label="Call us"
          >
            <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
          {/* Phone Popup */}
          {showPhone && (
            <div className="absolute left-full top-0 ml-2 bg-white shadow-2xl border border-gray-200 rounded-lg p-4 w-64 animate-in slide-in-from-left-2" data-testid="phone-popup">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900 text-sm">Call Us Now</h4>
                <button onClick={() => setShowPhone(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <a
                href="tel:+919973634393"
                className="flex items-center gap-3 p-2 hover:bg-red-50 rounded-lg transition-colors group"
                data-testid="phone-number-link"
              >
                <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-red-600">+91 9973634393</p>
                  <p className="text-xs text-gray-500">Mon-Sat, 9am-7pm</p>
                </div>
              </a>
              <a
                href="tel:1233210000"
                className="flex items-center gap-3 p-2 hover:bg-red-50 rounded-lg transition-colors group mt-1"
                data-testid="phone-number-link-2"
              >
                <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-red-600">123-321-0000</p>
                  <p className="text-xs text-gray-500">Landline</p>
                </div>
              </a>
            </div>
          )}
        </div>

        {/* WhatsApp Button */}
        <div className="relative">
          <button
            onClick={() => { setShowWhatsApp(!showWhatsApp); setShowPhone(false); }}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors duration-200 shadow-lg rounded-r-lg"
            data-testid="floating-whatsapp-btn"
            aria-label="WhatsApp us"
          >
            {/* WhatsApp SVG icon */}
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </button>
          {/* WhatsApp Popup */}
          {showWhatsApp && (
            <div className="absolute left-full top-0 ml-2 bg-white shadow-2xl border border-gray-200 rounded-lg p-4 w-64 animate-in slide-in-from-left-2" data-testid="whatsapp-popup">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900 text-sm">WhatsApp Us</h4>
                <button onClick={() => setShowWhatsApp(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <a
                href="https://wa.me/918800330000?text=Hi%2C%20I%20want%20to%20book%20a%20newspaper%20ad"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-lg transition-colors group"
                data-testid="whatsapp-link"
              >
                <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-green-600">+91 9973634393</p>
                  <p className="text-xs text-gray-500">Tap to chat on WhatsApp</p>
                </div>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Call Back Tab */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50" data-testid="floating-callback-right">
        <div className="relative">
          <button
            onClick={() => { setShowCallback(!showCallback); setShowPhone(false); setShowWhatsApp(false); }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm tracking-wider shadow-lg transition-colors duration-200 rounded-l-lg"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', padding: '16px 10px' }}
            data-testid="callback-tab-btn"
            aria-label="Request callback"
          >
            Call Back
          </button>
          {/* Callback Popup */}
          {showCallback && (
            <div className="absolute right-full top-0 mr-2 bg-white shadow-2xl border border-gray-200 rounded-lg p-4 w-72 animate-in slide-in-from-right-2" data-testid="callback-popup">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900 text-sm">Request a Call Back</h4>
                <button onClick={() => setShowCallback(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-3">Leave your number and we'll call you back shortly.</p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                  data-testid="callback-name-input"
                />
                <input
                  type="tel"
                  placeholder="Your Phone Number"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                  data-testid="callback-phone-input"
                />
                <button
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded text-sm transition-colors duration-200"
                  data-testid="callback-submit-btn"
                  onClick={() => {
                    setShowCallback(false);
                    alert('We will call you back shortly!');
                  }}
                >
                  Request Call Back
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">Or call us directly:</p>
                <a href="tel:+919973634393" className="block text-center text-sm font-bold text-red-600 hover:text-red-700 mt-1" data-testid="callback-direct-call">
                  +91 9973634393
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Contact Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-blue-600 text-white py-2 px-4 text-center shadow-lg sm:hidden" data-testid="bottom-contact-bar">
        <a href="tel:+919973634393" className="flex items-center justify-center gap-2 text-sm font-semibold">
          <Phone className="w-4 h-4" />
          <span>Fill Query or Call 9973634393</span>
        </a>
      </div>
    </>
  );
};

export default FloatingContact;
