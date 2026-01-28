
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardView: React.FC = () => {
  const stats = useMemo(() => {
    const db = JSON.parse(localStorage.getItem('gp_database') || '{"ADMIN": {}, "USER": {}}');
    const users = Object.values(db.USER || {}).map((u: any) => u.profile);
    
    const totalBottles = users.reduce((sum, u) => sum + (u.bottles || 0), 0);
    const totalPoints = users.reduce((sum, u) => sum + (u.points || 0), 0);
    const activeNodes = users.length;
    const co2Saved = (totalBottles * 0.08).toFixed(1);

    return { totalBottles, activeNodes, co2Saved, totalPoints };
  }, []);

  const chartData = [
    { name: 'Start', count: 0 },
    { name: 'Active', count: stats.totalBottles },
  ];

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Real-time Recycled" value={stats.totalBottles.toLocaleString()} icon="fa-recycle" color="text-emerald-500" />
        <StatCard label="Global Nodes" value={stats.activeNodes.toLocaleString()} icon="fa-network-wired" color="text-indigo-500" />
        <StatCard label="CO2 Reduction" value={`${stats.co2Saved}kg`} icon="fa-wind" color="text-sky-500" />
        <StatCard label="System Uptime" value="100%" icon="fa-clock" color="text-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#0a0a0a] p-8 md:p-10 rounded-[2.5rem] border border-white/10 glass shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase">Community Growth</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Live Ingestion Stream</p>
            </div>
            <div className="text-[9px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-lg mono">ACTIVE_SYNC</div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 9, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 9, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px'}} 
                  itemStyle={{color: '#10b981'}}
                />
                <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} fill="url(#colorIn)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/10 glass shadow-2xl">
          <h3 className="text-xl font-black text-white mb-8 tracking-tighter uppercase">Node Health</h3>
          <div className="space-y-6">
            <HealthItem name="Alpha-Gateway" value={100} color="bg-emerald-500" />
            <HealthItem name="Storage-Cluster" value={stats.activeNodes > 0 ? 88 : 0} color="bg-indigo-500" />
            <HealthItem name="IoT-Terminal" value={95} color="bg-emerald-500" />
            <HealthItem name="AI-Engine" value={100} color="bg-emerald-500" />
          </div>
          <div className="mt-10 pt-6 border-t border-white/5">
             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mono">Latency: 2ms</p>
             <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest mono mt-1">Status: Stable</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{label: string; value: string; icon: string; color: string}> = ({label, value, icon, color}) => (
  <div className="bg-[#0a0a0a] p-7 rounded-[2rem] border border-white/10 glass transition-all hover:border-white/20 hover:translate-y-[-2px] group">
    <div className="flex items-center space-x-5">
      <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl ${color} transition-transform group-hover:scale-110`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-white tracking-tighter">{value}</p>
      </div>
    </div>
  </div>
);

const HealthItem: React.FC<{name: string; value: number; color: string; alert?: boolean}> = ({name, value, color, alert}) => (
  <div>
    <div className="flex justify-between items-center mb-2.5">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{name}</span>
      <span className="text-[10px] font-black mono text-slate-600">{value}%</span>
    </div>
    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color} ${alert ? 'animate-pulse' : ''}`} style={{width: `${value}%`}}></div>
    </div>
  </div>
);

export default DashboardView;