
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { TaxReturn } from '@/services/taxReturnService';

interface UpcomingDeadlinesProps {
  deadlines: TaxReturn[];
  isLoading: boolean;
}

const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({ deadlines, isLoading }) => {
  const getStatusIcon = (status: TaxReturn['status']) => {
    switch (status) {
      case 'in-progress':
        return <Clock size={16} className="text-amber-500" />;
      case 'pending':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <Calendar size={16} className="text-gray-500" />;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  const getDueDateClass = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-500 font-medium';
    if (diffDays <= 7) return 'text-amber-500 font-medium';
    return 'text-gray-500';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-card p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="flex items-center justify-between p-2 xs:p-3 sm:p-4 md:p-5 border-b border-gray-100">
        <h3 className="font-medium text-gray-900 text-xs xs:text-sm sm:text-base">Upcoming Deadlines</h3>
        <Link to="/tax-returns">
          <Button variant="outline" size="sm" className="h-6 xs:h-8 px-1.5 xs:px-2 sm:px-3 text-xs">
            <span className="hidden xs:inline">View All</span>
            <span className="xs:hidden">View</span>
          </Button>
        </Link>
      </div>
      
      <div className="divide-y divide-gray-100">
        {deadlines.length === 0 ? (
          <div className="p-3 xs:p-4 sm:p-6 text-center text-gray-500">
            <Calendar size={24} className="text-gray-300 mx-auto mb-2" />
            <p className="text-xs xs:text-sm">No upcoming deadlines</p>
          </div>
        ) : (
          deadlines.map((taxReturn, index) => (
            <motion.div 
              key={taxReturn.id}
              className="p-2 xs:p-2.5 sm:p-3 md:p-4 hover:bg-gray-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={`/tax-returns`} 
                state={{ selectedId: taxReturn.id }}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center min-w-0 flex-1 pr-1 xs:pr-2">
                  <div className="p-1 sm:p-1.5 md:p-2 bg-gray-100 rounded-full flex-shrink-0">
                    {getStatusIcon(taxReturn.status)}
                  </div>
                  <div className="ml-1.5 xs:ml-2 sm:ml-3 min-w-0">
                    <p className="text-xs font-medium text-gray-900 line-clamp-1 break-words">{taxReturn.clientName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{taxReturn.taxYear} Tax Return</p>
                  </div>
                </div>
                
                <span className={`text-xs whitespace-nowrap flex-shrink-0 ${getDueDateClass(taxReturn.dueDate)}`}>
                  {getDaysUntilDue(taxReturn.dueDate)}
                </span>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;
