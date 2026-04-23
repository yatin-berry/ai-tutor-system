import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { interviewService } from '../services/api';
import { 
  Mic2, 
  Settings2, 
  ChevronRight, 
  Send, 
  User, 
  Sparkles, 
  Loader2,
  Trophy,
  History,
  Info,
  MessageSquare
} from 'lucide-react';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="max-w-4xl mx-auto h-full flex flex-col"
  >
    {children}
  </motion.div>
);

const Interview = () => {
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('Intermediate');
  const [totalQuestions, setTotalQuestions] = useState(3);
  
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [currentStep, setCurrentStep] = useState('setup'); // setup, active, completed
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // [{type: 'ai'|'user', content: string}]
  
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleStart = async () => {
    if (!role) return;
    setLoading(true);
    try {
      const data = await interviewService.startInterview(role, level, totalQuestions);
      setSession(data);
      setChatHistory([{ type: 'ai', content: data.question }]);
      setCurrentStep('active');
    } catch (err) {
      console.error("Interview start failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendAnswer = async (e) => {
    e.preventDefault();
    if (!currentAnswer.trim() || loading) return;

    const answerToSubmit = currentAnswer;
    setCurrentAnswer('');
    setChatHistory(prev => [...prev, { type: 'user', content: answerToSubmit }]);
    setLoading(true);

    try {
      const data = await interviewService.submitAnswer(session.session_id, answerToSubmit);
      
      if (data.is_completed) {
        setChatHistory(prev => [...prev, { type: 'ai', content: data.final_summary?.summary || "Session completed. Great job!" }]);
        setCurrentStep('completed');
      } else {
        setChatHistory(prev => [...prev, { type: 'ai', content: data.question }]);
      }
    } catch (err) {
      console.error("Answer submission failed", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="h-[calc(100vh-120px)] py-6">
      <AnimatePresence mode="wait">
        {currentStep === 'setup' && (
          <PageTransition key="setup">
            <div className="mb-10">
              <h1 className="text-4xl font-black mb-3">AI Interview Coach</h1>
              <p className="text-slate-400">Face high-stakes questions in a simulated environment.</p>
            </div>

            <div className="glass-card-premium p-10 space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                    <Sparkles size={14} className="text-brand-primary" /> Target Role
                  </label>
                  <input 
                    type="text" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="input-standard"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                    <Settings2 size={14} className="text-brand-primary" /> Difficulty Level
                  </label>
                  <div className="flex p-1 rounded-xl" style={{background: '#0d0e15'}}>
                    {["Beginner", "Intermediate", "Advanced"].map(l => (
                      <button
                        key={l}
                        onClick={() => setLevel(l)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${level === l ? 'bg-brand-primary/20 text-brand-primary' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                    <Sparkles size={14} className="text-brand-primary" /> Number of Questions
                  </label>
                  <input 
                    type="number" 
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(e.target.value)}
                    min="1" max="15"
                    className="input-standard"
                  />
                </div>
              </div>

              <div className="bg-brand-primary/5 p-6 rounded-2xl border border-brand-primary/10 flex gap-4">
                <div className="p-3 bg-brand-primary/20 rounded-xl h-fit">
                   <Info className="text-brand-primary" size={20} />
                </div>
                <div className="text-sm leading-relaxed text-slate-400 italic">
                  "This simulation uses behavioral and technical question patterns common at top tech companies. Provide detailed answers to receive the best analysis."
                </div>
              </div>

              <button 
                onClick={handleStart}
                disabled={loading || !role}
                className="btn-primary w-full h-14 text-lg flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : (
                  <>🚀 Initialize Simulation <ChevronRight size={20} /></>
                )}
              </button>
            </div>
          </PageTransition>
        )}

        {currentStep === 'active' && (
          <PageTransition key="active">
            <div className="flex-1 glass-card-premium flex flex-col overflow-hidden h-[calc(100vh-220px)]">
               {/* Chat Header */}
               <div className="px-6 sm:px-10 py-6 border-b border-white/5 bg-white/[0.01] flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center shadow-lg shadow-brand-primary/10">
                        <Mic2 size={24} className="text-brand-primary" />
                     </div>
                     <div>
                        <div className="font-black text-xl leading-tight">{role}</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Live AI Session • {level}</div>
                     </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-red-400/10 border border-red-400/20 text-red-400 text-[10px] font-black tracking-widest uppercase">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Analysis
                  </div>
               </div>

               {/* Chat Area */}
               <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 custom-scrollbar">
                  {chatHistory.map((chat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex gap-4 ${chat.type === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${chat.type === 'ai' ? 'bg-brand-primary/20 text-brand-primary' : 'bg-white/10 text-white'}`}>
                        {chat.type === 'ai' ? <Sparkles size={20} /> : <User size={20} />}
                      </div>
                      <div className={`max-w-[85%] sm:max-w-[70%] p-6 sm:p-8 rounded-[2rem] text-lg font-bold leading-relaxed relative ${
                        chat.type === 'ai' 
                          ? 'glass-card-premium rounded-tl-none border-white/5' 
                          : 'bg-brand-primary text-white rounded-tr-none shadow-2xl shadow-brand-primary/20'
                      }`}>
                        <div className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-50">
                          {chat.type === 'ai' ? 'AI Interviewer' : 'Your Response'}
                        </div>
                        {chat.content}
                        {chat.type === 'ai' && (
                           <div className="absolute -left-2 -top-2 w-6 h-6 bg-brand-primary/20 blur-xl rounded-full" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center shadow-lg text-brand-primary">
                         <Sparkles size={20} className="animate-spin" />
                      </div>
                      <div className="glass-card-premium p-6 rounded-[2rem] rounded-tl-none flex items-center gap-3">
                         <div className="flex gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" />
                         </div>
                         <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Processing response...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
               </div>

               {/* Input Area */}
               <div className="p-6 sm:p-10 border-t border-white/5 bg-white/[0.01]">
                  <form onSubmit={handleSendAnswer} className="relative group">
                    <textarea 
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Type your response here. AI will analyze tone and accuracy..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-3xl pl-8 pr-24 py-6 h-32 focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 resize-none transition-all placeholder:text-slate-600 font-bold text-lg leading-relaxed shadow-inner"
                    />
                    <button 
                      type="submit"
                      disabled={!currentAnswer.trim() || loading}
                      className="absolute right-6 bottom-6 p-5 rounded-2xl bg-brand-primary text-white hover:bg-brand-secondary disabled:opacity-50 transition-all shadow-xl shadow-brand-primary/20 group/btn"
                    >
                      <Send size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </form>
               </div>
            </div>
          </PageTransition>
        )}

        {currentStep === 'completed' && (
          <PageTransition key="completed">
            <div className="max-w-4xl mx-auto pb-20">
               <div className="text-center mb-16">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-24 h-24 rounded-[2.5rem] bg-emerald-500/20 flex items-center justify-center mx-auto mb-10 shadow-3xl shadow-emerald-500/20"
                  >
                    <Trophy size={48} className="text-emerald-500" />
                  </motion.div>
                  <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tighter">Session <span className="gradient-text">Complete.</span></h1>
                  <p className="text-slate-400 text-xl font-medium">Your coach has analyzed your session performance.</p>
               </div>

               <div className="glass-card-premium p-10 sm:p-16 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                     <Sparkles size={64} className="text-brand-primary/10" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-12">
                     <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                        <MessageSquare size={24} />
                     </div>
                     <h3 className="text-3xl font-black">Strategic Evaluation</h3>
                  </div>
                  
                  <div className="space-y-10">
                    {chatHistory.filter(c => c.type === 'ai' && c === chatHistory[chatHistory.length - 1]).map((feedback, idx) => (
                      <div key={idx} className="text-slate-300 leading-[1.8] text-xl font-medium whitespace-pre-wrap px-2 border-l-4 border-brand-primary/20 pl-8 italic">
                        {feedback.content}
                      </div>
                    ))}
                  </div>

                  <div className="mt-16 pt-12 border-t border-white/5 flex flex-col sm:flex-row gap-6">
                     <button onClick={() => setCurrentStep('setup')} className="flex-1 btn-primary py-6 text-xl font-black shadow-xl shadow-brand-primary/20">New Simulation</button>
                     <Link to="/dashboard" className="flex-1 btn-secondary py-6 text-xl font-black text-center flex items-center justify-center">Exit to Dashboard</Link>
                  </div>
               </div>
            </div>
          </PageTransition>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Interview;
