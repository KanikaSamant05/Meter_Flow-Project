import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { User, Lock } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) return toast.error('Passwords do not match');
    if (pwForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setSaving(true);
    try {
      await api.patch('/auth/update-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password updated successfully');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account preferences</p>
      </div>

      <div className="card mb-5">
        <div className="flex items-center gap-3 mb-4">
          <User size={15} className="text-blue-400" />
          <h2 className="text-sm font-semibold text-white">Profile</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Name</label><input className="input" value={user?.name || ''} readOnly /></div>
          <div><label className="label">Email</label><input className="input" value={user?.email || ''} readOnly /></div>
          <div><label className="label">Role</label><input className="input capitalize" value={user?.role || ''} readOnly /></div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Lock size={15} className="text-blue-400" />
          <h2 className="text-sm font-semibold text-white">Change Password</h2>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <input type="password" className="input" value={pwForm.currentPassword}
              onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">New Password</label>
              <input type="password" className="input" value={pwForm.newPassword}
                onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input type="password" className="input" value={pwForm.confirm}
                onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} required />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}