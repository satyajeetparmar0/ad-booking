import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await register(name, email, password);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-[#E5E5E5] p-8">
          <h1 className="text-4xl font-heading font-black text-[#050505] mb-2 tracking-tight">
            Get Started
          </h1>
          <p className="text-[#525252] mb-8">Create your AdAdda account</p>
          
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="register-form">
            <div>
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-[0.2em] text-[#050505] mb-2 block">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-[#E5E5E5] focus:ring-[#002FA7]"
                data-testid="register-name-input"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.2em] text-[#050505] mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#E5E5E5] focus:ring-[#002FA7]"
                data-testid="register-email-input"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-[0.2em] text-[#050505] mb-2 block">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="border-[#E5E5E5] focus:ring-[#002FA7]"
                data-testid="register-password-input"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#002FA7] hover:bg-[#002175] text-white"
              disabled={loading}
              data-testid="register-submit-button"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
          
          <p className="text-center text-[#525252] text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#002FA7] font-medium hover:underline" data-testid="login-redirect-link">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
