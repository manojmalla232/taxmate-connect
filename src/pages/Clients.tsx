
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import ClientList from '@/components/dashboard/ClientList';
import PageTransition from '@/components/shared/PageTransition';

const Clients: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 pb-20 md:pb-0 md:ml-16 lg:ml-64 px-4 md:px-6">
        <PageTransition>
          <main className="page-container py-4 sm:py-6 md:py-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Clients</h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">Manage all your client information and tax returns.</p>
              </div>
              
              <div className="w-full md:w-auto mt-2 md:mt-0">
                <Button className="bg-blue-accent hover:bg-blue-accent/90 w-full md:w-auto">
                  <Plus size={16} className="mr-1.5" />
                  <span>Add New Client</span>
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-card p-3 sm:p-4 md:p-6 mb-3 sm:mb-5 md:mb-8">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search clients by name, email, or ID..."
                    className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-accent focus:border-transparent"
                  />
                </div>
                
                <Button variant="outline" className="w-full sm:w-auto sm:min-w-[120px]">
                  <Filter size={16} className="mr-1.5" />
                  <span>Filters</span>
                </Button>
              </div>
            </div>
            
            <div>
              <ClientList />
            </div>
          </main>
        </PageTransition>
      </div>
    </div>
  );
};

export default Clients;
