import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Lock, 
  CreditCard, 
  Users, 
  MessageSquare, 
  Save,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import PageTransition from '@/components/shared/PageTransition';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import PortalHeader from '@/components/layout/PortalHeader';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();
  
  const [profileSettings, setProfileSettings] = useState({
    name: 'John Anderson',
    email: 'john.anderson@example.com',
    company: 'Migration Tax Specialists',
    phone: '+61 4XX XXX XXX',
    bio: 'Tax accountant specializing in visa holders and migration services with over 10 years of experience.'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    deadlineReminders: true,
    clientMessages: true,
    marketingEmails: false
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Profile settings updated successfully"
    });
  };

  const handleNotificationUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Notification preferences saved"
    });
  };

  const renderProfileSettings = () => (
    <form onSubmit={handleProfileUpdate}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1" htmlFor="name">
            Full Name
          </label>
          <Input 
            id="name" 
            value={profileSettings.name}
            onChange={(e) => setProfileSettings({...profileSettings, name: e.target.value})}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            Email Address
          </label>
          <Input 
            id="email" 
            type="email" 
            value={profileSettings.email}
            onChange={(e) => setProfileSettings({...profileSettings, email: e.target.value})}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1" htmlFor="company">
            Company Name
          </label>
          <Input 
            id="company" 
            value={profileSettings.company}
            onChange={(e) => setProfileSettings({...profileSettings, company: e.target.value})}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
            Phone Number
          </label>
          <Input 
            id="phone" 
            value={profileSettings.phone}
            onChange={(e) => setProfileSettings({...profileSettings, phone: e.target.value})}
            className="w-full"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1" htmlFor="bio">
            Professional Bio
          </label>
          <Textarea 
            id="bio" 
            value={profileSettings.bio}
            onChange={(e) => setProfileSettings({...profileSettings, bio: e.target.value})}
            className="w-full min-h-[120px]"
          />
        </div>
      </div>
      
      <Button type="submit" className="bg-blue-accent hover:bg-blue-accent/90 w-full xs:w-auto text-xs sm:text-sm">
        <Save size={16} className="mr-1.5" />
        <span>Save Changes</span>
      </Button>
    </form>
  );

  const renderNotificationSettings = () => (
    <form onSubmit={handleNotificationUpdate}>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs sm:text-sm font-medium text-gray-900">Email Notifications</h4>
            <p className="text-xs text-gray-500 mt-0.5">Receive email notifications for important updates</p>
          </div>
          <Switch 
            checked={notificationSettings.emailNotifications}
            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs sm:text-sm font-medium text-gray-900">Deadline Reminders</h4>
            <p className="text-xs text-gray-500 mt-0.5">Get notified before tax return deadlines</p>
          </div>
          <Switch 
            checked={notificationSettings.deadlineReminders}
            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, deadlineReminders: checked})}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs sm:text-sm font-medium text-gray-900">Client Messages</h4>
            <p className="text-xs text-gray-500 mt-0.5">Receive notifications when clients send messages</p>
          </div>
          <Switch 
            checked={notificationSettings.clientMessages}
            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, clientMessages: checked})}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs sm:text-sm font-medium text-gray-900">Marketing Emails</h4>
            <p className="text-xs text-gray-500 mt-0.5">Receive updates about new features and promotions</p>
          </div>
          <Switch 
            checked={notificationSettings.marketingEmails}
            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, marketingEmails: checked})}
          />
        </div>
      </div>
      
      <div className="mt-6 sm:mt-8">
        <Button type="submit" className="bg-blue-accent hover:bg-blue-accent/90 w-full xs:w-auto text-xs sm:text-sm">
          <Save size={16} className="mr-1.5" />
          <span>Save Preferences</span>
        </Button>
      </div>
    </form>
  );

  const renderSecuritySettings = () => (
    <div>
      <div className="mb-6 sm:mb-8">
        <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Change Password</h3>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1" htmlFor="current-password">
              Current Password
            </label>
            <Input id="current-password" type="password" className="w-full" />
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1" htmlFor="new-password">
              New Password
            </label>
            <Input id="new-password" type="password" className="w-full" />
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1" htmlFor="confirm-password">
              Confirm New Password
            </label>
            <Input id="confirm-password" type="password" className="w-full" />
          </div>
        </div>
        
        <Button className="mt-4 bg-blue-accent hover:bg-blue-accent/90 w-full xs:w-auto text-xs sm:text-sm">
          <Save size={16} className="mr-1.5" />
          <span>Update Password</span>
        </Button>
      </div>
      
      <div>
        <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Two-Factor Authentication</h3>
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4">
          <div className="flex items-start">
            <Shield className="text-blue-accent mt-1 mr-3" size={20} />
            <div>
              <p className="text-xs sm:text-sm text-gray-700">
                Two-factor authentication adds an extra layer of security to your account. 
                When enabled, you'll be required to provide a verification code in addition to your password.
              </p>
            </div>
          </div>
        </div>
        
        <Button variant="outline" className="w-full xs:w-auto text-xs sm:text-sm">
          <span>Enable Two-Factor Authentication</span>
        </Button>
      </div>
    </div>
  );

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PortalHeader type="agent" profileName="John Agent" />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 pb-20 md:pb-0 md:ml-16 lg:ml-64 px-4 md:px-6">
          <PageTransition>
            <main className="page-container py-4 sm:py-6 md:py-10 max-w-7xl mx-auto">
              <div className="mb-5 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage your account preferences and settings.</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-card overflow-hidden">
                <div className="flex overflow-x-auto border-b border-gray-100 pb-1 scrollbar-none">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`flex items-center px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors ${
                        activeTab === tab.id 
                          ? 'text-blue-accent border-b-2 border-blue-accent' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <span className="mr-1.5 sm:mr-2">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
                
                <div className="p-3 xs:p-4 sm:p-5 md:p-6">
                  {activeTab === 'profile' && renderProfileSettings()}
                  {activeTab === 'notifications' && renderNotificationSettings()}
                  {activeTab === 'security' && renderSecuritySettings()}
                </div>
              </div>
            </main>
          </PageTransition>
        </div>
      </div>
    </div>
  );
};

export default Settings;
