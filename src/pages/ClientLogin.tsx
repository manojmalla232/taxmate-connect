
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import AnimatedLogo from '@/components/ui/AnimatedLogo';
import PageTransition from '@/components/shared/PageTransition';

const ClientLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, this would authenticate with a backend
    // For demo purposes, we'll use a timeout to simulate API call
    setTimeout(() => {
      if (email === 'demo@example.com' && password === 'password') {
        toast({
          title: "Logged in successfully",
          description: "Welcome to your tax portal"
        });
        navigate('/client-portal');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Try demo@example.com / password",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <AnimatedLogo size="md" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">TaxMate Client Portal</h1>
          <p className="text-gray-500 mt-2">Log in to manage your tax returns</p>
        </div>
        
        <motion.div 
          className="w-full max-w-md bg-white rounded-xl shadow-card p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-sm text-blue-accent hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-accent hover:bg-blue-accent/90"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login to Your Account"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account? Contact your tax agent to get access.
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-center text-gray-500">
              For agency login, <Link to="/login" className="text-blue-accent hover:underline">click here</Link>
            </p>
          </div>
        </motion.div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Demo credentials: demo@example.com / password</p>
        </div>
      </div>
    </PageTransition>
  );
};

export default ClientLogin;
