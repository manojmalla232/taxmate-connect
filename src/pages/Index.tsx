
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ArrowRight, Check, Shield, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import AnimatedLogo from '@/components/ui/AnimatedLogo';

const Index = () => {
  const controls = useAnimation();
  
  useEffect(() => {
    controls.start('visible');
  }, [controls]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const features = [
    {
      icon: <Shield size={28} className="text-blue-accent" />,
      title: 'Secure Client Portal',
      description: "End-to-end encryption ensures your clients' sensitive tax information remains protected."
    },
    {
      icon: <FileText size={28} className="text-blue-accent" />,
      title: 'Visa-Specific Tax Forms',
      description: 'Pre-configured tax forms tailored to different visa types for accurate compliance.'
    },
    {
      icon: <Users size={28} className="text-blue-accent" />,
      title: 'Client Management',
      description: 'Track client communications, document submissions, and tax return progress all in one place.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-blue-50 to-transparent opacity-70" />
        
        <div className="container mx-auto px-4 pt-12 pb-24 md:pt-32 md:pb-32 relative">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <AnimatedLogo size="lg" />
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Simplify Tax Returns for <span className="text-gradient">Migration Clients</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-700 mb-8 md:mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              The all-in-one platform designed for migration agents to streamline tax return preparation, 
              visa-specific compliance, and client management.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button size="lg" className="bg-blue-accent hover:bg-blue-accent/90 px-8 py-6 text-lg hover:shadow-lg hover:translate-y-[-2px] transition-all">
                Get Started Free
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                Book a Demo
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative max-w-5xl mx-auto mt-16 rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <img 
              src="https://placehold.co/1200x675/e9f2ff/0A84FF?text=TaxMate+Dashboard+Preview&font=montserrat" 
              alt="TaxMate dashboard preview" 
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Designed for Migration Agents</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Everything you need to manage client tax returns efficiently and accurately
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-card hover:shadow-card-hover transition-all"
                variants={itemVariants}
              >
                <div className="p-3 bg-blue-light rounded-lg inline-block mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to transform your tax preparation workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join hundreds of migration agents who save time and reduce errors with TaxMate.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg hover:translate-y-[-2px] transition-all px-8 py-6 text-lg"
          >
            Start Your Free Trial
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <AnimatedLogo size="sm" variant="light" />
                <span className="font-semibold text-xl ml-2">TaxMate</span>
              </div>
              <p className="text-gray-400 mb-4">
                Simplifying tax returns for migration clients.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} TaxMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
