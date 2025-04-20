import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const StatsDashboard: React.FC = () => {
  const [stats, setStats] = useState({ users: 0, agents: 0, pendingAgents: 0, clients: 0, docs: 0 });
  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: users }, { count: agents }, { count: pendingAgents }, { count: clients }, { count: docs }] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'agent'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'agent').eq('approved', false),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'client'),
        supabase.from('documents').select('id', { count: 'exact', head: true })
      ]);
      setStats({
        users: users || 0,
        agents: agents || 0,
        pendingAgents: pendingAgents || 0,
        clients: clients || 0,
        docs: docs || 0
      });
    };
    fetchStats();
  }, []);
  return (
    <div className="flex flex-wrap gap-4">
      <div className="bg-gray-100 p-4 rounded shadow min-w-[120px]">
        <div className="font-bold">Users</div>
        <div>{stats.users}</div>
      </div>
      <div className="bg-gray-100 p-4 rounded shadow min-w-[120px]">
        <div className="font-bold">Agents</div>
        <div>{stats.agents}</div>
      </div>
      <div className="bg-gray-100 p-4 rounded shadow min-w-[120px]">
        <div className="font-bold">Pending Agents</div>
        <div>{stats.pendingAgents}</div>
      </div>
      <div className="bg-gray-100 p-4 rounded shadow min-w-[120px]">
        <div className="font-bold">Clients</div>
        <div>{stats.clients}</div>
      </div>
      <div className="bg-gray-100 p-4 rounded shadow min-w-[120px]">
        <div className="font-bold">Documents</div>
        <div>{stats.docs}</div>
      </div>
    </div>
  );
};

export default StatsDashboard;
