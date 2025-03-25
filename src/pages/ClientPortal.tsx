
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, MessageSquare, Calendar, LogOut, User, AlertCircle, Settings, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import AnimatedLogo from '@/components/ui/AnimatedLogo';
import PageTransition from '@/components/shared/PageTransition';
import ClientTaxForm from '@/components/client-portal/ClientTaxForm';
import DocumentUploader from '@/components/client-portal/DocumentUploader';
import MessageCenter from '@/components/client-portal/MessageCenter';
import VisaInfo from '@/components/client-portal/VisaInfo';
import ProfileSettings from '@/components/client-portal/ProfileSettings';
import NotificationCenter from '@/components/client-portal/NotificationCenter';
import AppointmentScheduler from '@/components/client-portal/AppointmentScheduler';
import PaymentIntegration from '@/components/client-portal/PaymentIntegration';

// Sample client data
const clientData = {
  name: "Sarah Johnson",
  email: "demo@example.com",
  visaType: "482 Visa",
  agentName: "Michael Chen",
  taxReturns: [
    { 
      id: 1, 
      taxYear: '2023-2024', 
      status: 'in-progress', 
      dueDate: '2024-10-31',
      progress: 60
    }
  ]
};

const ClientPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
    navigate('/client-login');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <AnimatedLogo size="sm" />
                <span className="font-semibold text-base sm:text-lg truncate max-w-[120px] sm:max-w-none">TaxMate Portal</span>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <NotificationCenter />
                <div className="text-sm text-right hidden sm:block">
                  <div className="text-gray-900 font-medium">{clientData.name}</div>
                  <div className="text-gray-500">{clientData.visaType}</div>
                </div>
                <div className="h-9 w-9 rounded-full bg-blue-light text-blue-accent flex items-center justify-center">
                  <User size={18} />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleLogout}
                  aria-label="Log out"
                  className="hidden sm:flex"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome banner */}
          <motion.div 
            className="bg-white border border-blue-100 rounded-xl p-6 mb-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Welcome, {clientData.name}</h1>
                <p className="text-gray-600 mt-1">Your tax return for FY 2023-2024 is in progress.</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm text-gray-500">Your tax agent:</p>
                  <p className="font-medium">{clientData.agentName}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-blue-accent text-blue-accent hover:bg-blue-light"
                  onClick={() => setActiveTab('messages')}
                >
                  <MessageSquare size={16} className="mr-1.5" />
                  <span>Message Agent</span>
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Tax return progress */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <motion.div 
              className="md:col-span-3 bg-white rounded-xl shadow-card p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Your 2023-2024 Tax Return</h2>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-600">
                  In Progress
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Completion Progress</span>
                    <span className="font-medium">{clientData.taxReturns[0].progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className="bg-blue-accent h-2.5 rounded-full" 
                      style={{ width: `${clientData.taxReturns[0].progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-1.5" />
                  <span>Due by: {clientData.taxReturns[0].dueDate}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button 
                    onClick={() => setActiveTab('tax-form')}
                    className="bg-blue-accent hover:bg-blue-accent/90"
                  >
                    Continue Tax Return
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('documents')}
                  >
                    Upload Documents
                  </Button>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-card p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('documents')}
                >
                  <Upload size={16} className="mr-1.5" />
                  <span>Upload Documents</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('messages')}
                >
                  <MessageSquare size={16} className="mr-1.5" />
                  <span>Message Agent</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('visa-info')}
                >
                  <FileText size={16} className="mr-1.5" />
                  <span>Visa Tax Information</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('appointments')}
                >
                  <Calendar size={16} className="mr-1.5" />
                  <span>Schedule Appointment</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('payments')}
                >
                  <CreditCard size={16} className="mr-1.5" />
                  <span>Payments & Invoices</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('profile-settings')}
                >
                  <Settings size={16} className="mr-1.5" />
                  <span>Profile Settings</span>
                </Button>
              </div>
            </motion.div>
          </div>
          
          {/* Main tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto pb-2 mb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              <TabsList className="inline-flex min-w-full md:grid md:grid-cols-8 mb-4 gap-1 p-1">
                <TabsTrigger value="overview" className="text-sm whitespace-nowrap">Overview</TabsTrigger>
                <TabsTrigger value="tax-form" className="text-sm whitespace-nowrap">Tax Return</TabsTrigger>
                <TabsTrigger value="documents" className="text-sm whitespace-nowrap">Documents</TabsTrigger>
                <TabsTrigger value="messages" className="text-sm whitespace-nowrap">Messages</TabsTrigger>
                <TabsTrigger value="visa-info" className="text-sm whitespace-nowrap">Visa Info</TabsTrigger>
                <TabsTrigger value="appointments" className="text-sm whitespace-nowrap">Appointments</TabsTrigger>
                <TabsTrigger value="payments" className="text-sm whitespace-nowrap">Payments</TabsTrigger>
                <TabsTrigger value="profile-settings" className="text-sm whitespace-nowrap">Profile</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="overview" className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Next Steps</h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex">
                      <AlertCircle size={20} className="text-amber-600 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-amber-800 font-medium">Action Required</p>
                        <p className="text-amber-700 text-sm mt-1">
                          Please complete your income details and upload your payment summaries 
                          to proceed with your tax return.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Current Visa Type</h4>
                    <p className="text-lg font-medium">{clientData.visaType}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Tax Agent</h4>
                    <p className="text-lg font-medium">{clientData.agentName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Due Date</h4>
                    <p className="text-lg font-medium">{clientData.taxReturns[0].dueDate}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tax-form">
              <ClientTaxForm />
            </TabsContent>
            
            <TabsContent value="documents">
              <DocumentUploader />
            </TabsContent>
            
            <TabsContent value="messages">
              <MessageCenter />
            </TabsContent>
            
            <TabsContent value="visa-info">
              <VisaInfo visaType={clientData.visaType} />
            </TabsContent>
            
            <TabsContent value="appointments">
              <AppointmentScheduler />
            </TabsContent>
            
            <TabsContent value="payments">
              <PaymentIntegration />
            </TabsContent>
            
            <TabsContent value="profile-settings">
              <ProfileSettings clientData={clientData} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </PageTransition>
  );
};

export default ClientPortal;
