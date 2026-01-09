import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ClipboardCheck,
  Image,
  Bell,
  Smartphone,
  BarChart3,
  Shield,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';
import payIcon from '@/assets/pay-icon.png';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AnimatedCube3D } from '@/components/Animated3D';
import { WaveAnimation } from '@/components/FloatingElements';

const features = [
  {
    icon: ClipboardCheck,
    title: 'Easy Tracking',
    description: 'Track rent payments in one place',
    gradient: 'from-primary to-secondary',
  },
  {
    icon: Image,
    title: 'Payment Proof',
    description: 'Upload screenshot of UPI transfer',
    gradient: 'from-secondary to-accent',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Get alerts for due dates',
    gradient: 'from-accent to-success',
  },
  {
    icon: Smartphone,
    title: 'Digital Payments',
    description: 'Support UPI & Google Pay',
    gradient: 'from-primary to-accent',
  },
  {
    icon: BarChart3,
    title: 'Statistics',
    description: "See who paid, who didn't",
    gradient: 'from-secondary to-primary',
  },
  {
    icon: Shield,
    title: 'Secure',
    description: 'Encrypted & private',
    gradient: 'from-accent to-secondary',
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-mesh-gradient opacity-50 pointer-events-none" />
      <div className="fixed top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="fixed bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '3s' }} />

      {/* Hero Section */}
      <header className="relative gradient-hero text-primary-foreground overflow-hidden">
        {/* Theme toggle */}
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>
        
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        {/* Floating shapes */}
        <div className="absolute top-32 right-20 hidden lg:block animate-float-drift">
          <div className="w-16 h-16 border-2 border-primary/40 rounded-lg transform rotate-45" />
        </div>
        <div className="absolute bottom-40 left-20 hidden lg:block animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-12 h-12 bg-secondary/20 rounded-full" />
        </div>
        <div className="absolute top-48 left-1/4 hidden lg:block animate-float-spin">
          <div className="w-8 h-8 bg-accent/30" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
        </div>
        
        {/* 3D Cube - desktop only */}
        <div className="absolute bottom-20 right-32 hidden xl:block">
          <AnimatedCube3D />
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark mb-8 animate-fade-in hover:bg-primary/10 transition-colors">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">Smart Rent Management System</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-space animate-fade-in stagger-1">
              <img src={payIcon} alt="PayMyBill" className="inline-block w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-glow animate-float" />{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent gradient-text-animate">
                PayMyBill
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-fade-in stagger-2">
              Simple Rent Payment Tracking for House Owners & Renters. 
              <span className="text-primary font-medium"> No more manual tracking.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in stagger-3">
              <Button
                asChild
                size="xl"
                className="gradient-primary text-primary-foreground border-0 shadow-glow hover:shadow-glow-lg transition-all duration-300 group animate-glow-pulse"
              >
                <Link to="/login?role=owner" className="flex items-center gap-2">
                  <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Owner Login
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                variant="outline"
                className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent backdrop-blur-sm group hover:border-primary-foreground/50 transition-all"
              >
                <Link to="/login?role=renter" className="flex items-center gap-2">
                  👤 Renter Login
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            
            <p className="mt-8 text-sm text-primary-foreground/60 animate-fade-in stagger-4">
              New here?{' '}
              <Link to="/register" className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors hover:decoration-2">
                Register now →
              </Link>
            </p>
          </div>
        </div>

        {/* Wave separator with animation */}
        <WaveAnimation />
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-space mb-4 animate-fade-in">
            Why Choose{' '}
            <span className="text-gradient">PayMyBill</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in stagger-1">
            Modern features designed for seamless rent management experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group relative glass border-border/50 hover:border-primary/50 transition-all duration-500 overflow-hidden animate-fade-in cursor-pointer hover-lift"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                {/* Gradient border effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-10`} />
                </div>
                
                {/* Animated corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-bl ${feature.gradient} opacity-20 blur-xl`} />
                </div>
                
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 group-hover:shadow-glow group-hover:rotate-3 transition-all duration-300`}>
                      <Icon className="w-7 h-7 text-primary-foreground group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 font-space group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm group-hover:text-foreground/80 transition-colors">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
                
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer" />
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <Card className="max-w-2xl mx-auto glass border-border/50 overflow-hidden animate-fade-in hover:border-primary/30 transition-all duration-500 group">
            <div className="h-1 gradient-primary animate-glow-pulse" />
            <CardContent className="p-8 text-center relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow animate-float group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-2xl font-space mb-3 relative z-10">
                Ready to Get Started?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto relative z-10">
                Join thousands of house owners and renters who manage their rent payments effortlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
                <Button asChild size="lg" className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all">
                  <Link to="/register">Create Account</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="hover:bg-primary/5 transition-all">
                  <Link to="/login?role=owner">Sign In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm font-medium">
            PayMyBill – Manage your rent smartly
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
