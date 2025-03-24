
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
      <div className="bg-white rounded-xl shadow-card p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
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
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <h3 className="font-medium text-gray-900">Recent Activity</h3>
        <Link to="/tax-returns">
          <Button variant="outline" size="sm">View All</Button>
        </Link>
      </div>
      
      <div className="divide-y divide-gray-100">
        {activities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Clock size={32} className="text-gray-300 mx-auto mb-2" />
            <p>No recent activity to display</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <motion.div 
              key={index}
              className="p-4 hover:bg-gray-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={`/tax-returns`} 
                state={{ selectedId: activity.taxReturnId }}
                className="block"
              >
                <div className="flex items-start">
                  <div className="p-2 bg-gray-100 rounded-full mt-0.5">
                    {getActivityIcon(activity.action)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900 font-medium">{activity.action}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>{activity.date}</span>
                      <span className="mx-1.5">•</span>
                      <span className="flex items-center">
                        <User size={12} className="mr-1" />
                        {activity.clientName}
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
