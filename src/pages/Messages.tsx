import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import PageTransition from '@/components/shared/PageTransition';
import PortalHeader from '@/components/layout/PortalHeader';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

type MessageRow = Database['public']['Tables']['messages']['Row'];

type ConversationRow = {
  id: string;
  client_name: string;
  client_id: string;
  agent_id: string;
  last_message: string;
  last_message_at: string;
  unread: number;
  avatar?: string;
  visa_type?: string;
};

const Messages: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    })();
  }, []);

  // Fetch conversations for the current user
  useEffect(() => {
    if (!userId) return;
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`client_id.eq.${userId},agent_id.eq.${userId}`)
        .order('last_message_at', { ascending: false });
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        setConversations(data || []);
        // Set first conversation as active by default
        if (data && data.length > 0 && !activeConversation) {
          setActiveConversation(data[0].id);
        }
      }
    };
    fetchConversations();
  }, [userId]);

  // Fetch messages for the active conversation
  useEffect(() => {
    if (!activeConversation) return;
    setLoading(true);
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', activeConversation)
        .order('created_at', { ascending: true });
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        setMessages(data || []);
      }
      setLoading(false);
    };
    fetchMessages();
  }, [activeConversation]);

  const handleSend = async () => {
    if (!userId || !newMessage.trim() || !activeConversation) return;
    // Find receiver_id: if user is client, send to agent; if agent, send to client
    const conv = conversations.find(c => c.id === activeConversation);
    if (!conv) return;
    const receiver_id = conv.client_id === userId ? conv.agent_id : conv.client_id;
    const { error } = await supabase.from('messages').insert({
      conversation_id: activeConversation,
      sender_id: userId,
      receiver_id,
      content: newMessage,
      created_at: new Date().toISOString(),
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setNewMessage('');
      // Refetch messages
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', activeConversation)
        .order('created_at', { ascending: true });
      setMessages(data || []);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    (conv.client_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (conv.last_message?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PortalHeader type="agent" profileName="John Agent" />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 flex flex-col md:flex-row">
          {/* Conversation List */}
          <div className="w-full md:w-1/3 lg:w-1/4 border-r bg-white h-full flex flex-col">
            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-gray-400">No conversations found matching your criteria.</div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 xs:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${activeConversation === conversation.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <div className="flex items-start space-x-2 xs:space-x-3">
                      <div className="p-1.5 xs:p-2 bg-blue-50 rounded-full text-lg">
                        {conversation.avatar || '👤'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900 text-xs xs:text-sm sm:text-base truncate">
                            {conversation.client_name}
                          </h4>
                          <span className="text-xs text-gray-400 ml-2">{conversation.visa_type || ''}</span>
                        </div>
                        <div className="text-xs text-gray-500 truncate">{conversation.last_message}</div>
                        <div className="text-xs text-gray-400">{conversation.last_message_at ? new Date(conversation.last_message_at).toLocaleString() : ''}</div>
                      </div>
                      {conversation.unread > 0 && (
                        <span className="bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs ml-2">{conversation.unread}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Messages for Active Conversation */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto">
              {loading ? (
                <div>Loading...</div>
              ) : messages.length === 0 ? (
                <div className="text-gray-400">No messages found.</div>
              ) : (
                <ul>
                  {messages.map(msg => (
                    <li key={msg.id} className="mb-2">
                      <span className="font-semibold">{msg.sender_id === userId ? 'You' : 'Agent'}:</span> {msg.content}
                      <span className="block text-xs text-gray-400">{msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex space-x-2 p-4 border-t bg-white">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                className="flex-1 border rounded p-2"
                placeholder="Type your message..."
              />
              <Button type="submit" disabled={loading || !newMessage.trim()}>Send</Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;