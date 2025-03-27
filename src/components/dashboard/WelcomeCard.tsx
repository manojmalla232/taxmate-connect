
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeCardProps {
  userName: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName }) => {
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentDate);
  
  const getTimeOfDay = () => {
    const hours = currentDate.getHours();
    if (hours < 12) return 'morning';
    if (hours < 17) return 'afternoon';
    return 'evening';
  };

  return (
    <motion.div 
      className="bg-white rounded-xl p-3 xs:p-4 sm:p-6 shadow-card overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute right-0 top-0 w-24 xs:w-28 sm:w-40 h-24 xs:h-28 sm:h-40 bg-blue-light rounded-bl-full opacity-30" />
      
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-lg">
          <h1 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
            Good {getTimeOfDay()}, {userName}
          </h1>
          <div className="flex items-center text-gray-500 mb-2 xs:mb-3 sm:mb-4">
            <Calendar size={16} className="mr-1.5" />
            <span className="text-xs xs:text-sm">{formattedDate}</span>
          </div>
          <p className="text-gray-700 mb-3 xs:mb-4 sm:mb-5 text-xs xs:text-sm sm:text-base">
            Welcome to your dashboard. You have 3 clients with tax returns due this month, and 2 new document uploads to review.
          </p>
          <div className="flex flex-col xs:flex-row xs:items-center space-y-2 xs:space-y-0 xs:space-x-3 sm:space-x-4">
            <Button className="bg-blue-accent hover:bg-blue-accent/90 w-full xs:w-auto text-xs xs:text-sm">
              <span>New Tax Return</span>
              <ArrowRight size={14} className="ml-1.5 xs:ml-2" />
            </Button>
            <Button variant="outline" className="text-xs xs:text-sm">View Notifications</Button>
          </div>
        </div>
        
        <motion.div 
          className="hidden md:block h-24 w-24 bg-blue-light rounded-full flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Calendar size={32} className="text-blue-accent" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomeCard;
