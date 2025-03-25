
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Users, 
  FileText, 
  BarChart2, 
  Calendar, 
  Settings, 
  LogOut, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import AnimatedLogo from '../ui/AnimatedLogo';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Separate primary and secondary menu items
  const primaryMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Clients', path: '/clients' },
    { icon: FileText, label: 'Tax Returns', path: '/tax-returns' }
  ];
  
  const secondaryMenuItems = [
    { icon: BarChart2, label: 'Reports', path: '/reports' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const sidebarVariants = {
    expanded: { width: '16rem' },
    collapsed: { width: '4.5rem' }
  };
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // State for mobile menu
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  // Mobile bottom navigation bar
  if (isMobile) {
    
    return (
      <>
        {/* More menu dropdown */}
        {showMoreMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMoreMenu(false)}>
            <div 
              className="fixed bottom-16 left-4 right-4 bg-white rounded-lg shadow-lg z-50 p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col">
                {secondaryMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-md ${
                      isActive(item.path)
                        ? 'bg-blue-light text-blue-accent font-medium'
                        : 'text-gray-700 hover:text-blue-accent hover:bg-gray-50'
                    }`}
                    onClick={() => setShowMoreMenu(false)}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Bottom navigation */}
        <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 ${className}`}>
          <div className="flex justify-around items-center h-16">
            {primaryMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 px-3 ${
                  isActive(item.path)
                    ? 'text-blue-accent'
                    : 'text-gray-600 hover:text-blue-accent'
                }`}
              >
                <item.icon size={20} />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ))}
            
            {/* More menu button */}
            <button
              className={`flex flex-col items-center justify-center py-2 px-3 ${
                secondaryMenuItems.some(item => isActive(item.path))
                  ? 'text-blue-accent'
                  : 'text-gray-600 hover:text-blue-accent'
              }`}
              onClick={() => setShowMoreMenu(!showMoreMenu)}
            >
              <Settings size={20} />
              <span className="text-xs mt-1">More</span>
            </button>
          </div>
        </div>
      </>
    );
  }
  
  // Desktop sidebar
  return (
    <motion.aside
      initial="expanded"
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`h-screen bg-white fixed left-0 top-0 border-r border-gray-200 flex flex-col z-30 ${className}`}
    >
      <div className="py-6 px-4 flex items-center justify-between border-b border-gray-100">
        <Link to="/dashboard" className="flex items-center space-x-2 overflow-hidden">
          <AnimatedLogo size="sm" />
          <motion.span
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="font-semibold text-lg text-gray-900 whitespace-nowrap"
          >
            TaxMate
          </motion.span>
        </Link>
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md text-gray-500 hover:text-blue-accent hover:bg-gray-100 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        {/* Primary menu items */}
        <div className="mb-6">
          <ul className="space-y-1">
            {primaryMenuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-blue-light text-blue-accent font-medium'
                      : 'text-gray-700 hover:text-blue-accent hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={20} />
                  <motion.span
                    animate={{ 
                      opacity: isCollapsed ? 0 : 1,
                      display: isCollapsed ? 'none' : 'block'
                    }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Secondary menu items */}
        <div>
          <motion.div 
            className="px-3 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider"
            animate={{ 
              opacity: isCollapsed ? 0 : 1,
              display: isCollapsed ? 'none' : 'block'
            }}
            transition={{ duration: 0.2 }}
          >
            More
          </motion.div>
          <ul className="space-y-1">
            {secondaryMenuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-blue-light text-blue-accent font-medium'
                      : 'text-gray-700 hover:text-blue-accent hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={20} />
                  <motion.span
                    animate={{ 
                      opacity: isCollapsed ? 0 : 1,
                      display: isCollapsed ? 'none' : 'block'
                    }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      <div className="p-3 mt-auto border-t border-gray-100">
        <Link
          to="/"
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          <motion.span
            animate={{ 
              opacity: isCollapsed ? 0 : 1,
              display: isCollapsed ? 'none' : 'block'
            }}
            transition={{ duration: 0.2 }}
            className="whitespace-nowrap"
          >
            Sign Out
          </motion.span>
        </Link>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
