
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, FileText, Users, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import DashboardStats from '@/components/dashboard/DashboardStats';
import ClientList from '@/components/dashboard/ClientList';
import PageTransition from '@/components/shared/PageTransition';
import RecentActivity from '@/components/dashboard/RecentActivity';
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';
import { getTaxReturns } from '@/services/taxReturnService';
import { useQuery } from '@tanstack/react-query';

const Dashboard: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const { data: taxReturns = [], isLoading } = useQuery({
    queryKey: ['taxReturns'],
    queryFn: getTaxReturns,
  });

  const upcomingDeadlines = taxReturns
    .filter(tr => tr.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const recentActivities = taxReturns
    .flatMap(tr => tr.timeline.map(item => ({
      clientName: tr.clientName,
      ...item,
      taxReturnId: tr.id
    })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 pb-20 md:pb-0 md:ml-16 lg:ml-64">
        <PageTransition>
          <main className="page-container py-6 sm:py-10">
            <WelcomeCard userName="John" />
            
            <div className="mt-6 sm:mt-8">
              <DashboardStats taxReturns={taxReturns} isLoading={isLoading} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
              <UpcomingDeadlines deadlines={upcomingDeadlines} isLoading={isLoading} />
              <RecentActivity activities={recentActivities} isLoading={isLoading} />
            </div>
            
            <div className="mt-6 sm:mt-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Clients</h2>
                <Button 
                  className="bg-blue-accent hover:bg-blue-accent/90 w-full md:w-auto"
                  onClick={() => window.location.href = '/clients'}
                >
                  <Plus size={16} className="mr-1.5" />
                  <span>Add New Client</span>
                </Button>
              </div>
              <ClientList />
            </div>
          </main>
        </PageTransition>
      </div>
    </div>
  );
};

export default Dashboard;
