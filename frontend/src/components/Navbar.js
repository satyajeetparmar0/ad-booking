import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, User, Phone, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showContactDropdown, setShowContactDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b-2 border-blue-600 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity" data-testid="logo-link">
            <img 
              src="https://customer-assets.emergentagent.com/job_ad-booking-hub-1/artifacts/6saqx3xl_AdAdda%20%281%29.png" 
              alt="AdAdda Logo" 
              className="h-10 sm:h-12 w-auto"
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Contact Button */}
            <div className="relative">
              <button
                onClick={() => setShowContactDropdown(!showContactDropdown)}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors px-2 sm:px-3 py-2 rounded-lg hover:bg-blue-50"
                data-testid="navbar-contact-btn"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Contact Us</span>
              </button>
              {showContactDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowContactDropdown(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white shadow-2xl border border-gray-200 rounded-lg p-4 w-64 z-50" data-testid="navbar-contact-dropdown">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900 text-sm">Get in Touch</h4>
                      <button onClick={() => setShowContactDropdown(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <a href="tel:+918800330000" className="flex items-center gap-3 p-2 hover:bg-red-50 rounded-lg transition-colors group" data-testid="navbar-phone-link">
                      <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-red-600">+91 8800 330 000</p>
                        <p className="text-xs text-gray-500">Call Now</p>
                      </div>
                    </a>
                    <a href="https://wa.me/918800330000?text=Hi%2C%20I%20want%20to%20book%20a%20newspaper%20ad" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-lg transition-colors group mt-1" data-testid="navbar-whatsapp-link">
                      <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-green-600">WhatsApp</p>
                        <p className="text-xs text-gray-500">Chat with us</p>
                      </div>
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300 hidden sm:block" />
            {user ? (
              <>
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                  data-testid="dashboard-link"
                  className="hidden sm:block"
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-orange-50 rounded-full" data-testid="user-info">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  </div>
                  <Button 
                    onClick={handleLogout} 
                    variant="outline" 
                    size="sm"
                    className="border-blue-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-orange-500 hover:text-white transition-all duration-200 text-xs sm:text-sm"
                    data-testid="logout-button"
                  >
                    <LogOut className="w-3 sm:w-4 h-3 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link to="/login" data-testid="login-link">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 text-xs sm:text-sm"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register" data-testid="register-link">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">Register</span>
                    <span className="sm:hidden">Sign Up</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
