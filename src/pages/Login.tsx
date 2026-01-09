import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, Home, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import payIcon from '@/assets/pay-icon.png';

const Login = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'owner';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(email, password);

    if (success) {
      toast({
        title: 'Welcome back!',
        description: 'Login successful.',
      });
      const users = JSON.parse(localStorage.getItem('paymybill_users') || '[]');
      const user = users.find((u: any) => u.username === email || u.email === email);
      if (user) {
        navigate(`/${user.role}/dashboard`);
      }
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password.',
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 particles opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-secondary/20 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
        
        {/* Floating shapes */}
        <div className="absolute top-20 right-20 w-20 h-20 border-2 border-primary/30 rounded-lg animate-float-spin" />
        <div className="absolute bottom-32 left-16 w-16 h-16 bg-secondary/20 rounded-full animate-float-drift" />
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-accent/20 animate-float" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="w-28 h-28 mx-auto rounded-3xl overflow-hidden shadow-2xl glow-primary animate-float">
              <img src={payIcon} alt="PayMyBill" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-5xl font-bold text-primary-foreground font-space gradient-text-animate">
              Welcome Back
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-sm">
              Manage your rent payments effortlessly with our smart rent management system.
            </p>
            <div className="flex items-center justify-center gap-4 pt-8">
              <div className="flex items-center gap-2 px-5 py-3 rounded-full glass-dark hover:bg-primary/10 transition-colors cursor-pointer group">
                <Home className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm text-primary-foreground/90 font-medium">Owners</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-3 rounded-full glass-dark hover:bg-secondary/10 transition-colors cursor-pointer group">
                <User className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" />
                <span className="text-sm text-primary-foreground/90 font-medium">Renters</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background relative">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        
        {/* Mobile Logo */}
        <div className="absolute top-4 left-4 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <img src={payIcon} alt="PayMyBill" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-lg">PayMyBill</span>
          </Link>
        </div>

        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              {role === 'owner' ? <Home className="w-4 h-4" /> : <User className="w-4 h-4" />}
              {role === 'owner' ? 'Owner' : 'Renter'} Login
            </div>
            <h2 className="text-3xl font-bold font-space">Sign in to your account</h2>
            <p className="text-muted-foreground">Enter your credentials to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="h-12 px-4 border-2 border-border focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="h-12 px-4 border-2 border-border focus:border-primary transition-colors"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 gradient-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all group"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Role Switch */}
          <div className="flex items-center justify-center gap-4">
            <Link
              to={`/login?role=owner`}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                role === 'owner' 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <Home className="w-4 h-4" />
              Owner
            </Link>
            <Link
              to={`/login?role=renter`}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                role === 'renter' 
                  ? 'bg-secondary text-secondary-foreground shadow-lg' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <User className="w-4 h-4" />
              Renter
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center space-y-3">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Create Account
              </Link>
            </p>
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1">
              <ArrowRight className="w-3 h-3 rotate-180" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
