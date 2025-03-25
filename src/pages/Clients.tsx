
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
      
      <div className="flex-1 ml-16 md:ml-64 px-4 md:px-0">
        <PageTransition>
          <main className="page-container py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
                <p className="text-gray-500 mt-1">Manage all your client information and tax returns.</p>
              </div>
              
              <div>
                <Button className="bg-blue-accent hover:bg-blue-accent/90">
                  <Plus size={16} className="mr-1.5" />
                  <span>Add New Client</span>
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-card p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search clients by name, email, or ID..."
                    className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-accent focus:border-transparent"
                  />
                </div>
                
                <Button variant="outline" className="min-w-[120px]">
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
