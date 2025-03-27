
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Dummy data for demonstration
const clientsData = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah.j@example.com', visaType: '482 Visa', taxReturns: 3, status: 'active' },
  { id: 2, name: 'Michael Chen', email: 'mchen@example.com', visaType: 'Student Visa', taxReturns: 1, status: 'active' },
  { id: 3, name: 'Emma Rodriguez', email: 'erodriguez@example.com', visaType: 'Working Holiday', taxReturns: 2, status: 'pending' },
  { id: 4, name: 'David Smith', email: 'dsmith@example.com', visaType: '189 Visa', taxReturns: 4, status: 'active' },
  { id: 5, name: 'Sophia Patel', email: 'spatel@example.com', visaType: '485 Visa', taxReturns: 2, status: 'active' },
];

const ClientList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const filteredClients = clientsData.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.visaType.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedClients = [...filteredClients].sort((a, b) => {
    // Type assertion to access dynamic properties
    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    } else {
      // For numeric values
      return sortDirection === 'asc' 
        ? (aValue as number) - (bValue as number) 
        : (bValue as number) - (aValue as number);
    }
  });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-3 xs:p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 xs:gap-3 sm:gap-4">
          <h2 className="text-lg xs:text-xl font-semibold text-gray-900">Recent Clients</h2>
          
          <div className="flex flex-col xs:flex-row xs:items-center space-y-2 xs:space-y-0 xs:space-x-2 sm:space-x-3">
            <div className="relative w-full xs:w-auto">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full xs:w-auto pl-9 pr-3 xs:pr-4 py-1.5 xs:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-accent focus:border-transparent text-xs xs:text-sm"
              />
            </div>
            
            <Button className="bg-blue-accent hover:bg-blue-accent/90 text-xs xs:text-sm py-1.5 xs:py-2 h-auto">
              <Plus size={14} className="mr-1 xs:mr-1.5" />
              <span>Add Client</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Desktop view - Table */}
      <div className="hidden md:block overflow-x-auto pb-2 scrollbar-none">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-gray-50">
              <th 
                className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center space-x-1">
                  <span>Email</span>
                  {sortField === 'email' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('visaType')}
              >
                <div className="flex items-center space-x-1">
                  <span>Visa Type</span>
                  {sortField === 'visaType' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('taxReturns')}
              >
                <div className="flex items-center space-x-1">
                  <span>Tax Returns</span>
                  {sortField === 'taxReturns' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sortedClients.length > 0 ? (
              sortedClients.map((client) => (
                <motion.tr 
                  key={client.id} 
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                  variants={itemVariants}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {client.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-light text-blue-accent">
                      {client.visaType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {client.taxReturns}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      client.status === 'active' 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-amber-50 text-amber-600'
                    }`}>
                      {client.status === 'active' ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-gray-500 hover:text-blue-accent transition-colors"
                      aria-label="More options"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No clients found matching your search criteria.
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </div>

      {/* Mobile view - Cards */}
      <div className="md:hidden">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {sortedClients.length > 0 ? (
            sortedClients.map((client) => (
              <motion.div
                key={client.id}
                className="bg-white border border-gray-200 rounded-lg p-2 xs:p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
                variants={itemVariants}
              >
                <div className="flex justify-between items-start mb-1.5 xs:mb-2">
                  <div className="font-medium text-gray-900 text-xs xs:text-sm sm:text-base">{client.name}</div>
                  <span className={`px-1.5 py-0.5 xs:px-2 xs:py-0.5 sm:px-2.5 sm:py-1 text-xs font-medium rounded-full ${client.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                    {client.status === 'active' ? 'Active' : 'Pending'}
                  </span>
                </div>
                
                <div className="text-xs text-gray-700 mb-1.5 xs:mb-2">{client.email}</div>
                
                <div className="flex flex-wrap gap-1.5 xs:gap-2 mb-1.5 xs:mb-2">
                  <span className="px-1.5 py-0.5 xs:px-2 xs:py-0.5 sm:px-2.5 sm:py-1 text-xs font-medium rounded-full bg-blue-light text-blue-accent">
                    {client.visaType}
                  </span>
                  <span className="px-1.5 py-0.5 xs:px-2 xs:py-0.5 sm:px-2.5 sm:py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                    {client.taxReturns} Tax Returns
                  </span>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    className="text-gray-500 hover:text-blue-accent transition-colors p-1.5 sm:p-2"
                    aria-label="More options"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-6 sm:py-8 text-center text-gray-500">
              No clients found matching your search criteria.
            </div>
          )}
        </motion.div>
      </div>
      
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 text-xs sm:text-sm text-gray-500">
        Showing {sortedClients.length} of {clientsData.length} clients
      </div>
    </div>
  );
};

export default ClientList;
