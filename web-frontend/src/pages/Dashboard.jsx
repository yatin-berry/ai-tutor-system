import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { dashboardService } from '../services/api';
import { BrainCircuit, Mic2, Award, History, TrendingUp, Sparkles, ChevronRight, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardSkeleton } from '../components/Skeleton';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStats();
        // Reverse history for chart (oldest to newest)
        if (data.recent_history) {
            data.chart_history = [...data.recent_history].reverse();
        }
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-white/10 p-4 rounded-xl shadow-xl">
          <p className="text-slate-300 font-bold mb-1">{label}</p>
          <p className="text-brand-primary font-black text-lg">Score: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl sm:text-6xl font-black mb-3 tracking-tight">
             Hello, <span className="gradient-text">{user?.email?.split('@')[0]}</span>
           </h1>
           <p className="text-slate-400 text-lg font-medium">Your learning momentum is looking great today.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Live Analytics</span>
        </div>
      </header>

      {/* Stats Grid - Fully Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Quizzes Taken', value: stats?.total_quizzes || 0, icon: BrainCircuit, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Avg. Accuracy', value: `${stats?.avg_accuracy || 0}%`, icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
          { label: 'Interviews', value: stats?.total_interviews || 0, icon: Mic2, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'Knowledge Points', value: stats?.knowledge_points || 0, icon: Award, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        ].map((stat, i) => (
          <motion.div key={i} variants={item} className="glass-card-premium p-8 hover:bg-white/[0.04]">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-lg shadow-black/20`}>
                <stat.icon size={28} />
              </div>
            </div>
            <div className="text-4xl font-black mb-2">{stat.value}</div>
            <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Performance Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div variants={item} className="glass-card-premium p-8">
           <h2 className="text-2xl font-black flex items-center gap-3 mb-8">
            <BrainCircuit className="text-blue-400" size={24} /> Quiz Trend
          </h2>
          <div className="h-[300px] w-full">
            {stats?.chart_history?.filter(h => h.type === 'quiz').length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.chart_history.filter(h => h.type === 'quiz')}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="title" stroke="#ffffff40" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#1e293b', strokeWidth: 3 }} activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 font-bold">Not enough data to display trend.</div>
            )}
          </div>
        </motion.div>

        <motion.div variants={item} className="glass-card-premium p-8">
           <h2 className="text-2xl font-black flex items-center gap-3 mb-8">
            <Mic2 className="text-purple-400" size={24} /> Interview Trend
          </h2>
          <div className="h-[300px] w-full">
            {stats?.chart_history?.filter(h => h.type === 'interview').length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.chart_history.filter(h => h.type === 'interview')}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="title" stroke="#ffffff40" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={4} dot={{ r: 6, fill: '#1e293b', strokeWidth: 3 }} activeDot={{ r: 8, stroke: '#a855f7', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 font-bold">Not enough data to display trend.</div>
            )}
          </div>
        </motion.div>
        
        <motion.div variants={item} className="glass-card-premium p-8">
           <h2 className="text-2xl font-black flex items-center gap-3 mb-8">
            <BarChart2 className="text-emerald-400" size={24} /> Subject Accuracy
          </h2>
          <div className="h-[300px] w-full">
            {stats?.subject_stats?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.subject_stats} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="subject" stroke="#ffffff40" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                  <Bar dataKey="average_accuracy" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 font-bold">No subject data available.</div>
            )}
          </div>
        </motion.div>

        <motion.div variants={item} className="glass-card-premium p-8">
           <h2 className="text-2xl font-black flex items-center gap-3 mb-8">
            <BarChart2 className="text-amber-400" size={24} /> Role Performance
          </h2>
          <div className="h-[300px] w-full">
            {stats?.role_stats?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.role_stats} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="role" stroke="#ffffff40" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                  <Bar dataKey="average_score" fill="#fbbf24" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 font-bold">No role data available.</div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Quick Actions */}
        <motion.div variants={item} className="lg:col-span-2 space-y-8">
          <h2 className="text-3xl font-black flex items-center gap-3">
            <Sparkles className="text-brand-primary" size={28} /> Recommended
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <Link to="/quiz" className="glass-card-premium p-10 group relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6">
                   <BrainCircuit size={24} />
                </div>
                <h3 className="text-2xl font-black mb-4">AI Quiz Generator</h3>
                <p className="text-slate-400 text-base mb-8 leading-relaxed">
                  Bridge your knowledge gaps with custom quizzes tailored to your level.
                </p>
                <div className="btn-primary inline-flex items-center gap-3 px-6 py-3 text-sm">
                  Start Now <ChevronRight size={18} />
                </div>
              </div>
              <BrainCircuit className="absolute -right-6 -bottom-6 w-40 h-40 text-white/[0.03] group-hover:scale-110 group-hover:text-white/[0.05] transition-all duration-700" />
            </Link>

            <Link to="/interview" className="glass-card-premium p-10 group relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6">
                   <Mic2 size={24} />
                </div>
                <h3 className="text-2xl font-black mb-4">Interview Coach</h3>
                <p className="text-slate-400 text-base mb-8 leading-relaxed">
                  Practice behavioral questions with real-time AI feedback and scoring.
                </p>
                <div className="btn-primary inline-flex items-center gap-3 px-6 py-3 text-sm">
                  Practice Now <ChevronRight size={18} />
                </div>
              </div>
              <Mic2 className="absolute -right-6 -bottom-6 w-40 h-40 text-white/[0.03] group-hover:scale-110 group-hover:text-white/[0.05] transition-all duration-700" />
            </Link>
          </div>
        </motion.div>

        {/* History Sidebar */}
        <motion.div variants={item} className="space-y-8">
          <h2 className="text-3xl font-black flex items-center gap-3">
            <History className="text-slate-400" size={28} /> Activity
          </h2>
          <div className="glass-card-premium flex flex-col h-[500px]">
            {stats?.recent_history?.length > 0 ? (
              <div className="divide-y divide-white/5 overflow-y-auto custom-scrollbar">
                {stats.recent_history.map((h, i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${h.type === 'quiz' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                          {h.type === 'quiz' ? <BrainCircuit size={18} /> : <Mic2 size={18} />}
                       </div>
                       <div>
                         <div className="font-black text-slate-200 group-hover:text-white transition-colors">{h.title}</div>
                         <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{h.date}</div>
                       </div>
                    </div>
                    <div className="text-sm font-black text-brand-primary bg-brand-primary/10 px-3 py-1.5 rounded-xl">
                      {h.score}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center opacity-30">
                <History size={64} className="mb-6" />
                <p className="text-lg font-bold">No history yet.</p>
                <p className="text-sm mt-2">Your achievements will appear here.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

