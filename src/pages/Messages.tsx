import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageSquare, User, Filter, Bell, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Sidebar from '@/components/layout/Sidebar';
import PageTransition from '@/components/shared/PageTransition';
import { useToast } from '@/hooks/use-toast';
import { useMessaging } from '@/services/messagingService';

const Messages: React.FC = () => {
  const [activeConversation, setActiveConversation] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  
  // Mock conversations data
  const [conversations, setConversations] = useState([
    {
      id: 1,
      clientName: 'Sarah Johnson',
      clientId: 101,
      lastMessage: 'I\'ve uploaded my payment summary from my main job.',
      timestamp: '2024-08-10 14:22',
      unread: 2,
      avatar: '🧑',
      visaType: '482 Visa'
    },
    {
      id: 2,
      clientName: 'Michael Wong',
      clientId: 102,
      lastMessage: 'When is the deadline for my tax return?',
      timestamp: '2024-08-09 11:05',
      unread: 0,
      avatar: '👨',
      visaType: '189 Visa'
    },
    {
      id: 3,
      clientName: 'Emma Taylor',
      clientId: 103,
      lastMessage: 'Thanks for your help with my tax return!',
      timestamp: '2024-08-08 16:30',
      unread: 0,
      avatar: '👩',
      visaType: '500 Visa'
    },
    {
      id: 4,
      clientName: 'David Chen',
      clientId: 104,
      lastMessage: 'Do I need to include my overseas income?',
      timestamp: '2024-08-07 09:45',
      unread: 1,
      avatar: '👨',
      visaType: '457 Visa'
    },
    {
      id: 5,
      clientName: 'Olivia Smith',
      clientId: 105,
      lastMessage: 'I have a question about my deductions.',
      timestamp: '2024-08-06 13:20',
      unread: 0,
      avatar: '👩',
      visaType: '485 Visa'
    }
  ]);
  
  // Mock messages for the active conversation
  const [messages, setMessages] = useState<any[]>([]);
  
  // Simulate fetching messages when a conversation is selected
  useEffect(() => {
    if (activeConversation) {
      // Mark conversation as read
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === activeConversation ? { ...conv, unread: 0 } : conv
        )
      );
      
      // Mock API call to get messages
      const mockMessages = [
        {
          id: 1,
          sender: 'agent',
          text: 'Hello, I\'m reviewing your tax return. Could you please upload your payment summaries from all employers for this financial year?',
          timestamp: '2024-08-10 09:15'
        },
        {
          id: 2,
          sender: 'client',
          text: 'I\'ve uploaded my main payment summary. I\'ll get the second one from my part-time job soon.',
          timestamp: '2024-08-10 14:22'
        },
        {
          id: 3,
          sender: 'agent',
          text: 'Thanks for the upload. I also need your bank statements showing interest earned. Please upload when you can.',
          timestamp: '2024-08-11 11:05',
          attachment: {
            name: 'Tax_Checklist_2024.pdf',
            size: '243 KB'
          }
        }
      ];
      
      setMessages(mockMessages);
    } else {
      setMessages([]);
    }
  }, [activeConversation]);
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv =>
    conv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeConversation) return;
    
    setIsSending(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newMsg = {
        id: messages.length + 1,
        sender: 'agent',
        text: newMessage.trim(),
        timestamp: new Date().toLocaleString('en-AU', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).replace(/\//g, '-')
      };
      
      setMessages([...messages, newMsg]);
      
      // Update last message in conversations list
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === activeConversation
            ? {
                ...conv,
                lastMessage: newMessage.trim(),
                timestamp: newMsg.timestamp
              }
            : conv
        )
      );
      
      setNewMessage('');
      setIsSending(false);
    }, 500);
  };
  
  const handleMarkAllAsRead = () => {
    setConversations(prevConversations =>
      prevConversations.map(conv => ({ ...conv, unread: 0 }))
    );
    
    toast({
      title: "All messages marked as read",
      description: "You have no unread messages"
    });
  };
  
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 pb-20 md:pb-0 md:ml-16 lg:ml-64 px-2 xs:px-4 md:px-6">
        <PageTransition>
          <main className="page-container py-3 xs:py-4 sm:py-6 md:py-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 xs:gap-3 sm:gap-4 mb-3 xs:mb-5 sm:mb-8">
              <div>
                <h1 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-900">Messages</h1>
                <p className="text-xs xs:text-sm sm:text-base text-gray-500 mt-0.5 xs:mt-1">Communicate with your clients securely.</p>
              </div>
              
              {totalUnread > 0 && (
                <Button 
                  variant="outline" 
                  className="w-full md:w-auto text-xs h-9 xs:h-10 px-3 xs:px-4"
                  onClick={handleMarkAllAsRead}
                >
                  <CheckCircle size={14} className="mr-1 xs:mr-1.5" />
                  <span>Mark All as Read</span>
                  <span className="ml-1.5 bg-blue-accent text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {totalUnread}
                  </span>
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
              {/* Conversations List */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="lg:sticky lg:top-6">
                  <div className="bg-white rounded-xl shadow-card overflow-hidden">
                    <div className="p-3 xs:p-4 border-b border-gray-100">
                      <h3 className="font-medium text-gray-900 text-sm xs:text-base mb-2 xs:mb-3">Conversations</h3>
                      
                      <div className="relative">
                        <Search size={14} className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search conversations..."
                          className="pl-8 xs:pl-9 text-xs xs:text-sm h-8 xs:h-9 py-1 xs:py-2"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="overflow-y-auto max-h-[500px] xs:max-h-[600px]">
                      {filteredConversations.length === 0 ? (
                        <div className="p-4 xs:p-6 sm:p-8 text-center text-gray-500 text-xs xs:text-sm">
                          No conversations found matching your criteria.
                        </div>
                      ) : (
                        filteredConversations.map((conversation) => (
                          <motion.div 
                            key={conversation.id}
                            className={`p-3 xs:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                              activeConversation === conversation.id ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => setActiveConversation(conversation.id)}
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-start space-x-2 xs:space-x-3">
                              <div className="p-1.5 xs:p-2 bg-blue-50 rounded-full text-lg">
                                {conversation.avatar}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium text-gray-900 text-xs xs:text-sm sm:text-base truncate">
                                    {conversation.clientName}
                                  </h4>
                                  <div className="flex items-center">
                                    <span className="text-[10px] xs:text-xs text-gray-500 whitespace-nowrap">
                                      {conversation.timestamp.split(' ')[0]}
                                    </span>
                                    {conversation.unread > 0 && (
                                      <span className="ml-1.5 bg-blue-accent text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                                        {conversation.unread}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 truncate">{conversation.lastMessage}</p>
                                {conversation.visaType && (
                                  <div className="mt-1 text-[10px] bg-gray-100 px-1.5 py-0.5 rounded inline-block">
                                    {conversation.visaType}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Message Content */}
              <div className="lg:col-span-2 order-1 lg:order-2 mb-3 xs:mb-4 sm:mb-6 lg:mb-0">
                {activeConversation ? (
                  <div className="bg-white rounded-xl shadow-card overflow-hidden flex flex-col h-[600px]">
                    {/* Conversation Header */}
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-light text-blue-accent flex items-center justify-center mr-2 sm:mr-3">
                            <User size={16} className="sm:size-[20px]" />
                          </div>
                          <div>
                            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                              {conversations.find(c => c.id === activeConversation)?.clientName}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Client ID: {conversations.find(c => c.id === activeConversation)?.clientId}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <Button variant="ghost" size="sm">
                            <Bell size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 p-6 overflow-y-auto">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`mb-4 flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] rounded-lg p-4 ${
                              message.sender === 'agent' 
                                ? 'bg-blue-accent text-white rounded-br-none' 
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}
                          >
                            <div className="text-sm mb-1">{message.text}</div>
                            
                            {message.attachment && (
                              <div className={`mt-3 p-2 rounded flex items-center text-xs ${
                                message.sender === 'agent' ? 'bg-blue-600' : 'bg-gray-200'
                              }`}>
                                <div className="flex-1">
                                  <div className={message.sender === 'agent' ? 'text-white' : 'text-gray-800'}>
                                    {message.attachment.name}
                                  </div>
                                  <div className={message.sender === 'agent' ? 'text-blue-200' : 'text-gray-500'}>
                                    {message.attachment.size}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <div 
                              className={`text-xs mt-1 ${
                                message.sender === 'agent' ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {message.timestamp}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200">
                      <form onSubmit={handleSendMessage} className="flex space-x-2">
                        <Input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1"
                        />
                        <Button 
                          type="submit" 
                          className="bg-blue-accent hover:bg-blue-accent/90"
                          disabled={isSending || !newMessage.trim()}
                        >
                          Send
                        </Button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-card p-3 xs:p-4 sm:p-6 md:p-8 h-full flex items-center justify-center">
                    <div className="text-center px-2 xs:px-4">
                      <MessageSquare size={28} className="text-gray-300 mx-auto mb-2 xs:mb-3 sm:mb-4 xs:text-[36px] sm:text-[48px]" />
                      <h3 className="text-base xs:text-lg sm:text-xl font-medium text-gray-700 mb-1 xs:mb-2">Select a Conversation</h3>
                      <p className="text-gray-500 max-w-md text-xs xs:text-sm sm:text-base">
                        Choose a client conversation from the list to view and respond to messages.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </PageTransition>
      </div>
    </div>
  );
};

export default Messages;