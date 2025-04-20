import React from "react";
import { Link } from "react-router-dom";
import { Bell, MessageSquare, User, LogOut } from "lucide-react";
import AnimatedLogo from "../ui/AnimatedLogo";

export interface PortalHeaderProps {
  type: 'client' | 'agent';
  profileName?: string;
  handleLogout?: () => void;
}

const PortalHeader: React.FC<PortalHeaderProps> = ({ type, profileName, handleLogout }) => {
  // Route links and icons based on portal type
  const messageLink = type === 'client' ? '/client-portal/messages' : '/messages';
  const profileLink = type === 'client' ? '/client-portal/profile-settings' : '/settings';
  const notificationsLabel = type === 'client' ? 'Client Notifications' : 'Agent Notifications';
  const messagesLabel = type === 'client' ? 'Client Messages' : 'Agent Messages';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 h-16 flex items-center px-4 md:px-8 shadow-sm">
      <div className="flex items-center flex-1">
        <Link to="/" className="flex items-center space-x-2">
          <AnimatedLogo size="sm" />
          <span className="font-semibold text-lg text-gray-900">TaxMate</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label={notificationsLabel}>
          <Bell size={20} className="text-gray-700" />
        </button>
        <Link to={messageLink} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label={messagesLabel}>
          <MessageSquare size={20} className="text-gray-700" />
        </Link>
        {/* Profile dropdown placeholder */}
        <div className="relative group">
          <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none">
            <User size={20} className="text-gray-700" />
            <span className="hidden sm:inline text-sm text-gray-800 font-medium">{profileName || (type === 'client' ? 'Client' : 'Agent')}</span>
          </button>
          {/* Dropdown menu (implement if needed) */}
          {/* <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg hidden group-hover:block">
            <Link to={profileLink} className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Profile</Link>
            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">Logout</button>
          </div> */}
        </div>
        {handleLogout && (
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Logout"
            onClick={handleLogout}
          >
            <LogOut size={20} className="text-gray-700" />
          </button>
        )}
      </div>
    </header>
  );
};

export default PortalHeader;
