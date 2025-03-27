import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, CheckCircle, AlertCircle, Clock, User, DollarSign, Download, Upload, PenLine, XCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { TaxReturn, getTaxReturnById, updateTaxReturn, uploadDocument } from '@/services/taxReturnService';
import { Skeleton } from '@/components/ui/skeleton';

interface TaxReturnDetailProps {
  taxReturnId: number;
}

const TaxReturnDetail: React.FC<TaxReturnDetailProps> = ({ taxReturnId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [taxReturn, setTaxReturn] = useState<TaxReturn | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchTaxReturn = async () => {
      try {
        setIsLoading(true);
        const data = await getTaxReturnById(taxReturnId);
        setTaxReturn(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not fetch tax return details",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTaxReturn();
  }, [taxReturnId, toast]);

  const handleAddNote = async () => {
    if (!newNote.trim() || !taxReturn) return;
    
    try {
      // In a real app, this would update the note in the database
      await updateTaxReturn(taxReturn.id, { 
        notes: taxReturn.notes ? `${taxReturn.notes}\n\n${newNote}` : newNote 
      });
      
      // Update local state
      setTaxReturn({
        ...taxReturn,
        notes: taxReturn.notes ? `${taxReturn.notes}\n\n${newNote}` : newNote,
        timeline: [
          {
            date: new Date().toISOString().split('T')[0],
            action: 'Note added',
            user: 'Current User'
          },
          ...taxReturn.timeline
        ]
      });
      
      setNewNote('');
      setIsAddingNote(false);
      
      toast({
        title: "Success",
        description: "Note added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !taxReturn) return;
    
    const file = files[0];
    
    try {
      const newDocument = await uploadDocument(taxReturn.id, file);
      
      // Update local state
      setTaxReturn({
        ...taxReturn,
        documents: [...taxReturn.documents, newDocument],
        timeline: [
          {
            date: new Date().toISOString().split('T')[0],
            action: `Document "${file.name}" uploaded`,
            user: 'Current User'
          },
          ...taxReturn.timeline
        ]
      });
      
      toast({
        title: "Success",
        description: `Document "${file.name}" uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
    }
    
    // Clear the input
    event.target.value = '';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full flex items-center text-sm">
            <CheckCircle size={16} className="mr-1.5" />
            <span>Completed</span>
          </div>
        );
      case 'in-progress':
        return (
          <div className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full flex items-center text-sm">
            <Clock size={16} className="mr-1.5" />
            <span>In Progress</span>
          </div>
        );
      case 'pending':
        return (
          <div className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-full flex items-center text-sm">
            <AlertCircle size={16} className="mr-1.5" />
            <span>Pending</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="border-b border-gray-100">
          <div className="flex overflow-x-auto pb-1 scrollbar-none">
            <Skeleton className="h-10 w-20 mx-2" />
            <Skeleton className="h-10 w-20 mx-2" />
            <Skeleton className="h-10 w-20 mx-2" />
            <Skeleton className="h-10 w-20 mx-2" />
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!taxReturn) {
    return (
      <div className="bg-white rounded-xl shadow-card p-8 text-center">
        <XCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">Tax Return Not Found</h3>
        <p className="text-gray-500">
          The requested tax return could not be found. Please select another tax return from the list.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-3 xs:p-4 sm:p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="flex flex-col xs:flex-row xs:items-center mb-1.5 xs:mb-2">
              <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900 xs:mr-3">{taxReturn.clientName}</h2>
              <div className="mt-1.5 xs:mt-0">
                {getStatusBadge(taxReturn.status)}
              </div>
            </div>
            <div className="flex items-center text-gray-500 text-xs xs:text-sm">
              <Calendar size={12} className="mr-1 xs:mr-1.5" />
              <span>Tax Year: {taxReturn.taxYear}</span>
            </div>
          </div>
          
          <div className="mt-2 xs:mt-3 md:mt-0 flex flex-wrap gap-1.5 xs:gap-2">
            <Button variant="outline" size="sm" className="text-[10px] xs:text-xs h-7 xs:h-8 px-2 xs:px-3">
              <Download size={12} className="mr-1 xs:mr-1.5" />
              <span>Download</span>
            </Button>
            <Button variant="outline" size="sm" className="text-[10px] xs:text-xs h-7 xs:h-8 px-2 xs:px-3">
              <PenLine size={12} className="mr-1 xs:mr-1.5" />
              <span>Edit</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="border-b border-gray-100">
        <div className="flex overflow-x-auto scrollbar-none">
          <button
            className={`px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm font-medium border-b-2 ${activeTab === 'overview' ? 'border-blue-accent text-blue-accent' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm font-medium border-b-2 ${activeTab === 'documents' ? 'border-blue-accent text-blue-accent' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
          <button
            className={`px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm font-medium border-b-2 ${activeTab === 'timeline' ? 'border-blue-accent text-blue-accent' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('timeline')}
          >
            Timeline
          </button>
          <button
            className={`px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm font-medium border-b-2 ${activeTab === 'notes' ? 'border-blue-accent text-blue-accent' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </button>
        </div>
      </div>
      
      <div className="p-3 xs:p-4 sm:p-6">
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 sm:gap-6 mb-4 xs:mb-6 sm:mb-8">
              <div className="bg-gray-50 rounded-lg p-3 xs:p-4">
                <h3 className="text-xs xs:text-sm font-medium text-gray-700 mb-2 xs:mb-3">Client Information</h3>
                <div className="space-y-1.5 xs:space-y-2">
                  <div className="flex items-start">
                    <User size={14} className="text-gray-400 mt-0.5 mr-1.5 xs:mr-2" />
                    <div>
                      <p className="text-xs xs:text-sm font-medium text-gray-900">{taxReturn.clientName}</p>
                      <p className="text-[10px] xs:text-xs text-gray-500">Client ID: {taxReturn.clientId}</p>
                    </div>
                  </div>
                  {taxReturn.visaType && (
                    <div className="flex items-start">
                      <div className="text-gray-400 mt-0.5 mr-1.5 xs:mr-2 w-3.5 h-3.5 xs:w-4 xs:h-4 flex items-center justify-center">🌐</div>
                      <div>
                        <p className="text-xs xs:text-sm font-medium text-gray-900">Visa Type</p>
                        <p className="text-[10px] xs:text-xs text-gray-500">{taxReturn.visaType}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 xs:p-4">
                <h3 className="text-xs xs:text-sm font-medium text-gray-700 mb-2 xs:mb-3">Return Details</h3>
                <div className="space-y-1.5 xs:space-y-2">
                  <div className="flex items-start">
                    <Calendar size={14} className="text-gray-400 mt-0.5 mr-1.5 xs:mr-2" />
                    <div>
                      <p className="text-xs xs:text-sm font-medium text-gray-900">Tax Year</p>
                      <p className="text-[10px] xs:text-xs text-gray-500">{taxReturn.taxYear}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar size={14} className="text-gray-400 mt-0.5 mr-1.5 xs:mr-2" />
                    <div>
                      <p className="text-xs xs:text-sm font-medium text-gray-900">Due Date</p>
                      <p className="text-[10px] xs:text-xs text-gray-500">{taxReturn.dueDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-xs xs:text-sm font-medium text-gray-700 mb-2 xs:mb-3 sm:mb-4">Financial Summary</h3>
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
              <div className="bg-gray-50 rounded-lg p-2 xs:p-3 sm:p-4">
                <p className="text-[10px] xs:text-xs text-gray-500 mb-0.5 xs:mb-1">Total Income</p>
                <p className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900">${taxReturn.totalIncome.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 xs:p-3 sm:p-4">
                <p className="text-[10px] xs:text-xs text-gray-500 mb-0.5 xs:mb-1">Total Deductions</p>
                <p className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900">${taxReturn.totalDeductions.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 xs:p-3 sm:p-4">
                <p className="text-[10px] xs:text-xs text-gray-500 mb-0.5 xs:mb-1">Tax Payable</p>
                <p className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900">${taxReturn.taxPayable.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 xs:p-3 sm:p-4">
                <p className="text-[10px] xs:text-xs text-gray-500 mb-0.5 xs:mb-1">Refund Amount</p>
                <p className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900">${taxReturn.refundAmount.toLocaleString()}</p>
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'documents' && (
          <div>
            <div className="flex flex-col xs:flex-row justify-between xs:items-center mb-3 xs:mb-4">
              <h3 className="text-xs xs:text-sm font-medium text-gray-700 mb-2 xs:mb-0">Documents</h3>
              <div>
                <input
                  type="file"
                  id="document-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <label htmlFor="document-upload">
                  <Button variant="outline" size="sm" className="text-[10px] xs:text-xs h-7 xs:h-8 px-2 xs:px-3 w-full xs:w-auto">
                    <Upload size={12} className="mr-1 xs:mr-1.5" />
                    <span>Upload Document</span>
                  </Button>
                </label>
              </div>
            </div>
            
            {taxReturn.documents.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 xs:p-5 sm:p-6 text-center">
                <FileText size={20} className="text-gray-300 mx-auto mb-1.5 xs:mb-2" />
                <p className="text-xs xs:text-sm text-gray-500">No documents uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-1.5 xs:space-y-2">
                {taxReturn.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 xs:p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText size={14} className="text-gray-400 mr-1.5 xs:mr-2" />
                      <div>
                        <p className="text-xs xs:text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-[10px] xs:text-xs text-gray-500">{doc.uploadDate} • {doc.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[10px] xs:text-xs h-7 xs:h-8 px-1.5 xs:px-2">
                      <Download size={12} className="text-gray-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'timeline' && (
          <div>
            <h3 className="text-xs xs:text-sm font-medium text-gray-700 mb-2 xs:mb-3 sm:mb-4">Activity Timeline</h3>
            
            <div className="space-y-3 xs:space-y-4">
              {taxReturn.timeline.map((event, index) => (
                <div key={index} className="relative pl-5 xs:pl-6 pb-3 xs:pb-4">
                  {index !== taxReturn.timeline.length - 1 && (
                    <div className="absolute left-2 xs:left-2.5 top-2 xs:top-2.5 bottom-0 w-0.5 bg-gray-200"></div>
                  )}
                  <div className="absolute left-0 top-1.5 xs:top-2 w-4 h-4 xs:w-5 xs:h-5 rounded-full bg-blue-50 border-2 border-blue-accent flex items-center justify-center">
                    <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 rounded-full bg-blue-accent"></div>
                  </div>
                  <div>
                    <p className="text-xs xs:text-sm font-medium text-gray-900">{event.action}</p>
                    <div className="flex items-center text-[10px] xs:text-xs text-gray-500 mt-0.5 xs:mt-1">
                      <Calendar size={10} className="mr-0.5 xs:mr-1" />
                      <span>{event.date}</span>
                      <span className="mx-1 xs:mx-1.5">•</span>
                      <User size={10} className="mr-0.5 xs:mr-1" />
                      <span>{event.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'notes' && (
          <div>
            <div className="flex flex-col xs:flex-row justify-between xs:items-center mb-3 xs:mb-4">
              <h3 className="text-xs xs:text-sm font-medium text-gray-700 mb-2 xs:mb-0">Notes</h3>
              {!isAddingNote && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-[10px] xs:text-xs h-7 xs:h-8 px-2 xs:px-3 w-full xs:w-auto"
                  onClick={() => setIsAddingNote(true)}
                >
                  <Plus size={12} className="mr-1 xs:mr-1.5" />
                  <span>Add Note</span>
                </Button>
              )}
            </div>
            
            {isAddingNote && (
              <div className="mb-3 xs:mb-4 bg-gray-50 rounded-lg p-3 xs:p-4">
                <Textarea
                  placeholder="Enter your note here..."
                  className="min-h-[80px] xs:min-h-[100px] mb-2 xs:mb-3 text-xs xs:text-sm"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <div className="flex justify-end space-x-1.5 xs:space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-[10px] xs:text-xs h-7 xs:h-8 px-2 xs:px-3"
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewNote('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    className="text-[10px] xs:text-xs h-7 xs:h-8 px-2 xs:px-3 bg-blue-accent hover:bg-blue-accent/90"
                    onClick={handleAddNote}
                  >
                    Save Note
                  </Button>
                </div>
              </div>
            )}
            
            {!taxReturn.notes ? (
              <div className="bg-gray-50 rounded-lg p-4 xs:p-5 sm:p-6 text-center">
                <PenLine size={20} className="text-gray-300 mx-auto mb-1.5 xs:mb-2" />
                <p className="text-xs xs:text-sm text-gray-500">No notes added yet.</p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-3 xs:p-4">
                <pre className="text-xs xs:text-sm text-gray-700 whitespace-pre-wrap font-sans">{taxReturn.notes}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxReturnDetail;