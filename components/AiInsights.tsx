
import React, { useState, useEffect, useMemo } from 'react';
import { getSustainabilityInsights } from '../services/gemini';

const AiInsights: React.FC = () => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const stats = useMemo(() => {
    const db = JSON.parse(localStorage.getItem('gp_database') || '{"ADMIN": {}, "USER": {}}');
    const users = Object.values(db.USER || {}).map((u: any) => u.profile);
    return users.reduce((sum, u) => sum + (u.bottles || 0), 0);
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    const result = await getSustainabilityInsights(stats);
    setInsight(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, [stats]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-gradient-to-br from-[#050505] to-[#111] border border-white/10 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
               <i className="fas fa-microchip text-emerald-500 text-xl"></i>
            </div>
            <h2 className="text-3xl font-black tracking-tighter uppercase">Ecological Processor</h2>
          </div>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">
            Gemini Flash 3.0 processing live ingestion data from <span className="text-emerald-500 font-bold">{stats}</span> nodes. 
            Real-time environmental conversion initiated.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricBox label="Community Units" value={stats.toLocaleString()} />
            <MetricBox label="Efficiency" value={stats > 0 ? "84.2%" : "0.0%"} />
            <MetricBox label="Node Health" value="OPTIMAL" />
          </div>
        </div>
      </div>

      <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 glass p-10">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-black text-white tracking-tighter uppercase">Neural Impact Analysis</h3>
          <button 
            onClick={fetchInsights}
            disabled={loading}
            className="flex items-center space-x-3 text-emerald-500 font-black text-[10px] uppercase tracking-widest hover:text-emerald-400 disabled:opacity-30 transition-all"
          >
            <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
            <span>Refresh Stream</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="w-10 h-10 border-2 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-slate-600 font-black text-[10px] uppercase tracking-widest mono">Synchronizing with Gemini API...</p>
          </div>
        ) : (
          <div className="bg-[#000] p-8 rounded-[2rem] border border-white/5 text-slate-300 mono text-sm leading-relaxed whitespace-pre-line shadow-inner">
            {insight || "Awaiting community data for ecological modeling."}
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InsightCard 
            title="Predictive Maintenance" 
            desc="AI models suggest increasing collection frequency at Hub-Alpha based on weekend trending." 
            color="indigo"
          />
          <InsightCard 
            title="Carbon Offset Goal" 
            desc="Current trajectory puts community at 50kg reduction by next moon cycle. Velocity: +12%." 
            color="emerald"
          />
        </div>
      </div>
    </div>
  );
};

const MetricBox: React.FC<{label: string, value: string}> = ({label, value}) => (
  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
    <span className="block text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">{label}</span>
    <span className="text-xl font-black text-white tracking-tighter mono">{value}</span>
  </div>
);

const InsightCard: React.FC<{title: string, desc: string, color: 'indigo' | 'emerald'}> = ({title, desc, color}) => (
  <div className={`p-8 bg-[#000] border border-white/5 rounded-[2rem] hover:border-${color}-500/30 transition-all`}>
    <h4 className={`font-black text-[10px] uppercase tracking-[0.2em] mb-3 text-${color}-500`}>{title}</h4>
    <p className="text-slate-500 text-xs font-medium leading-relaxed">{desc}</p>
  </div>
);

export default AiInsights;