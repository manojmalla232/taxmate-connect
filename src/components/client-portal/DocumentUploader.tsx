
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, File, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type Document = {
  id: number;
  name: string;
  size: string;
  type: string;
  status: 'uploaded' | 'verified' | 'rejected' | 'pending';
  uploadDate: string;
};

const DocumentUploader: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  
  // Sample documents
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      name: 'Payment_Summary_2024.pdf',
      size: '1.2 MB',
      type: 'pdf',
      status: 'verified',
      uploadDate: '2024-08-05'
    },
    {
      id: 2,
      name: 'Bank_Statement_July.pdf',
      size: '3.5 MB',
      type: 'pdf',
      status: 'pending',
      uploadDate: '2024-08-12'
    }
  ]);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  const handleFiles = (files: FileList) => {
    setUploading(true);
    
    // Simulate upload time
    setTimeout(() => {
      const newDocuments = Array.from(files).map((file, index) => ({
        id: documents.length + index + 1,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
        status: 'pending' as const,
        uploadDate: new Date().toISOString().split('T')[0]
      }));
      
      setDocuments([...documents, ...newDocuments]);
      setUploading(false);
      
      toast({
        title: 'Documents uploaded',
        description: `Successfully uploaded ${files.length} document${files.length > 1 ? 's' : ''}`
      });
    }, 1500);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'rejected':
        return <X size={16} className="text-red-500" />;
      case 'pending':
        return <Clock size={16} className="text-amber-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-400" />;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending Review';
      default:
        return 'Unknown';
    }
  };
  
  const handleDelete = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: 'Document removed',
      description: 'The document has been removed successfully'
    });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-card">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Upload Documents</h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Upload your supporting documents for your tax return.
        </p>
      </div>
      
      <div className="p-4 sm:p-6">
        {/* Document requirements */}
        <div className="bg-blue-light p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
          <h3 className="text-xs sm:text-sm font-medium text-blue-accent mb-2">Required Documents</h3>
          <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
            <li className="flex items-start sm:items-center">
              <FileText size={12} className="text-blue-accent mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
              <span>Payment summary or income statement from each employer</span>
            </li>
            <li className="flex items-start sm:items-center">
              <FileText size={12} className="text-blue-accent mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
              <span>Bank statements showing interest earned</span>
            </li>
            <li className="flex items-start sm:items-center">
              <FileText size={12} className="text-blue-accent mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
              <span>Receipts for any work-related expenses or deductions</span>
            </li>
            <li className="flex items-start sm:items-center">
              <FileText size={12} className="text-blue-accent mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
              <span>Medicare levy exemption certificate (if applicable)</span>
            </li>
          </ul>
        </div>
        
        {/* Upload area */}
        <form
          onDragEnter={handleDrag}
          className="mb-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <label
            className={`relative flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              dragActive ? 'border-blue-accent bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload size={40} className={dragActive ? 'text-blue-accent' : 'text-gray-400'} />
              <p className="mb-2 text-sm text-gray-700 mt-2">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF, JPG, or PNG (max 10MB per file)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              disabled={uploading}
            />
            {dragActive && (
              <div
                className="absolute inset-0 w-full h-full"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              ></div>
            )}
          </label>
        </form>
        
        {uploading && (
          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">Uploading...</span>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <motion.div 
                  className="bg-blue-accent h-2.5 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5 }}
                ></motion.div>
              </div>
            </div>
          </div>
        )}
        
        {/* Document list */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Uploaded Documents</h3>
          
          {documents.map((doc) => (
            <div 
              key={doc.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-md border border-gray-200">
                  <File size={20} className="text-blue-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-800 truncate">{doc.name}</h4>
                  <div className="flex items-center mt-1 flex-wrap">
                    <span className="text-xs text-gray-500 mr-3">{doc.size}</span>
                    <span className="flex items-center text-xs">
                      {getStatusIcon(doc.status)}
                      <span className="ml-1 text-gray-600">{getStatusText(doc.status)}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleDelete(doc.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-100 transition-colors mt-2 sm:mt-0 self-end sm:self-center"
                aria-label="Delete document"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
