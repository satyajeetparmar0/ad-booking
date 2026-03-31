import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b-2 border-orange-500 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" data-testid="logo-link">
            <img 
              src="https://customer-assets.emergentagent.com/job_ad-booking-hub-1/artifacts/glj6bes2_AdAdda%20%281%29.png" 
              alt="AdAdda Logo" 
              className="h-10 sm:h-12 w-auto"
            />
          </Link>

          <div className="flex items-center gap-3 sm:gap-6">{user ? (
              <>
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                  data-testid="dashboard-link"
                  className="hidden sm:block"
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-full" data-testid="user-info">
                    <User className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  </div>
                  <Button 
                    onClick={handleLogout} 
                    variant="outline" 
                    size="sm"
                    className="border-orange-300 hover:bg-orange-500 hover:text-white transition-colors duration-200 text-xs sm:text-sm"
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
                    className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 text-xs sm:text-sm"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register" data-testid="register-link">
                  <Button 
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm"
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
