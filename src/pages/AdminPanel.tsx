import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import UserManagement from '@/components/admin/UserManagement';
import StatsDashboard from '@/components/admin/StatsDashboard';
import AuditLog from '@/components/admin/AuditLog';

interface AgentProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  approved: boolean;
  approved_at: string | null;
}

const AdminPanel: React.FC = () => {
  const [pendingAgents, setPendingAgents] = useState<AgentProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    // Check if current user is superadmin
    const checkRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsSuperAdmin(false);
        setCheckingRole(false);
        return;
      }
      const userId = session.user.id;
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      setIsSuperAdmin(!error && data && data.role === 'superadmin');
      setCheckingRole(false);
    };
    checkRole();
  }, []);

  useEffect(() => {
    if (!isSuperAdmin) return;
    const fetchPendingAgents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, approved, approved_at')
        .eq('role', 'agent')
        .eq('approved', false);
      if (!error && data) setPendingAgents(data as AgentProfile[]);
      setLoading(false);
    };
    fetchPendingAgents();
  }, [refresh, isSuperAdmin]);

  const approveAgent = async (id: string) => {
    await supabase
      .from('profiles')
      .update({ approved: true, approved_at: new Date().toISOString() })
      .eq('id', id);
    setRefresh(r => !r);
  };

  if (checkingRole) {
    return <div className="max-w-3xl mx-auto py-12"><p>Checking permissions...</p></div>;
  }
  if (!isSuperAdmin) {
    return <div className="max-w-3xl mx-auto py-12"><p className="text-red-600">Access denied. Superadmin only.</p></div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Super Admin Panel</h1>
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Pending Agent Registrations</h2>
        {loading ? (
          <p>Loading...</p>
        ) : pendingAgents.length === 0 ? (
          <p>No pending agents.</p>
        ) : (
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Phone</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingAgents.map(agent => (
                <tr key={agent.id}>
                  <td className="py-2 px-4 border">{agent.full_name}</td>
                  <td className="py-2 px-4 border">{agent.email}</td>
                  <td className="py-2 px-4 border">{agent.phone}</td>
                  <td className="py-2 px-4 border">
                    <Button onClick={() => approveAgent(agent.id)} size="sm">Approve</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      {/* User Management Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">User Management</h2>
        <UserManagement />
      </section>
      {/* Stats Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">System Stats</h2>
        <StatsDashboard />
      </section>
      {/* Audit Log Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Audit Log</h2>
        <AuditLog />
      </section>
    </div>
  );
};

export default AdminPanel;
