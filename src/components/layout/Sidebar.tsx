
import React, { useState } from 'react';
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

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Clients', path: '/clients' },
    { icon: FileText, label: 'Tax Returns', path: '/tax-returns' },
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
        <ul className="space-y-1">
          {menuItems.map((item) => (
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
