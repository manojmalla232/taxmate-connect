
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
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <h3 className="font-medium text-gray-900">Upcoming Deadlines</h3>
        <Link to="/tax-returns">
          <Button variant="outline" size="sm">View All</Button>
        </Link>
      </div>
      
      <div className="divide-y divide-gray-100">
        {deadlines.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Calendar size={32} className="text-gray-300 mx-auto mb-2" />
            <p>No upcoming deadlines</p>
          </div>
        ) : (
          deadlines.map((taxReturn, index) => (
            <motion.div 
              key={taxReturn.id}
              className="p-4 hover:bg-gray-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={`/tax-returns`} 
                state={{ selectedId: taxReturn.id }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-gray-100 rounded-full">
                    {getStatusIcon(taxReturn.status)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900 font-medium">{taxReturn.clientName}</p>
                    <p className="text-xs text-gray-500">{taxReturn.taxYear}</p>
                  </div>
                </div>
                <div className={`text-xs ${getDueDateClass(taxReturn.dueDate)}`}>
                  {getDaysUntilDue(taxReturn.dueDate)}
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;
