import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, FileText, Upload, MessageSquare, Calendar, User, CreditCard, BadgeCheck, AlertCircle } from 'lucide-react';
import { Link, useNavigate, Routes, Route } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedLogo from '@/components/ui/AnimatedLogo';
import PageTransition from '@/components/shared/PageTransition';
import ClientTaxForm from '@/components/client-portal/ClientTaxForm';
import DocumentUploader from '@/components/client-portal/DocumentUploader';
import MessageCenter from '@/components/client-portal/MessageCenter';
import VisaInfo from '@/components/client-portal/VisaInfo';
import ProfileSettings from '@/components/client-portal/ProfileSettings';
import AppointmentScheduler from '@/components/client-portal/AppointmentScheduler';
import PaymentIntegration from '@/components/client-portal/PaymentIntegration';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import ClientStats from '@/components/client-portal/ClientStats';
import Sidebar from '@/components/layout/Sidebar';
import PortalHeader from '@/components/layout/PortalHeader';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

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
  const navigate = useNavigate();
  
  const handleLogout = () => {
    navigate('/client-login');
  };

  return (
    <ErrorBoundary>
      <PortalHeader type="client" profileName={clientData.name} />
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar (Agent Dashboard style, but with client menu) */}
        <Sidebar
          className=""
          primaryMenuItems={[
            { icon: Home, label: 'Overview', path: '/client-portal', tab: 'overview' },
            { icon: FileText, label: 'Tax', path: '/client-portal/tax-form', tab: 'tax-form' },
            { icon: Upload, label: 'Docs', path: '/client-portal/documents', tab: 'documents' },
            { icon: MessageSquare, label: 'Messages', path: '/client-portal/messages', tab: 'messages' },
          ]}
          secondaryMenuItems={[
            { icon: Calendar, label: 'Appointments', path: '/client-portal/appointments', tab: 'appointments' },
            { icon: BadgeCheck, label: 'Visa Info', path: '/client-portal/visa-info', tab: 'visa-info' },
            { icon: CreditCard, label: 'Payments', path: '/client-portal/payments', tab: 'payments' },
            { icon: User, label: 'Profile', path: '/client-portal/profile-settings', tab: 'profile-settings' },
          ]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {/* Main content area with nested routing */}
        <div className="flex-1 pb-20 md:pb-0 md:ml-16 lg:ml-64 px-4 md:px-6">
          <PageTransition>
            <Routes>
              <Route index element={<WelcomeCard userName={clientData.name} />} />
              <Route path="tax-form" element={<ClientTaxForm />} />
              <Route path="documents" element={<DocumentUploader />} />
              <Route path="messages" element={<MessageCenter />} />
              <Route path="appointments" element={<AppointmentScheduler />} />
              <Route path="visa-info" element={<VisaInfo visaType={clientData.visaType} />} />
              <Route path="payments" element={<PaymentIntegration />} />
              <Route path="profile-settings" element={<ProfileSettings clientData={clientData} />} />
              {/* Optionally add a fallback route for unknown subpages */}
              <Route path="*" element={<div className="p-8 text-center text-gray-500">Page not found.</div>} />
            </Routes>
          </PageTransition>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ClientPortal;
