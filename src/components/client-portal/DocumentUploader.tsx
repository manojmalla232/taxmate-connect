
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
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Upload Documents</h2>
        <p className="text-gray-600 mt-1">
          Upload your supporting documents for your tax return.
        </p>
      </div>
      
      <div className="p-6">
        {/* Document requirements */}
        <div className="bg-blue-light p-4 rounded-lg mb-6">
          <h3 className="text-sm font-medium text-blue-accent mb-2">Required Documents</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li className="flex items-center">
              <FileText size={14} className="text-blue-accent mr-2" />
              <span>Payment summary or income statement from each employer</span>
            </li>
            <li className="flex items-center">
              <FileText size={14} className="text-blue-accent mr-2" />
              <span>Bank statements showing interest earned</span>
            </li>
            <li className="flex items-center">
              <FileText size={14} className="text-blue-accent mr-2" />
              <span>Receipts for any work-related expenses or deductions</span>
            </li>
            <li className="flex items-center">
              <FileText size={14} className="text-blue-accent mr-2" />
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
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Your Documents</h3>
          
          {documents.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded On
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-md flex items-center justify-center">
                            <File size={16} className="text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                            <div className="text-xs text-gray-500">{doc.type.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.uploadDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(doc.status)}
                          <span className="ml-1.5 text-sm text-gray-700">
                            {getStatusText(doc.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => handlePreviewDocument(doc)}
                            title="Preview document"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(doc.id)}
                            title="Remove document"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No documents uploaded yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
