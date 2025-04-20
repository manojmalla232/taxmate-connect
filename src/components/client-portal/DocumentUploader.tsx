import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, File, FileText, CheckCircle, Clock, AlertCircle, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase, uploadDocument } from '@/services/taxReturnService';
import DocumentPreview from './DocumentPreview';

// Props: taxReturnId, userId
interface DocumentUploaderProps {
  taxReturnId: string;
  userId: string;
}

type DocumentRow = {
  id: string;
  file_name: string;
  file_url: string;
  status: 'uploaded' | 'verified' | 'rejected' | 'pending';
  uploaded_at: string;
  size?: string;
};

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ taxReturnId, userId }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [previewDoc, setPreviewDoc] = useState<DocumentRow | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line
  }, [taxReturnId]);

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('tax_return_id', taxReturnId)
      .order('uploaded_at', { ascending: false });
    if (!error && data) setDocuments(data);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
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

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadDocument(taxReturnId, file, userId);
      }
      toast({ title: 'Documents uploaded', description: `Successfully uploaded ${files.length} document${files.length > 1 ? 's' : ''}` });
      fetchDocuments();
    } catch (e: any) {
      toast({ title: 'Upload failed', description: e.message || 'An error occurred', variant: 'destructive' });
    }
    setUploading(false);
  };

  const handleDelete = async (doc: DocumentRow) => {
    // Remove from storage
    await supabase.storage.from('documents').remove([doc.file_url]);
    // Remove from DB
    await supabase.from('documents').delete().eq('id', doc.id);
    toast({ title: 'Document removed', description: 'The document has been removed successfully' });
    fetchDocuments();
  };

  const getSignedUrl = async (filePath: string) => {
    const { data } = await supabase.storage.from('documents').createSignedUrl(filePath, 60 * 10);
    return data?.signedUrl || '';
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
            <li className="flex items-start sm:items-center"><FileText size={12} className="text-blue-accent mr-2 mt-0.5 sm:mt-0 flex-shrink-0" /><span>Payment summary or income statement from each employer</span></li>
            <li className="flex items-start sm:items-center"><FileText size={12} className="text-blue-accent mr-2 mt-0.5 sm:mt-0 flex-shrink-0" /><span>Bank statements showing interest earned</span></li>
            <li className="flex items-start sm:items-center"><FileText size={12} className="text-blue-accent mr-2 mt-0.5 sm:mt-0 flex-shrink-0" /><span>Receipts for any work-related expenses or deductions</span></li>
            <li className="flex items-start sm:items-center"><FileText size={12} className="text-blue-accent mr-2 mt-0.5 sm:mt-0 flex-shrink-0" /><span>Medicare levy exemption certificate (if applicable)</span></li>
          </ul>
        </div>
        {/* Upload area */}
        <form onDragEnter={handleDrag} className="mb-6" onSubmit={e => e.preventDefault()}>
          <label className={`relative flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${dragActive ? 'border-blue-accent bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload size={40} className={dragActive ? 'text-blue-accent' : 'text-gray-400'} />
              <p className="mb-2 text-sm text-gray-700 mt-2"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500">PDF, JPG, or PNG (max 10MB per file)</p>
            </div>
            <input type="file" className="hidden" onChange={handleFileChange} multiple accept=".pdf,.jpg,.jpeg,.png" disabled={uploading} />
            {dragActive && (
              <div className="absolute inset-0 w-full h-full" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>
            )}
          </label>
        </form>
        {uploading && (<div className="mb-6">Uploading...</div>)}
        {/* Document list */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2 text-gray-800">Your Documents</h3>
          {documents.length === 0 ? (
            <div className="text-gray-500 text-sm">No documents uploaded yet.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {documents.map(doc => (
                <li key={doc.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <File size={18} className="text-blue-400" />
                    <span className="font-medium text-gray-800">{doc.file_name}</span>
                    <span className="text-xs text-gray-500">{doc.uploaded_at?.slice(0,10)}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Button size="icon" variant="ghost" onClick={async () => setPreviewDoc(doc)} title="Preview"><Eye size={16} /></Button>
                    <Button size="icon" variant="ghost" onClick={async () => { const url = await getSignedUrl(doc.file_url); window.open(url, '_blank'); }} title="Download"><Download size={16} /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(doc)} title="Delete"><X size={16} /></Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Preview modal */}
        {previewDoc && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl w-full relative">
              <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => setPreviewDoc(null)}><X /></Button>
              <DocumentPreview document={{ name: previewDoc.file_name, type: previewDoc.file_name.split('.').pop() || '', url: previewDoc.file_url }} onClose={() => setPreviewDoc(null)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUploader;
