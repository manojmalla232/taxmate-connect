import { useEffect, useState } from 'react';

export type Message = {
  id: number;
  sender: 'client' | 'agent';
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    size: string;
  };
  read: boolean;
};

// Simulated WebSocket connection
class MockWebSocket {
  private callbacks: { [event: string]: ((data: any) => void)[] } = {};
  private connected: boolean = false;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private url: string;

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  private connect() {
    // Simulate connection delay
    setTimeout(() => {
      this.connected = true;
      this.triggerEvent('open', {});
      
      // Simulate periodic messages from agent
      this.simulateIncomingMessages();
    }, 1000);
  }

  private simulateIncomingMessages() {
    // Simulate a new message every 30-60 seconds if this were a real app
    // For demo purposes, we'll send one message after 10 seconds
    setTimeout(() => {
      if (this.connected) {
        const newMessage: Message = {
          id: Date.now(),
          sender: 'agent',
          text: 'I've reviewed your documents. Do you have any questions about your deductions?',
          timestamp: new Date().toLocaleString('en-AU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }).replace(/\//g, '-'),
          read: false
        };
        
        this.triggerEvent('message', { data: JSON.stringify(newMessage) });
      }
    }, 10000);
  }

  public addEventListener(event: string, callback: (data: any) => void) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  public removeEventListener(event: string, callback: (data: any) => void) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
  }

  private triggerEvent(event: string, data: any) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }

  public send(data: string) {
    if (!this.connected) {
      console.error('Cannot send message, not connected');
      return;
    }
    
    // Echo back the message as if it was sent successfully
    const message = JSON.parse(data);
    setTimeout(() => {
      this.triggerEvent('message', { data: JSON.stringify({
        ...message,
        id: Date.now(), // Assign a server-generated ID
        timestamp: new Date().toLocaleString('en-AU', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).replace(/\//g, '-')
      })});
    }, 300);
  }

  public close() {
    this.connected = false;
    this.triggerEvent('close', {});
    
    // Attempt to reconnect
    this.reconnectTimer = setTimeout(() => this.connect(), 3000);
  }
}

export const useMessaging = (initialMessages: Message[] = []) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<MockWebSocket | null>(null);

  useEffect(() => {
    // Create WebSocket connection
    const ws = new MockWebSocket('wss://api.taxmate-connect.example/messages');
    setSocket(ws);
    
    const handleOpen = () => {
      setIsConnected(true);
    };
    
    const handleClose = () => {
      setIsConnected(false);
    };
    
    const handleMessage = (event: any) => {
      try {
        const message = JSON.parse(event.data);
        setMessages(prev => [message, ...prev]);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };
    
    ws.addEventListener('open', handleOpen);
    ws.addEventListener('close', handleClose);
    ws.addEventListener('message', handleMessage);
    
    return () => {
      ws.removeEventListener('open', handleOpen);
      ws.removeEventListener('close', handleClose);
      ws.removeEventListener('message', handleMessage);
      ws.close();
    };
  }, []);

  const sendMessage = (text: string, attachment?: { name: string; size: string }) => {
    if (!socket || !isConnected) {
      console.error('Cannot send message, not connected');
      return false;
    }
    
    const message: Partial<Message> = {
      sender: 'client',
      text,
      read: true
    };
    
    if (attachment) {
      message.attachment = attachment;
    }
    
    socket.send(JSON.stringify(message));
    return true;
  };

  const markAsRead = (messageId: number) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  const markAllAsRead = () => {
    setMessages(prev => 
      prev.map(msg => ({ ...msg, read: true }))
    );
  };

  return {
    messages,
    isConnected,
    sendMessage,
    markAsRead,
    markAllAsRead
  };
};