
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle, Clock, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { TaxReturn } from '@/services/taxReturnService';

interface DashboardStatsProps {
  taxReturns: TaxReturn[];
  isLoading: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ taxReturns = [], isLoading }) => {
  const completedReturns = taxReturns?.filter(tr => tr.status === 'completed').length || 0;
  const pendingReturns = taxReturns?.filter(tr => tr.status === 'pending').length || 0;
  const inProgressReturns = taxReturns?.filter(tr => tr.status === 'in-progress').length || 0;
  
  const totalRefunds = taxReturns
    ?.filter(tr => tr.status === 'completed')
    .reduce((sum, tr) => sum + tr.refundAmount, 0) || 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-3 xs:p-4 sm:p-6 rounded-xl shadow-card">
            <Skeleton className="h-6 w-6 xs:h-8 xs:w-8 rounded-full mb-2 xs:mb-3 sm:mb-4" />
            <Skeleton className="h-5 xs:h-6 w-14 xs:w-16 mb-1 xs:mb-2" />
            <Skeleton className="h-3 xs:h-4 w-24 xs:w-32" />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Completed Returns',
      value: completedReturns,
      icon: <CheckCircle size={24} className="text-green-500" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'In Progress',
      value: inProgressReturns,
      icon: <Clock size={24} className="text-amber-500" />,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      title: 'Pending Returns',
      value: pendingReturns,
      icon: <AlertCircle size={24} className="text-red-500" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Total Refunds',
      value: `$${totalRefunds.toLocaleString()}`,
      icon: <DollarSign size={24} className="text-blue-accent" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-accent'
    }
  ];

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-card hover:shadow-lg transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bgColor} rounded-full flex items-center justify-center mb-3 sm:mb-4`}>
            {stat.icon}
          </div>
          <h3 className={`text-xl sm:text-2xl font-semibold mb-1 ${stat.textColor}`}>
            {stat.value}
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm">{stat.title}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;
