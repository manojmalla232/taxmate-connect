import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Calendar, FileText, MessageSquare, CreditCard, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type NotificationType = 'message' | 'document' | 'appointment' | 'payment' | 'system';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
};

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'New message from your agent',
      message: 'Michael has sent you a message regarding your tax return.',
      timestamp: '2024-08-15T10:30:00',
      read: false,
      actionUrl: '#messages'
    },
    {
      id: '2',
      type: 'document',
      title: 'Document verified',
      message: 'Your payment summary has been verified by your agent.',
      timestamp: '2024-08-14T15:45:00',
      read: true,
      actionUrl: '#documents'
    },
    {
      id: '3',
      type: 'appointment',
      title: 'Upcoming appointment',
      message: 'You have a video consultation scheduled for tomorrow at 2:00 PM.',
      timestamp: '2024-08-13T09:15:00',
      read: false,
      actionUrl: '#appointments'
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment reminder',
      message: 'Your tax return preparation fee is due in 5 days.',
      timestamp: '2024-08-12T11:20:00',
      read: false,
      actionUrl: '#payments'
    }
  ]);
  
  const [open, setOpen] = useState(false);
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setOpen(false);
    // In a real app, this would navigate to the relevant section
    if (notification.actionUrl) {
      window.location.hash = notification.actionUrl.replace('#', '');
    }
  };
  
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'document':
        return <FileText size={16} className="text-green-500" />;
      case 'appointment':
        return <Calendar size={16} className="text-purple-500" />;
      case 'payment':
        return <CreditCard size={16} className="text-amber-500" />;
      case 'system':
        return <Info size={16} className="text-gray-500" />;
      default:
        return <Info size={16} />;
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return diffInHours === 0 
        ? 'Just now' 
        : `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white font-medium">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 px-2 text-blue-accent hover:text-blue-accent/90"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="max-h-[350px] overflow-y-auto">
          <AnimatePresence>
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm font-medium truncate ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500 text-sm">No notifications</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;