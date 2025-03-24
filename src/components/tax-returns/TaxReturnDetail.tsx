
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
          <div className="flex overflow-x-auto">
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
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-900 mr-3">{taxReturn.clientName}</h2>
              {getStatusBadge(taxReturn.status)}
            </div>
            <div className="flex items-center text-gray-500">
              <Calendar size={16} className="mr-1.5" />
              <span className="text-sm">{taxReturn.taxYear} • Due {taxReturn.dueDate}</span>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center">
              <Download size={16} className="mr-1.5" />
              <span>Export PDF</span>
            </Button>
            <Button className="bg-blue-accent hover:bg-blue-accent/90 flex items-center">
              <PenLine size={16} className="mr-1.5" />
              <span>Edit Return</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="border-b border-gray-100">
        <div className="flex overflow-x-auto">
          <button 
            className={`px-6 py-4 text-sm font-medium ${activeTab === 'overview' ? 'text-blue-accent border-b-2 border-blue-accent' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`px-6 py-4 text-sm font-medium ${activeTab === 'documents' ? 'text-blue-accent border-b-2 border-blue-accent' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
          <button 
            className={`px-6 py-4 text-sm font-medium ${activeTab === 'timeline' ? 'text-blue-accent border-b-2 border-blue-accent' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('timeline')}
          >
            Timeline
          </button>
          <button 
            className={`px-6 py-4 text-sm font-medium ${activeTab === 'notes' ? 'text-blue-accent border-b-2 border-blue-accent' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2 text-gray-500 text-sm">
                  <User size={16} className="mr-1.5" />
                  <span>Client Details</span>
                </div>
                <p className="font-medium text-gray-900">{taxReturn.clientName}</p>
                {taxReturn.visaType && (
                  <p className="text-sm text-gray-500">Visa Type: {taxReturn.visaType}</p>
                )}
                {taxReturn.residencyStatus && (
                  <p className="text-sm text-gray-500">Residency Status: {taxReturn.residencyStatus}</p>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2 text-gray-500 text-sm">
                  <Calendar size={16} className="mr-1.5" />
                  <span>Tax Period</span>
                </div>
                <p className="font-medium text-gray-900">{taxReturn.taxYear}</p>
                <p className="text-sm text-gray-500">Due Date: {taxReturn.dueDate}</p>
                {taxReturn.submissionDate && (
                  <p className="text-sm text-green-600">Submitted: {taxReturn.submissionDate}</p>
                )}
              </div>
            </div>
            
            <h3 className="font-medium text-lg text-gray-900 mb-4">Tax Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Total Income</div>
                <div className="text-xl font-semibold text-gray-900">${taxReturn.totalIncome.toLocaleString()}</div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Deductions</div>
                <div className="text-xl font-semibold text-gray-900">${taxReturn.totalDeductions.toLocaleString()}</div>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Tax Payable</div>
                <div className="text-xl font-semibold text-gray-900">${taxReturn.taxPayable.toLocaleString()}</div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Refund Amount</div>
                <div className="text-xl font-semibold text-green-600">${taxReturn.refundAmount.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'documents' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg text-gray-900">Supporting Documents</h3>
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                />
                <Button variant="outline" className="flex items-center">
                  <Upload size={16} className="mr-1.5" />
                  <span>Upload Document</span>
                </Button>
              </div>
            </div>
            
            {taxReturn.documents.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-lg">
                <FileText size={32} className="text-gray-300 mx-auto mb-2" />
                <h4 className="text-gray-700 font-medium mb-1">No Documents Yet</h4>
                <p className="text-gray-500 text-sm">
                  Upload supporting documents to complete this tax return.
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Upload Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {taxReturn.documents.map((doc) => (
                      <tr key={doc.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText size={16} className="text-gray-400 mr-2" />
                            <span className="text-gray-900">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.uploadDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-accent hover:text-blue-800">
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'timeline' && (
          <div>
            <h3 className="font-medium text-lg text-gray-900 mb-4">Activity Timeline</h3>
            {taxReturn.timeline.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-lg">
                <Clock size={32} className="text-gray-300 mx-auto mb-2" />
                <h4 className="text-gray-700 font-medium mb-1">No Activity Yet</h4>
                <p className="text-gray-500 text-sm">
                  Activity will be recorded as you work on this tax return.
                </p>
              </div>
            ) : (
              <div className="relative border-l-2 border-gray-200 pl-6 ml-3 space-y-6">
                {taxReturn.timeline.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-9 top-1 w-4 h-4 rounded-full bg-blue-accent border-2 border-white"></div>
                    <div className="mb-1 text-sm text-gray-500">{item.date}</div>
                    <div className="font-medium text-gray-900">{item.action}</div>
                    <div className="text-sm text-gray-500">by {item.user}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'notes' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg text-gray-900">Notes</h3>
              {!isAddingNote && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center"
                  onClick={() => setIsAddingNote(true)}
                >
                  <Plus size={14} className="mr-1.5" />
                  <span>Add Note</span>
                </Button>
              )}
            </div>
            
            {isAddingNote && (
              <div className="mb-4">
                <Textarea
                  placeholder="Enter your note here..."
                  className="mb-2"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewNote('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-blue-accent hover:bg-blue-accent/90"
                    onClick={handleAddNote}
                  >
                    Save Note
                  </Button>
                </div>
              </div>
            )}
            
            {!taxReturn.notes ? (
              <div className="p-8 text-center bg-gray-50 rounded-lg">
                <PenLine size={32} className="text-gray-300 mx-auto mb-2" />
                <h4 className="text-gray-700 font-medium mb-1">No Notes Yet</h4>
                <p className="text-gray-500 text-sm">
                  Add notes about special circumstances or important details for this tax return.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-line">
                <p className="text-gray-700">{taxReturn.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxReturnDetail;
