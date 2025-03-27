
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

interface Activity {
  date: string;
  action: string;
  user: string;
  clientName: string;
  taxReturnId: number;
}

interface RecentActivityProps {
  activities: Activity[];
  isLoading: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, isLoading }) => {
  const getActivityIcon = (activity: string) => {
    if (activity.includes('created')) return <FileText size={16} className="text-blue-500" />;
    if (activity.includes('uploaded')) return <FileText size={16} className="text-green-500" />;
    if (activity.includes('completed')) return <AlertCircle size={16} className="text-amber-500" />;
    if (activity.includes('submitted')) return <AlertCircle size={16} className="text-green-600" />;
    return <Clock size={16} className="text-gray-500" />;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-card p-4 sm:p-6">
        <Skeleton className="h-6 w-48 mb-3 sm:mb-4" />
        <div className="space-y-3 sm:space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-2 sm:gap-3">
              <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-1 sm:mb-2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="flex items-center justify-between p-2 xs:p-3 sm:p-4 md:p-5 border-b border-gray-100">
        <h3 className="font-medium text-gray-900 text-xs xs:text-sm sm:text-base">Recent Activity</h3>
        <Link to="/tax-returns">
          <Button variant="outline" size="sm" className="h-6 xs:h-8 px-1.5 xs:px-2 sm:px-3 text-xs">
            <span className="hidden xs:inline">View All</span>
            <span className="xs:hidden">View</span>
          </Button>
        </Link>
      </div>
      
      <div className="divide-y divide-gray-100">
        {activities.length === 0 ? (
          <div className="p-3 xs:p-4 sm:p-6 text-center text-gray-500">
            <Clock size={24} className="text-gray-300 mx-auto mb-2" />
            <p className="text-xs xs:text-sm">No recent activity to display</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <motion.div 
              key={index}
              className="p-2 xs:p-2.5 sm:p-3 md:p-4 hover:bg-gray-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={`/tax-returns`} 
                state={{ selectedId: activity.taxReturnId }}
                className="block w-full"
              >
                <div className="flex items-start min-w-0">
                  <div className="p-1 sm:p-1.5 md:p-2 bg-gray-100 rounded-full mt-0.5 flex-shrink-0">
                    {getActivityIcon(activity.action)}
                  </div>
                  <div className="ml-1.5 xs:ml-2 sm:ml-3 min-w-0 flex-1">
                    <p className="text-xs text-gray-900 font-medium line-clamp-1 break-words">{activity.action}</p>
                    <div className="flex flex-wrap items-center text-xs text-gray-500 mt-0.5 xs:mt-1">
                      <span className="inline-block">{activity.date}</span>
                      <span className="mx-1 xs:mx-1.5 inline-block">•</span>
                      <span className="flex items-center inline-block">
                        <User size={10} className="mr-0.5 xs:mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{activity.clientName}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
