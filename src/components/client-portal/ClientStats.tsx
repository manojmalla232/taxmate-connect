import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';

interface ClientStatsProps {
  progress: number;
  dueDate: string;
  status: string;
}

const ClientStats: React.FC<ClientStatsProps> = ({ progress, dueDate, status }) => {
  const stats = [
    {
      title: 'Progress',
      value: `${progress}%`,
      icon: <CheckCircle size={24} className="text-blue-accent" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-accent',
    },
    {
      title: 'Status',
      value: status,
      icon: <Clock size={24} className="text-amber-500" />,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      title: 'Due Date',
      value: dueDate,
      icon: <Calendar size={24} className="text-green-500" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-4 sm:gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.title}
          className={`bg-white p-3 xs:p-4 sm:p-6 rounded-xl shadow-card flex items-center gap-4 ${stat.bgColor}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
        >
          <div className="flex-shrink-0">{stat.icon}</div>
          <div>
            <div className={`font-semibold text-lg ${stat.textColor}`}>{stat.value}</div>
            <div className="text-gray-500 text-sm">{stat.title}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ClientStats;
