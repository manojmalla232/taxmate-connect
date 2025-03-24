
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, User, Download, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: number;
  sender: 'client' | 'agent';
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    size: string;
  };
};

const MessageCenter: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true); // Added connection state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'agent',
      text: 'Hello Sarah, I\'ve started preparing your tax return. Could you please upload your payment summaries from all employers for this financial year?',
      timestamp: '2024-08-10 09:15'
    },
    {
      id: 2,
      sender: 'client',
      text: 'Hi Michael, I\'ve uploaded my main payment summary. I\'ll get the second one from my part-time job soon.',
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
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setIsSending(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newMsg: Message = {
        id: messages.length + 1,
        sender: 'client',
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
      setNewMessage('');
      setIsSending(false);
    }, 500);
  };
  
  const handleFileUpload = () => {
    // In a real app, this would open a file picker
    toast({
      title: "Feature coming soon",
      description: "File attachments will be available in the next update."
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-card flex flex-col h-[600px]">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-light text-blue-accent flex items-center justify-center mr-3">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Michael Chen</h2>
              <p className="text-sm text-gray-500">Your Tax Agent</p>
            </div>
          </div>
          
          <div className="flex items-center">
            {isConnected ? (
              <div className="flex items-center text-green-500 text-xs">
                <Wifi size={14} className="mr-1" />
                <span>Connected</span>
              </div>
            ) : (
              <div className="flex items-center text-red-500 text-xs">
                <WifiOff size={14} className="mr-1" />
                <span>Disconnected</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-4 flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-4 ${
                message.sender === 'client' 
                  ? 'bg-blue-accent text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <div className="text-sm mb-1">{message.text}</div>
              
              {message.attachment && (
                <div className={`mt-3 p-2 rounded flex items-center text-xs ${
                  message.sender === 'client' ? 'bg-blue-600' : 'bg-gray-200'
                }`}>
                  <Paperclip size={14} className="mr-2" />
                  <div className="flex-1">
                    <div className={message.sender === 'client' ? 'text-white' : 'text-gray-800'}>
                      {message.attachment.name}
                    </div>
                    <div className={message.sender === 'client' ? 'text-blue-200' : 'text-gray-500'}>
                      {message.attachment.size}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Download size={12} />
                  </Button>
                </div>
              )}
              
              <div 
                className={`text-xs mt-1 ${
                  message.sender === 'client' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {message.timestamp}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Button 
            type="button"
            variant="outline"
            size="icon"
            onClick={handleFileUpload}
            aria-label="Attach file"
          >
            <Paperclip size={18} />
          </Button>
          
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-h-[42px] max-h-32 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!isSending && newMessage.trim()) {
                  handleSendMessage(e);
                }
              }
            }}
          />
          
          <Button 
            type="submit" 
            className="bg-blue-accent hover:bg-blue-accent/90"
            disabled={isSending || !newMessage.trim()}
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MessageCenter;
