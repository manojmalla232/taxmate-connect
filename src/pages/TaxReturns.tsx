import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, FileText, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import PageTransition from '@/components/shared/PageTransition';
import TaxReturnsList from '@/components/tax-returns/TaxReturnsList';
import TaxReturnDetail from '@/components/tax-returns/TaxReturnDetail';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getTaxReturns, createTaxReturn, updateTaxReturn, getTaxReturnById, uploadDocument } from '@/services/taxReturnService';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import PortalHeader from '@/components/layout/PortalHeader';
import { supabase } from '@/services/taxReturnService';

const TaxReturns: React.FC = () => {
  const location = useLocation();
  const initialSelectedId = location.state?.selectedId || null;
  const [selectedTaxReturn, setSelectedTaxReturn] = useState<string | null>(initialSelectedId);
  const [showNewTaxReturnDialog, setShowNewTaxReturnDialog] = useState(false);
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch current user id from Supabase auth
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    })();
  }, []);

  // Fetch tax returns for the current user
  const { data: taxReturns = [], refetch, isLoading } = useQuery({
    queryKey: ['taxReturns', userId],
    queryFn: () => userId ? getTaxReturns(userId) : Promise.resolve([]),
    enabled: !!userId,
  });

  useEffect(() => {
    if (location.state?.selectedId) {
      setSelectedTaxReturn(location.state.selectedId);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleCreateNewTaxReturn = async (payload: any) => {
    try {
      await createTaxReturn(payload);
      toast({ title: 'Success', description: 'New tax return created successfully' });
      setShowNewTaxReturnDialog(false);
      refetch();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PortalHeader type="agent" profileName="Agent" />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 pb-20 md:pb-0 md:ml-16 lg:ml-64 px-4 md:px-6">
          <PageTransition>
            <main className="page-container py-4 sm:py-6 md:py-10 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 xs:gap-3 sm:gap-4 mb-3 xs:mb-5 sm:mb-8">
                <div>
                  <h1 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-900">Tax Returns</h1>
                  <p className="text-xs xs:text-sm sm:text-base text-gray-500 mt-0.5 xs:mt-1">Manage client tax returns and submissions.</p>
                </div>
                <div className="w-full md:w-auto mt-1 md:mt-0">
                  <Dialog open={showNewTaxReturnDialog} onOpenChange={setShowNewTaxReturnDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-accent hover:bg-blue-accent/90 w-full md:w-auto text-xs h-9 xs:h-10">
                        <Plus size={14} className="mr-1 xs:mr-1.5" />
                        <span>New Tax Return</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-base xs:text-lg sm:text-xl">Create New Tax Return</DialogTitle>
                        <DialogDescription className="text-xs xs:text-sm">
                          Start a new tax return for a client. This will create a blank return that you can fill in.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-3 xs:py-4">
                        {/* In a real app, we would have a form here to collect client info */}
                        <p className="text-gray-500 mb-3 xs:mb-4 text-xs xs:text-sm">
                          For demo purposes, this will create a tax return for a new client.
                        </p>
                      </div>
                      <div className="flex flex-col xs:flex-row xs:justify-end space-y-2 xs:space-y-0 xs:space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowNewTaxReturnDialog(false)}
                          className="w-full xs:w-auto text-xs h-9 xs:h-10"
                        >
                          Cancel
                        </Button>
                        <Button 
                          className="bg-blue-accent hover:bg-blue-accent/90 w-full xs:w-auto text-xs h-9 xs:h-10"
                          onClick={() => handleCreateNewTaxReturn({
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
                          })}
                        >
                          Create Tax Return
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
                <div className="lg:col-span-1 order-2 lg:order-1">
                  <div className="lg:sticky lg:top-6">
                    <TaxReturnsList onSelectTaxReturn={setSelectedTaxReturn} selectedId={selectedTaxReturn} taxReturns={taxReturns} />
                  </div>
                </div>
                <div className="lg:col-span-2 order-1 lg:order-2 mb-3 xs:mb-4 sm:mb-6 lg:mb-0">
                  {selectedTaxReturn ? (
                    <TaxReturnDetail taxReturnId={selectedTaxReturn} />
                  ) : (
                    <div className="bg-white rounded-xl shadow-card p-3 xs:p-4 sm:p-6 md:p-8 h-full flex items-center justify-center">
                      <div className="text-center px-2 xs:px-4">
                        <FileText size={28} className="text-gray-300 mx-auto mb-2 xs:mb-3 sm:mb-4 xs:text-[36px] sm:text-[48px]" />
                        <h3 className="text-base xs:text-lg sm:text-xl font-medium text-gray-700 mb-1 xs:mb-2">Select a Tax Return</h3>
                        <p className="text-gray-500 max-w-md text-xs xs:text-sm sm:text-base">
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
    </div>
  );
};

export default TaxReturns;
