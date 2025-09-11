import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const ProfileTab: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setMobile(user.phone || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const onSave = () => {
    if (!name.trim()) return toast.error('Name is required');
    if (!/^\d{10}$/.test(mobile)) return toast.error('Enter a valid 10-digit mobile');
    if (password || confirm) {
      if (password.length < 6) return toast.error('Password must be 6+ chars');
      if (password !== confirm) return toast.error('Passwords do not match');
    }
    setSaving(true);
    try {
      updateUser({ name, phone: mobile, email });
      toast.success('Profile saved');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Mobile *</label>
          <input value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="10-digit" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Email (optional)</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" type="email" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">New Password (optional)</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" type="password" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
            <input value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" type="password" />
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={onSave} disabled={saving} className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium">
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;


