import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle, Clock, Search, Calendar } from 'lucide-react';
import { TaxReturn } from '@/services/taxReturnService';
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
  onSelectTaxReturn: (id: string) => void;
  selectedId: string | null;
  taxReturns: TaxReturn[];
}

const TaxReturnsList: React.FC<TaxReturnsListProps> = ({ onSelectTaxReturn, selectedId, taxReturns }) => {
  const [filteredReturns, setFilteredReturns] = useState<TaxReturn[]>(taxReturns);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
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

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-3 xs:p-4 border-b border-gray-100">
        <h3 className="font-medium text-gray-900 text-sm xs:text-base mb-2 xs:mb-3">Tax Returns</h3>
        
        <div className="space-y-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search returns..."
              className="pl-8 xs:pl-9 text-xs xs:text-sm h-8 xs:h-9 py-1 xs:py-2"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-full text-xs xs:text-sm h-8 xs:h-9">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="text-xs xs:text-sm">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-[500px] xs:max-h-[600px]">
        {filteredReturns.length === 0 ? (
          <div className="p-4 xs:p-6 sm:p-8 text-center text-gray-500 text-xs xs:text-sm">
            No tax returns found matching your criteria.
          </div>
        ) : (
          filteredReturns.map((taxReturn) => (
            <motion.div 
              key={taxReturn.id}
              className={`p-3 xs:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedId === taxReturn.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => onSelectTaxReturn(taxReturn.id)}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1.5 xs:gap-2 sm:gap-0">
                <div className="flex items-center space-x-2 xs:space-x-3">
                  <div className="p-1.5 xs:p-2 bg-blue-50 rounded-full">
                    <FileText size={16} className="text-blue-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-xs xs:text-sm sm:text-base">{taxReturn.clientName}</h4>
                    <p className="text-xs text-gray-500">{taxReturn.taxYear}</p>
                  </div>
                </div>
                
                <div className={`text-xs px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-full flex items-center border self-start xs:self-center ${getStatusClass(taxReturn.status)}`}>
                  {getStatusIcon(taxReturn.status)}
                  <span className="ml-1 xs:ml-1.5 capitalize text-[10px] xs:text-xs">{taxReturn.status.replace('-', ' ')}</span>
                </div>
              </div>
              
              <div className="mt-1.5 xs:mt-2 flex flex-wrap gap-1.5 xs:gap-2 xs:justify-between xs:items-center">
                <div className="text-[10px] xs:text-xs text-gray-500 flex items-center">
                  <Calendar size={10} className="mr-0.5 xs:mr-1" />
                  Due: {taxReturn.dueDate}
                </div>
                {taxReturn.visaType && (
                  <div className="text-[10px] xs:text-xs bg-gray-100 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded">
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
