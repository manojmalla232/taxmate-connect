
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-card">
            <Skeleton className="h-8 w-8 rounded-full mb-4" />
            <Skeleton className="h-6 w-16 mb-2" />
            <Skeleton className="h-4 w-32" />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="bg-white p-6 rounded-xl shadow-card hover:shadow-lg transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mb-4`}>
            {stat.icon}
          </div>
          <h3 className={`text-2xl font-semibold mb-1 ${stat.textColor}`}>
            {stat.value}
          </h3>
          <p className="text-gray-500 text-sm">{stat.title}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;
