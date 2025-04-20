import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedLogo from '../ui/AnimatedLogo';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Features", path: "/#features" },
    { label: "Pricing", path: "/#pricing" },
    { label: "About", path: "/#about" },
    { label: "Contact", path: "/#contact" },
    { label: "Agent Register", path: "/register-agent" },
    { label: "Client Register", path: "/register-client" },
    { label: "Admin Panel", path: "/admin" },
  ];

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20 
      } 
    }
  };

  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: { 
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center space-x-2">
            <AnimatedLogo size="sm" />
            <span className="font-semibold text-xl text-gray-900">TaxMate</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                to={link.path}
                className="text-gray-700 hover:text-blue-accent transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/client-login">
              <Button variant="outline" size="sm" className="hover-lift">
                <User size={16} className="mr-1.5" />
                Client Portal
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="bg-blue-accent hover:bg-blue-accent/90 hover-lift">
                Agent Login
              </Button>
            </Link>
          </div>
          
          <button 
            className="md:hidden text-gray-700 hover:text-blue-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden bg-white border-t"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.label} 
                  to={link.path}
                  className="block text-gray-700 hover:text-blue-accent transition-colors py-2 text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 space-y-3">
                <Link to="/client-login" className="block w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    <User size={16} className="mr-1.5" />
                    Client Portal
                  </Button>
                </Link>
                <Link to="/dashboard" className="block w-full">
                  <Button size="sm" className="w-full bg-blue-accent hover:bg-blue-accent/90">
                    Agent Login
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
