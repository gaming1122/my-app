
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface UserPortalViewProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
}

const UserPortalView: React.FC<UserPortalViewProps> = ({ user: initialUser, onUpdate }) => {
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [animating, setAnimating] = useState(false);

  const handleDeposit = () => {
    setAnimating(true);
    const db = JSON.parse(localStorage.getItem('gp_database') || '{"ADMIN": {}, "USER": {}}');
    const updatedUser = {
      ...user,
      points: user.points + 50,
      bottles: user.bottles + 1
    };
    
    db.USER[user.id].profile = updatedUser;
    localStorage.setItem('gp_database', JSON.stringify(db));
    localStorage.setItem('gp_active_session', JSON.stringify(updatedUser));
    
    setUser(updatedUser);
    onUpdate(updatedUser);
    setTimeout(() => setAnimating(false), 500);
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-[#0f1115] p-12 rounded-[3.5rem] border border-white/5 glass relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[120px] -mr-40 -mt-40"></div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all"></div>
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                className="w-48 h-48 rounded-[3rem] border-4 border-white/5 relative z-10 bg-[#05070a]" 
                alt="Profile"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Global Recycler</span>
                <span className="text-slate-500 text-[10px] font-bold mono uppercase">Node Active since {new Date(user.joinedAt).getFullYear()}</span>
              </div>
              <h2 className="text-6xl font-black text-white tracking-tighter mb-8 leading-none">{user.name}</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className={`bg-[#05070a] p-8 rounded-[2.5rem] border border-white/5 shadow-xl transition-all ${animating ? 'scale-105 border-emerald-500/50' : ''}`}>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Stored Points</p>
                  <p className="text-5xl font-black text-emerald-400 tracking-tighter mono">{user.points.toLocaleString()}</p>
                </div>
                <div className="bg-[#05070a] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Items Count</p>
                  <p className="text-5xl font-black text-white tracking-tighter mono">{user.bottles}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action / QR Card */}
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-emerald-500/10 flex flex-col items-center justify-center text-center">
           <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] mb-10">Personal Identity Node</p>
           <div className="w-56 h-56 bg-[#05070a] p-5 rounded-[2.5rem] relative overflow-hidden group">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${user.id}&bgcolor=05070a&color=10b981`} 
                alt="QR Code" 
                className="w-full h-full relative z-10 group-hover:scale-110 transition-transform duration-500"
              />
           </div>
           <h4 className="mt-10 text-slate-900 font-black tracking-[0.2em] uppercase text-sm mono">{user.id}</h4>
           <button 
             onClick={handleDeposit}
             className="mt-8 px-10 py-5 bg-emerald-500 text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all shadow-xl active:scale-95"
           >
             Simulate Collection
           </button>
        </div>
      </div>

      <div className="bg-[#0f1115] p-12 rounded-[3.5rem] border border-white/5 glass">
          <h3 className="text-2xl font-black text-white mb-10 tracking-tighter uppercase">Ecological Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ImpactStat label="Carbon Reduction" value={`${(user.bottles * 0.08).toFixed(2)} kg`} icon="fa-cloud-sun" color="text-indigo-400" />
            <ImpactStat label="Energy Conservation" value={`${(user.bottles * 0.5).toFixed(1)} kWh`} icon="fa-bolt" color="text-emerald-400" />
            <ImpactStat label="Community Rank" value={`#${Math.max(1, 100 - Math.floor(user.points/100))}`} icon="fa-trophy" color="text-amber-400" />
          </div>
      </div>
    </div>
  );
};

const ImpactStat: React.FC<{label: string; value: string; icon: string; color: string}> = ({label, value, icon, color}) => (
  <div className="bg-[#05070a] p-8 rounded-[2.5rem] border border-white/5 flex items-center space-x-6">
    <div className={`w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-2xl ${color}`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-white tracking-tighter mono">{value}</p>
    </div>
  </div>
);

export default UserPortalView;
