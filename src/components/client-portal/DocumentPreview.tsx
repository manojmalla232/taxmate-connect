import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentPreviewProps {
  document: {
    name: string;
    type: string;
    url?: string; // In a real app, this would be the URL to the document
  };
  onClose: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = document.type === 'pdf' ? 3 : 1; // Mock multi-page for PDFs
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };
  
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  
  // Determine the preview content based on file type
  const renderPreviewContent = () => {
    // In a real app, this would render the actual document
    // For this demo, we'll show placeholder content based on file type
    
    const placeholderStyle = {
      transform: `scale(${zoom}) rotate(${rotation}deg)`,
      transition: 'transform 0.3s ease'
    };
    
    if (document.type === 'pdf') {
      return (
        <div className="bg-white p-8 shadow-lg" style={placeholderStyle}>
          <div className="w-[600px] h-[800px] border border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl font-medium mb-2">{document.name}</p>
              <p className="text-gray-500">Page {currentPage} of {totalPages}</p>
              <div className="mt-8 w-full h-[600px] bg-gray-50 flex items-center justify-center">
                <p className="text-gray-400">PDF Preview - Page {currentPage}</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(document.type)) {
      return (
        <div className="bg-gray-800 p-4" style={placeholderStyle}>
          <div className="w-[600px] h-[600px] flex items-center justify-center">
            <div className="bg-gray-200 w-full h-full flex items-center justify-center">
              <p className="text-gray-500">Image Preview ({document.name})</p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white p-8 shadow-lg" style={placeholderStyle}>
          <div className="w-[600px] h-[800px] border border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl font-medium mb-2">{document.name}</p>
              <p className="text-gray-500">Preview not available for this file type</p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-full max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-t-lg p-4 flex items-center justify-between">
          <h3 className="font-medium truncate">{document.name}</h3>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => window.open('#', '_blank')}>
              <Download size={18} className="mr-1" />
              <span>Download</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={18} />
            </Button>
          </div>
        </div>
        
        {/* Preview content */}
        <div className="bg-gray-100 h-[70vh] overflow-auto flex items-center justify-center">
          {renderPreviewContent()}
        </div>
        
        {/* Controls */}
        <div className="bg-white rounded-b-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
            >
              <ZoomOut size={18} />
            </Button>
            <span className="text-sm">{Math.round(zoom * 100)}%</span>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleZoomIn}
              disabled={zoom >= 3}
            >
              <ZoomIn size={18} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleRotate}>
              <RotateCw size={18} />
            </Button>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
              </Button>
              <span className="text-sm">{currentPage} / {totalPages}</span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentPreview;