import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/taxReturnService';
import { getProfile, updateProfile } from '@/services/profileService';
import { Button } from '@/components/ui/button';

const ProfileEdit: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/client-login');
        return;
      }
      setUserId(user.id);
      try {
        const profileData = await getProfile(user.id);
        setProfile(profileData);
      } catch (e: any) {
        setError(e.message || 'Failed to load profile');
      }
      setLoading(false);
    })();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    setError(null);
    try {
      await updateProfile(userId, profile);
      navigate('/client-portal');
    } catch (e: any) {
      setError(e.message || 'Failed to save profile');
    }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!profile) return <div className="flex items-center justify-center h-screen text-red-500">Profile not found.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <form onSubmit={handleSave} className="bg-white rounded shadow p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input name="full_name" value={profile.full_name || ''} onChange={handleChange} className="border rounded p-2 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="email" value={profile.email || ''} onChange={handleChange} className="border rounded p-2 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input name="phone" value={profile.phone || ''} onChange={handleChange} className="border rounded p-2 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Visa Type</label>
          <input name="visa_type" value={profile.visa_type || ''} onChange={handleChange} className="border rounded p-2 w-full" />
        </div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
      </form>
    </div>
  );
};

export default ProfileEdit;
