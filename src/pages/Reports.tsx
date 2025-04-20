import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Download, BarChart, PieChart, TrendingUp, Calendar, Filter, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import PageTransition from '@/components/shared/PageTransition';
import PortalHeader from '@/components/layout/PortalHeader';
import { getTaxReturns } from '@/services/taxReturnService';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart as RechartBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartPieChart,
  Pie,
  Cell
} from 'recharts';

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('status');
  const isMobile = useIsMobile();
  
  const { data: taxReturns = [], isLoading } = useQuery({
    queryKey: ['taxReturns'],
    queryFn: getTaxReturns,
  });

  const getStatusDistribution = () => {
    const statuses = { completed: 0, 'in-progress': 0, pending: 0 };
    
    taxReturns.forEach(tr => {
      statuses[tr.status] += 1;
    });
    
    return [
      { name: 'Completed', value: statuses.completed },
      { name: 'In Progress', value: statuses['in-progress'] },
      { name: 'Pending', value: statuses.pending }
    ];
  };

  const getVisaTypeDistribution = () => {
    const visaTypes = {};
    
    taxReturns.forEach(tr => {
      if (tr.visaType) {
        visaTypes[tr.visaType] = (visaTypes[tr.visaType] || 0) + 1;
      }
    });
    
    return Object.keys(visaTypes).map(type => ({
      name: type,
      value: visaTypes[type]
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const renderStatusChart = () => (
    <div className="bg-white p-6 rounded-xl shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Tax Returns by Status</h3>
        <Button variant="outline" size="sm" className="flex items-center">
          <Download size={16} className="mr-1.5" />
          <span>Export</span>
        </Button>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <RechartPieChart>
          <Pie
            data={getStatusDistribution()}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => isMobile ? 
              (percent > 0.1 ? `${(percent * 100).toFixed(0)}%` : '') : 
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={isMobile ? 80 : 120}
            fill="#8884d8"
            dataKey="value"
          >
            {getStatusDistribution().map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout={isMobile ? "horizontal" : "vertical"} />
        </RechartPieChart>
      </ResponsiveContainer>
    </div>
  );

  const renderVisaTypeChart = () => (
    <div className="bg-white p-6 rounded-xl shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Tax Returns by Visa Type</h3>
        <Button variant="outline" size="sm" className="flex items-center">
          <Download size={16} className="mr-1.5" />
          <span>Export</span>
        </Button>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <RechartBarChart
          data={getVisaTypeDistribution()}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="Number of Tax Returns" fill="#8884d8" />
        </RechartBarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PortalHeader type="agent" profileName="John Agent" />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 pb-20 md:pb-0 md:ml-16 lg:ml-64 px-4 md:px-6">
          <PageTransition>
            <main className="page-container py-4 sm:py-6 md:py-10 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Reports</h1>
                  <p className="text-sm sm:text-base text-gray-500 mt-1">Analyze tax return data and generate insights.</p>
                </div>
                
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                  <Button 
                    variant={selectedReport === 'status' ? 'default' : 'outline'} 
                    onClick={() => setSelectedReport('status')}
                    className={`flex-1 md:flex-none text-xs sm:text-sm ${selectedReport === 'status' ? 'bg-blue-accent hover:bg-blue-accent/90' : ''}`}
                  >
                    <PieChart size={16} className="mr-1.5" />
                    <span>Status</span>
                  </Button>
                  <Button 
                    variant={selectedReport === 'visa' ? 'default' : 'outline'}
                    onClick={() => setSelectedReport('visa')}
                    className={`flex-1 md:flex-none text-xs sm:text-sm ${selectedReport === 'visa' ? 'bg-blue-accent hover:bg-blue-accent/90' : ''}`}
                  >
                    <BarChart size={16} className="mr-1.5" />
                    <span>Visa Types</span>
                  </Button>
                </div>
              </div>
              
              {isLoading ? (
                <div className="bg-white p-6 sm:p-12 rounded-xl shadow-card flex items-center justify-center">
                  <div className="animate-pulse">
                    <div className="h-32 sm:h-48 w-32 sm:w-48 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              ) : (
                <div>
                  {selectedReport === 'status' ? renderStatusChart() : renderVisaTypeChart()}
                </div>
              )}
              
              <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-card">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle size={16} className="text-green-500 sm:text-[20px]" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-lg font-medium">Completion Rate</h3>
                      <p className="text-xs sm:text-sm text-gray-500">Tax returns completed vs total</p>
                    </div>
                  </div>
                  <div className="text-xl sm:text-3xl font-bold text-gray-900">
                    {taxReturns.length > 0 
                      ? `${Math.round((taxReturns.filter(tr => tr.status === 'completed').length / taxReturns.length) * 100)}%` 
                      : '0%'}
                  </div>
                </div>
                
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-card">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                      <TrendingUp size={16} className="text-blue-accent sm:text-[20px]" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-lg font-medium">Average Refund</h3>
                      <p className="text-xs sm:text-sm text-gray-500">For completed returns</p>
                    </div>
                  </div>
                  <div className="text-xl sm:text-3xl font-bold text-gray-900">
                    {taxReturns.filter(tr => tr.status === 'completed').length > 0 
                      ? `$${Math.round(taxReturns.filter(tr => tr.status === 'completed').reduce((sum, tr) => sum + tr.refundAmount, 0) / taxReturns.filter(tr => tr.status === 'completed').length).toLocaleString()}` 
                      : '$0'}
                  </div>
                </div>
                
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-card">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-50 rounded-full flex items-center justify-center mr-3">
                      <Calendar size={16} className="text-amber-500 sm:text-[20px]" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-lg font-medium">Upcoming Deadlines</h3>
                      <p className="text-xs sm:text-sm text-gray-500">Next 30 days</p>
                    </div>
                  </div>
                  <div className="text-xl sm:text-3xl font-bold text-gray-900">
                    {taxReturns.filter(tr => {
                      const today = new Date();
                      const due = new Date(tr.dueDate);
                      const diffTime = due.getTime() - today.getTime();
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays > 0 && diffDays <= 30 && tr.status !== 'completed';
                    }).length}
                  </div>
                </div>
              </div>
            </main>
          </PageTransition>
        </div>
      </div>
    </div>
  );
};

export default Reports;
