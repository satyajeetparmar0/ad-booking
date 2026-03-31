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
    <nav className="bg-white border-b border-[#E5E5E5] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center" data-testid="logo-link">
            <h1 className="text-2xl font-heading font-black text-[#050505] tracking-tight">
              AdAdda
            </h1>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/ads" data-testid="browse-ads-link">
              <span className="text-sm font-medium text-[#525252] hover:text-[#06B6D4] transition-colors duration-200">
                Browse Ads
              </span>
            </Link>

            {user ? (
              <>
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                  data-testid="dashboard-link"
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[#525252] hover:text-[#06B6D4] hover:bg-transparent"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2" data-testid="user-info">
                    <User className="w-4 h-4 text-[#525252]" />
                    <span className="text-sm font-medium text-[#050505]">{user.name}</span>
                  </div>
                  <Button 
                    onClick={handleLogout} 
                    variant="outline" 
                    size="sm"
                    className="border-[#E5E5E5] hover:bg-[#06B6D4] hover:text-white transition-colors duration-200"
                    data-testid="logout-button"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" data-testid="login-link">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-[#525252] hover:text-[#06B6D4] hover:bg-transparent"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register" data-testid="register-link">
                  <Button 
                    size="sm"
                    className="bg-[#06B6D4] hover:bg-[#0891B2] text-white"
                  >
                    Get Started
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
