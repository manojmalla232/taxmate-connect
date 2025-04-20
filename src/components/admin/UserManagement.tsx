import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';

interface UserRow {
  id: string;
  username: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  approved?: boolean;
  deactivated?: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, email, phone, role, approved, deactivated');
      if (!error && data) setUsers(data as UserRow[]);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const toggleDeactivate = async (id: string, deactivated: boolean) => {
    await supabase.from('profiles').update({ deactivated: !deactivated }).eq('id', id);
    setUsers(users => users.map(u => u.id === id ? { ...u, deactivated: !deactivated } : u));
  };

  const changeRole = async (id: string, newRole: string) => {
    await supabase.from('profiles').update({ role: newRole }).eq('id', id);
    setUsers(users => users.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-xs">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-1 px-2 border">Username</th>
            <th className="py-1 px-2 border">Full Name</th>
            <th className="py-1 px-2 border">Email</th>
            <th className="py-1 px-2 border">Phone</th>
            <th className="py-1 px-2 border">Role</th>
            <th className="py-1 px-2 border">Deactivated</th>
            <th className="py-1 px-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="py-1 px-2 border">{user.username}</td>
              <td className="py-1 px-2 border">{user.full_name}</td>
              <td className="py-1 px-2 border">{user.email}</td>
              <td className="py-1 px-2 border">{user.phone}</td>
              <td className="py-1 px-2 border">
                <select value={user.role} onChange={e => changeRole(user.id, e.target.value)} className="border rounded px-1 py-0.5">
                  <option value="client">client</option>
                  <option value="agent">agent</option>
                  <option value="superadmin">superadmin</option>
                </select>
              </td>
              <td className="py-1 px-2 border">{user.deactivated ? 'Yes' : 'No'}</td>
              <td className="py-1 px-2 border">
                <Button size="sm" variant="outline" onClick={() => toggleDeactivate(user.id, !!user.deactivated)}>
                  {user.deactivated ? 'Reactivate' : 'Deactivate'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
