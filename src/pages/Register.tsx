import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, Home, User, Check } from 'lucide-react';
import { UserRole } from '@/lib/mockData';
import { ThemeToggle } from '@/components/ThemeToggle';
import payIcon from '@/assets/pay-icon.png';

const Register = () => {
  const [role, setRole] = useState<UserRole>('renter');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePhone = (phone: string) => /^\d{10}$/.test(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhone(formData.phone)) {
      toast({
        title: 'Invalid phone number',
        description: 'Please enter a valid 10-digit phone number.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    const success = await register({
      ...formData,
      username: formData.email,
      role,
      password: formData.password,
    });

    if (success) {
      toast({
        title: 'Registration successful!',
        description: 'Welcome to PayMyBill.',
      });
      navigate(`/${role}/dashboard`);
    } else {
      toast({
        title: 'Registration failed',
        description: 'Email already exists.',
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  const features = [
    'Track all your payments in one place',
    'Get reminders before due dates',
    'Easy payment proof submission',
    'Real-time status updates'
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background relative order-2 lg:order-1">
        <div className="absolute top-4 right-4 z-10 lg:hidden">
          <ThemeToggle />
        </div>
        
        {/* Mobile Logo */}
        <div className="absolute top-4 left-4 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <img src={payIcon} alt="PayMyBill" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-lg">PayMyBill</span>
          </Link>
        </div>

        <div className="w-full max-w-md space-y-6 animate-fade-in mt-12 lg:mt-0">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold font-space">Create your account</h2>
            <p className="text-muted-foreground">Join PayMyBill and simplify your rent management</p>
          </div>

          {/* Role Selection */}
          <div className="flex gap-3 p-1 bg-muted rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('owner')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                role === 'owner'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Home className="w-4 h-4" />
              Owner
            </button>
            <button
              type="button"
              onClick={() => setRole('renter')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                role === 'renter'
                  ? 'bg-secondary text-secondary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="w-4 h-4" />
              Renter
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="h-11 px-4 border-2 border-border focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="h-11 px-4 border-2 border-border focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password (min 6 characters)"
                required
                minLength={6}
                className="h-11 px-4 border-2 border-border focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                required
                maxLength={10}
                className="h-11 px-4 border-2 border-border focus:border-primary transition-colors"
              />
            </div>

            {role === 'owner' && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your property address"
                  required
                  className="h-11 px-4 border-2 border-border focus:border-primary transition-colors"
                />
              </div>
            )}

            <Button 
              type="submit" 
              className={`w-full h-12 font-semibold shadow-lg hover:shadow-xl transition-all group ${
                role === 'owner' ? 'gradient-primary' : 'gradient-secondary'
              } text-white`}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center space-y-3">
            <p className="text-muted-foreground text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1">
              <ArrowRight className="w-3 h-3 rotate-180" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden order-1 lg:order-2">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        
        <div className="absolute inset-0 particles opacity-50" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-secondary/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 rounded-full bg-primary/20 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="w-28 h-28 mx-auto rounded-3xl overflow-hidden shadow-2xl glow-secondary animate-float">
              <img src={payIcon} alt="PayMyBill" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white font-space mb-3">
                Join PayMyBill
              </h1>
              <p className="text-lg text-white/70 max-w-sm mx-auto">
                Start managing your rent payments the smart way
              </p>
            </div>
            
            {/* Features List */}
            <div className="space-y-4 text-left max-w-xs mx-auto">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-6 h-6 rounded-full gradient-accent flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white/80 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
