import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';

const RegisterAgent: React.FC = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    // Create Supabase user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    });
    if (signUpError || !data.user) {
      setError(signUpError?.message || 'Registration failed');
      setLoading(false);
      return;
    }
    // Insert profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: form.username,
      full_name: form.full_name,
      phone: form.phone,
      email: form.email,
      role: 'agent',
      approved: false
    });
    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }
    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-xl font-bold mb-4">Agent Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="username" placeholder="Username" required value={form.username} onChange={handleChange} className="w-full border p-2" />
        <input name="full_name" placeholder="Full Name" required value={form.full_name} onChange={handleChange} className="w-full border p-2" />
        <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} className="w-full border p-2" />
        <input name="phone" placeholder="Phone" required value={form.phone} onChange={handleChange} className="w-full border p-2" />
        <input name="password" type="password" placeholder="Password" required value={form.password} onChange={handleChange} className="w-full border p-2" />
        <Button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</Button>
        {success && <p className="text-green-600">Registration successful! Awaiting approval.</p>}
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default RegisterAgent;
