import React from 'react';
import { User } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  tab: string;
}

interface ClientSidebarNavProps {
  primaryMenuItems: MenuItem[];
  secondaryMenuItems: MenuItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showMore: boolean;
  setShowMore: (show: boolean) => void;
  vertical?: boolean;
}

const ClientSidebarNav: React.FC<ClientSidebarNavProps> = ({
  primaryMenuItems,
  secondaryMenuItems,
  activeTab,
  setActiveTab,
  showMore,
  setShowMore,
  vertical = false,
}) => {
  return (
    <nav className={vertical ? 'flex flex-col gap-1 mt-6' : 'flex items-center gap-2 mb-4'}>
      {primaryMenuItems.map(item => (
        <button
          key={item.tab}
          className={
            vertical
              ? `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm w-full justify-start ${activeTab === item.tab ? 'bg-blue-light text-blue-accent shadow' : 'text-gray-700 hover:text-blue-accent hover:bg-gray-50'}`
              : `inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${activeTab === item.tab ? 'bg-blue-light text-blue-accent shadow' : 'text-gray-700 hover:text-blue-accent hover:bg-gray-50'}`
          }
          onClick={() => setActiveTab(item.tab)}
        >
          <item.icon size={18} />
          <span>{item.label}</span>
        </button>
      ))}
      <Popover open={showMore} onOpenChange={setShowMore}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={
              vertical
                ? `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm w-full justify-start ${secondaryMenuItems.some(i => i.tab === activeTab) ? 'bg-blue-light text-blue-accent shadow' : 'text-gray-700 hover:text-blue-accent hover:bg-gray-50'}`
                : `inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${secondaryMenuItems.some(i => i.tab === activeTab) ? 'bg-blue-light text-blue-accent shadow' : 'text-gray-700 hover:text-blue-accent hover:bg-gray-50'}`
            }
            aria-label="More options"
          >
            <User size={18} />
            More
          </button>
        </PopoverTrigger>
        <PopoverContent align={vertical ? 'end' : 'start'} className="w-44 p-0">
          <div className="flex flex-col">
            {secondaryMenuItems.map(item => (
              <button
                key={item.tab}
                onClick={() => { setActiveTab(item.tab); setShowMore(false); }}
                className={`w-full text-left px-4 py-2 flex items-center gap-2 ${activeTab === item.tab ? 'bg-blue-light text-blue-accent font-medium' : 'hover:bg-gray-50'}`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </nav>
  );
};

export default ClientSidebarNav;
