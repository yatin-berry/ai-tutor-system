import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Mail, Lock, LogIn, UserPlus, AlertCircle, Loader2, Sparkles } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.success) navigate('/dashboard');
        else setError(result.error);
      } else {
        const result = await signup(email, password);
        if (result.success) {
          setIsLogin(true);
          setError('Account created! Please login.');
        } else setError(result.error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Left Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary/5 blur-[120px] -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-[440px]"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-secondary to-purple-600 flex items-center justify-center shadow-lg shadow-brand-secondary/20">
              <BrainCircuit size={22} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter gradient-text">Mentra AI</span>
          </div>

          <div className="glass-card-premium p-8 sm:p-10">
            <div className="mb-10">
              <h2 className="text-3xl font-black mb-3">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                {isLogin 
                  ? 'Access your personalized AI learning ecosystem.' 
                  : 'Join 50,000+ learners mastering their craft.'}
              </p>
            </div>

            {/* Toggle Login/Sign Up */}
            <div className="flex p-1 bg-white/5 rounded-2xl mb-8 border border-white/5">
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${isLogin ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${!isLogin ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={20} />
                   <input
                    type="email"
                    required
                    autoComplete="off"
                    className="input-standard pl-12"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={20} />
                   <input
                    type="password"
                    required
                    autoComplete="new-password"
                    className="input-standard pl-12"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-base font-black shadow-xl shadow-brand-primary/20"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  isLogin ? 'Sign In to Dashboard' : 'Create Free Account'
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-xs font-bold text-slate-600 leading-relaxed uppercase tracking-wider">
                By continuing, you agree to our <br />
                <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Terms</span> and <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Marketing Visual (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 bg-dark-900 border-l border-white/5 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-transparent to-brand-secondary/20 -z-0" />
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-brand-primary/30 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-brand-secondary/30 blur-[100px] rounded-full animate-pulse" />
        
        <div className="max-w-md text-center relative z-10 px-10">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8 }}
             className="glass-card-premium p-10"
           >
              <div className="w-20 h-20 rounded-3xl bg-brand-primary/20 flex items-center justify-center mx-auto mb-8 text-brand-primary">
                 <Sparkles size={40} />
              </div>
              <h3 className="text-4xl font-black mb-6 leading-tight">Master Any Skill with AI.</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                "Mentra AI completely transformed how I prepare for technical interviews. The real-time feedback is game-changing."
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10" />
                 <div className="text-left">
                    <div className="text-sm font-black">Yatin Berry</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Software Engineer</div>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
