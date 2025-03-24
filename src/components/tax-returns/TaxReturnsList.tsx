
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle, Clock, Search } from 'lucide-react';
import { TaxReturn, getTaxReturns } from '@/services/taxReturnService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaxReturnsListProps {
  onSelectTaxReturn: (id: number) => void;
  selectedId: number | null;
}

const TaxReturnsList: React.FC<TaxReturnsListProps> = ({ onSelectTaxReturn, selectedId }) => {
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>([]);
  const [filteredReturns, setFilteredReturns] = useState<TaxReturn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchTaxReturns = async () => {
      try {
        const data = await getTaxReturns();
        setTaxReturns(data);
        setFilteredReturns(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tax returns:', error);
        setIsLoading(false);
      }
    };

    fetchTaxReturns();
  }, []);

  useEffect(() => {
    // Apply filters whenever search query or status filter changes
    let results = taxReturns;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(taxReturn => taxReturn.status === statusFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(taxReturn => 
        taxReturn.clientName.toLowerCase().includes(query) || 
        taxReturn.taxYear.includes(query) ||
        (taxReturn.visaType && taxReturn.visaType.toLowerCase().includes(query))
      );
    }
    
    setFilteredReturns(results);
  }, [searchQuery, statusFilter, taxReturns]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const getStatusIcon = (status: TaxReturn['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'in-progress':
        return <Clock size={16} className="text-amber-500" />;
      case 'pending':
        return <AlertCircle size={16} className="text-red-500" />;
    }
  };

  const getStatusClass = (status: TaxReturn['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'in-progress':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'pending':
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-card p-8 text-center">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-20 bg-gray-100 rounded mb-4"></div>
          <div className="h-20 bg-gray-100 rounded mb-4"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-medium text-gray-900 mb-3">Tax Returns</h3>
        
        <div className="space-y-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search returns..."
              className="pl-9 text-sm"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-[600px]">
        {filteredReturns.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No tax returns found matching your criteria.
          </div>
        ) : (
          filteredReturns.map((taxReturn) => (
            <motion.div 
              key={taxReturn.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedId === taxReturn.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => onSelectTaxReturn(taxReturn.id)}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <FileText size={18} className="text-blue-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{taxReturn.clientName}</h4>
                    <p className="text-sm text-gray-500">{taxReturn.taxYear}</p>
                  </div>
                </div>
                
                <div className={`text-xs px-2.5 py-1 rounded-full flex items-center border ${getStatusClass(taxReturn.status)}`}>
                  {getStatusIcon(taxReturn.status)}
                  <span className="ml-1.5 capitalize">{taxReturn.status.replace('-', ' ')}</span>
                </div>
              </div>
              
              <div className="mt-2 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Due: {taxReturn.dueDate}
                </div>
                {taxReturn.visaType && (
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {taxReturn.visaType}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaxReturnsList;
