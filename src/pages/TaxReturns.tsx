
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, FileText, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import PageTransition from '@/components/shared/PageTransition';
import TaxReturnsList from '@/components/tax-returns/TaxReturnsList';
import TaxReturnDetail from '@/components/tax-returns/TaxReturnDetail';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { TaxReturn, createTaxReturn } from '@/services/taxReturnService';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

const TaxReturns: React.FC = () => {
  const location = useLocation();
  const initialSelectedId = location.state?.selectedId || null;
  const [selectedTaxReturn, setSelectedTaxReturn] = useState<number | null>(initialSelectedId);
  const [showNewTaxReturnDialog, setShowNewTaxReturnDialog] = useState(false);
  const { toast } = useToast();

  const { refetch } = useQuery({
    queryKey: ['taxReturns'],
    queryFn: () => [], // This is just a placeholder since we're using mock data
    enabled: false, // Disable auto-fetching since we're using mock data
  });

  useEffect(() => {
    if (location.state?.selectedId) {
      setSelectedTaxReturn(location.state.selectedId);
      // Clear the state to avoid issues with refreshing
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleCreateNewTaxReturn = () => {
    // In a real app, this would create a new tax return with form data
    // For demo purposes, we'll just create a simple return and close the dialog
    
    const newTaxReturn: Omit<TaxReturn, 'id'> = {
      clientId: 106,
      clientName: 'New Client',
      taxYear: '2023-2024',
      status: 'pending',
      dueDate: '2024-10-31',
      totalIncome: 0,
      totalDeductions: 0,
      taxPayable: 0,
      refundAmount: 0,
      documents: [],
      timeline: [
        {
          date: new Date().toISOString().split('T')[0],
          action: 'Tax return created',
          user: 'Current User'
        }
      ]
    };
    
    createTaxReturn(newTaxReturn)
      .then(response => {
        toast({
          title: "Success",
          description: "New tax return created successfully"
        });
        setShowNewTaxReturnDialog(false);
        refetch(); // Refresh the tax returns list
        // In a real app, we would update the list and select the new return
      })
      .catch(error => {
        toast({
          title: "Error",
          description: "Failed to create new tax return",
          variant: "destructive"
        });
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 ml-16 md:ml-64">
        <PageTransition>
          <main className="page-container py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Tax Returns</h1>
                <p className="text-gray-500 mt-1">Manage client tax returns and submissions.</p>
              </div>
              
              <div>
                <Dialog open={showNewTaxReturnDialog} onOpenChange={setShowNewTaxReturnDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-accent hover:bg-blue-accent/90">
                      <Plus size={16} className="mr-1.5" />
                      <span>New Tax Return</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Tax Return</DialogTitle>
                      <DialogDescription>
                        Start a new tax return for a client. This will create a blank return that you can fill in.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                      {/* In a real app, we would have a form here to collect client info */}
                      <p className="text-gray-500 mb-4">
                        For demo purposes, this will create a tax return for a new client.
                      </p>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowNewTaxReturnDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="bg-blue-accent hover:bg-blue-accent/90"
                        onClick={handleCreateNewTaxReturn}
                      >
                        Create Tax Return
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="lg:sticky lg:top-6">
                  <TaxReturnsList onSelectTaxReturn={setSelectedTaxReturn} selectedId={selectedTaxReturn} />
                </div>
              </div>
              
              <div className="lg:col-span-2 order-1 lg:order-2 mb-6 lg:mb-0">
                {selectedTaxReturn ? (
                  <TaxReturnDetail taxReturnId={selectedTaxReturn} />
                ) : (
                  <div className="bg-white rounded-xl shadow-card p-6 sm:p-8 h-full flex items-center justify-center">
                    <div className="text-center">
                      <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-700 mb-2">Select a Tax Return</h3>
                      <p className="text-gray-500 max-w-md">
                        Choose a tax return from the list to view details or create a new tax return to get started.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </PageTransition>
      </div>
    </div>
  );
};

export default TaxReturns;
