import React, { useState } from 'react';
import { Save, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface ProfileSettingsProps {
  clientData: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    taxFileNumber?: string;
    communicationPreferences?: {
      emailUpdates: boolean;
      smsNotifications: boolean;
      paperlessCorrespondence: boolean;
    };
  };
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ clientData }) => {
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: clientData.name || '',
    email: clientData.email || '',
    phone: clientData.phone || '',
    address: clientData.address || '',
    taxFileNumber: clientData.taxFileNumber || ''
  });

  const [communicationPreferences, setCommunicationPreferences] = useState({
    emailUpdates: clientData.communicationPreferences?.emailUpdates ?? true,
    smsNotifications: clientData.communicationPreferences?.smsNotifications ?? false,
    paperlessCorrespondence: clientData.communicationPreferences?.paperlessCorrespondence ?? true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the updated data to a backend API
    // For demo purposes, we'll just show a success toast
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully"
    });
  };

  const handleCommunicationUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the updated preferences to a backend API
    toast({
      title: "Preferences updated",
      description: "Your communication preferences have been updated successfully"
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Profile Settings</h2>
        <p className="text-sm sm:text-base text-gray-600">Update your personal information and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          <form onSubmit={handleProfileUpdate}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                  Full Name
                </label>
                <Input 
                  id="name" 
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  Email Address
                </label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                  Phone Number
                </label>
                <Input 
                  id="phone" 
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="taxFileNumber">
                  Tax File Number
                </label>
                <Input 
                  id="taxFileNumber" 
                  name="taxFileNumber"
                  value={profileData.taxFileNumber}
                  onChange={handleInputChange}
                  className="w-full"
                  type="password"
                />
                <p className="text-xs text-gray-500 mt-1">Your TFN is securely stored and only visible to your tax agent</p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">
                  Address
                </label>
                <Textarea 
                  id="address" 
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  className="w-full min-h-[80px]"
                />
              </div>
            </div>
            
            <Button type="submit" className="bg-blue-accent hover:bg-blue-accent/90">
              <Save size={16} className="mr-1.5" />
              <span>Save Changes</span>
            </Button>
          </form>
        </div>
        
        {/* Communication Preferences */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Communication Preferences</h3>
          <form onSubmit={handleCommunicationUpdate}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email Updates</h4>
                  <p className="text-sm text-gray-500">Receive updates about your tax return status</p>
                </div>
                <Switch 
                  checked={communicationPreferences.emailUpdates}
                  onCheckedChange={(checked) => setCommunicationPreferences({...communicationPreferences, emailUpdates: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                  <p className="text-sm text-gray-500">Receive text messages for important updates</p>
                </div>
                <Switch 
                  checked={communicationPreferences.smsNotifications}
                  onCheckedChange={(checked) => setCommunicationPreferences({...communicationPreferences, smsNotifications: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Paperless Correspondence</h4>
                  <p className="text-sm text-gray-500">Receive all tax documents electronically</p>
                </div>
                <Switch 
                  checked={communicationPreferences.paperlessCorrespondence}
                  onCheckedChange={(checked) => setCommunicationPreferences({...communicationPreferences, paperlessCorrespondence: checked})}
                />
              </div>
            </div>
            
            <div className="mt-8">
              <Button type="submit" className="bg-blue-accent hover:bg-blue-accent/90">
                <Save size={16} className="mr-1.5" />
                <span>Save Preferences</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;