
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const db = JSON.parse(localStorage.getItem('gp_database') || '{"ADMIN": {}, "USER": {}}');
    const updatedUser = { ...user, name };
    
    // Update DB
    db[user.role][user.id].profile = updatedUser;
    localStorage.setItem('gp_database', JSON.stringify(db));
    
    // Update Session
    localStorage.setItem('gp_active_session', JSON.stringify(updatedUser));
    onUpdate(updatedUser);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#0f1115] p-8 rounded-[2.5rem] border border-white/5 glass shadow-2xl">
        <h3 className="text-xl font-black text-white tracking-tighter mb-8 uppercase">Profile Calibration</h3>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-6 mb-8">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} className="w-24 h-24 rounded-3xl bg-black border border-white/10" alt="Avatar" />
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Avatar Preview</p>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">Your avatar is procedurally generated based on your name.</p>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">Display Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#05070a] border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-emerald-500/50 text-white font-bold transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">Entity ID (Locked)</label>
            <input 
              type="text" 
              value={user.id} 
              disabled
              className="w-full bg-[#05070a] border border-white/5 rounded-2xl py-4 px-6 text-slate-600 font-bold mono cursor-not-allowed opacity-50"
            />
          </div>

          <button 
            onClick={handleSave}
            className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${saved ? 'bg-emerald-500 text-slate-900' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}
          >
            {saved ? <><i className="fas fa-check mr-2"></i> Synced</> : 'Sync Changes'}
          </button>
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-3xl border border-white/5 glass">
        <h4 className="text-sm font-black text-white tracking-widest mb-4 uppercase">System Info</h4>
        <div className="grid grid-cols-2 gap-4 text-[10px] mono">
          <div className="text-slate-500 uppercase font-bold">Node Version</div>
          <div className="text-emerald-400 text-right">v2.4.12-pro</div>
          <div className="text-slate-500 uppercase font-bold">Encrypted Mode</div>
          <div className="text-emerald-400 text-right">AES-256 Enabled</div>
          <div className="text-slate-500 uppercase font-bold">Protocol</div>
          <div className="text-emerald-400 text-right">GP-NEO-SYNC</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
