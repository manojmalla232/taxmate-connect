import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { getProfile, updateProfile } from '@/services/profileService';
import PortalHeader from '@/components/layout/PortalHeader';
import Sidebar from '@/components/layout/Sidebar';
import ClientStats from '@/components/client-portal/ClientStats';
import DocumentUploader from '@/components/client-portal/DocumentUploader';

const ClientPortal: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/client-login');
        return;
      }
      setUserId(user.id);
      try {
        const profileData = await getProfile(user.id);
        setProfile(profileData);
      } catch (error) {
        setProfile(null);
      }
      setLoading(false);
    })();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/client-login');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PortalHeader type="client" profileName={profile?.full_name || 'Client'} handleLogout={handleLogout} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 pb-20 md:pb-0 md:ml-16 lg:ml-64 px-4 md:px-6">
          <main className="page-container py-4 sm:py-6 md:py-10 max-w-7xl mx-auto">
            <h1 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Welcome, {profile?.full_name || 'Client'}!</h1>
            {/* Profile info and stats */}
            <div className="mb-8">
              <div className="bg-white rounded shadow p-4 mb-4">
                <div className="font-medium text-gray-700">Email: {profile?.email}</div>
                <div className="font-medium text-gray-700">Phone: {profile?.phone || 'N/A'}</div>
                <div className="font-medium text-gray-700">Visa Type: {profile?.visa_type || 'N/A'}</div>
                <Link to="/profile-edit" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Edit Profile</Link>
              </div>
            </div>
            <ClientStats userId={userId!} />
            {/* Document management section */}
            {userId && profile?.latest_tax_return_id && (
              <div className="mt-8">
                <DocumentUploader taxReturnId={profile.latest_tax_return_id} userId={userId} />
              </div>
            )}
            {/* Add more client portal sections here */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
