import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { quizService } from '../services/api';
import { 
  BrainCircuit, 
  Settings2, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw,
  Sparkles,
  Trophy,
  BarChart3,
  History,
  ChevronDown
} from 'lucide-react';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="max-w-4xl mx-auto"
  >
    {children}
  </motion.div>
);

const Quiz = () => {
  const [subject, setSubject] = useState('Machine Learning');
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [currentStep, setCurrentStep] = useState('setup'); // setup, active, results
  const [userAnswers, setUserAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const data = await quizService.generateQuestions(subject, topic, level, numQuestions);
      if (data.status === 'success') {
        setQuizData(data.data);
        setCurrentStep('active');
        setUserAnswers({});
      }
    } catch (err) {
      console.error("Quiz generation failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionIdx, answer) => {
    setUserAnswers(prev => ({ ...prev, [questionIdx]: answer }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Convert userAnswers object to a sorted list of strings
      const answersList = quizData.map((_, i) => userAnswers[i] || "");
      
      const data = await quizService.submitQuiz(subject, topic, level, quizData, answersList);
      setResult(data);
      setCurrentStep('results');
    } catch (err) {
      console.error("Quiz submission failed", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="py-10">
      <AnimatePresence mode="wait">
        {currentStep === 'setup' && (
          <PageTransition key="setup">
            <div className="mb-12">
              <h1 className="text-4xl font-black mb-3">AI Quiz Generator</h1>
              <p className="text-slate-400">Customize your session and let AI craft the perfect challenge.</p>
            </div>

            <div className="glass-card-premium p-10 space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                    <Sparkles size={14} className="text-brand-primary" /> Select Subject
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                      className="input-standard w-full flex items-center justify-between"
                    >
                      <span>{subject}</span>
                      <ChevronDown size={20} className={`transition-transform duration-300 ${isSubjectDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isSubjectDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl shadow-black z-50 max-h-60 overflow-y-auto custom-scrollbar"
                        >
                          {["Machine Learning", "Data Science", "Web Development", "Blockchain", "Artificial Intelligence", "Cybersecurity"].map(s => (
                            <button
                              key={s}
                              onClick={() => {
                                setSubject(s);
                                setIsSubjectDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${subject === s ? 'bg-brand-primary/20 text-brand-primary font-bold' : 'text-slate-300 hover:bg-white/5'}`}
                            >
                              {s}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                    <Settings2 size={14} className="text-brand-primary" /> Enter Topic
                  </label>
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Transformers or LLMs"
                    className="input-standard"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                    <BarChart3 size={14} className="text-brand-primary" /> Select Level
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

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                    <BarChart3 size={14} className="text-brand-primary" /> Number of Questions
                  </label>
                  <input 
                    type="number" 
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                    min="1" max="20"
                    className="input-standard"
                  />
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading || !topic}
                className="btn-primary w-full h-14 text-lg flex items-center justify-center gap-2 shadow-xl shadow-brand-primary/20"
              >
                {loading ? <RefreshCcw size={24} className="animate-spin" /> : (
                  <>🚀 Generate Questions <ChevronRight size={20} /></>
                )}
              </button>
            </div>
          </PageTransition>
        )}

        {currentStep === 'active' && (
          <PageTransition key="active">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/[0.01] p-6 rounded-3xl border border-white/5">
                  <div>
                    <h2 className="text-3xl font-black mb-1">{topic}</h2>
                    <div className="flex gap-4 text-xs font-black text-slate-500 uppercase tracking-widest">
                      <span className="text-brand-primary">{level}</span>
                      <span>•</span>
                      <span>{quizData.length} Questions</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                       <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Session Progress</div>
                       <div className="text-2xl font-black tracking-tighter text-brand-primary">
                        {Object.keys(userAnswers).length} <span className="text-slate-600">/ {quizData.length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 pb-10">
                  {quizData.map((q, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="glass-card-premium p-8 sm:p-10 relative overflow-hidden"
                    >
                      <div className="flex items-center gap-3 mb-8 text-brand-primary font-black uppercase tracking-widest text-[10px]">
                         <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_#818cf8]" /> 
                         Question {idx + 1}
                      </div>
                      <h3 className="text-2xl font-bold mb-10 leading-relaxed text-slate-100">{q.question}</h3>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {q.type === 'mcq' || q.type === 'true_false' ? (
                          <div className="grid sm:grid-cols-2 gap-4">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = userAnswers[idx] === opt;
                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleSelectAnswer(idx, opt)}
                                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-300 group ${
                                    isSelected 
                                      ? 'bg-brand-primary/10 border-brand-primary text-white shadow-xl shadow-brand-primary/10' 
                                      : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-slate-400 hover:text-white'
                                  }`}
                                >
                                  <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center shrink-0 font-black text-xs transition-colors ${isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'border-white/10 bg-white/5 text-slate-600'}`}>
                                    {String.fromCharCode(65 + optIdx)}
                                  </div>
                                  <span className="font-bold text-base">{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        ) : q.type === 'fill' ? (
                          <div className="space-y-4">
                            <input
                              type="text"
                              placeholder="Type your exact answer here..."
                              className="input-standard h-16 py-4 w-full"
                              value={userAnswers[idx] || ''}
                              onChange={(e) => handleSelectAnswer(idx, e.target.value)}
                            />
                            <div className="flex items-center gap-2 px-2">
                               <Sparkles size={14} className="text-brand-primary" />
                               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Provide a short, exact word or phrase.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <textarea
                              placeholder="Type your comprehensive answer here..."
                              className="input-standard h-40 py-6 resize-none w-full"
                              value={userAnswers[idx] || ''}
                              onChange={(e) => handleSelectAnswer(idx, e.target.value)}
                            />
                            <div className="flex items-center gap-2 px-2">
                               <Sparkles size={14} className="text-brand-primary" />
                               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">AI will analyze your written response for technical accuracy.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  <button 
                    onClick={handleSubmit}
                    disabled={loading || Object.keys(userAnswers).length < quizData.length}
                    className="btn-primary w-full h-20 text-xl font-black shadow-2xl shadow-brand-primary/20 group"
                  >
                    {loading ? (
                       <div className="flex items-center gap-3">
                          <RefreshCcw size={24} className="animate-spin" />
                          <span>Generating AI Feedback...</span>
                       </div>
                    ) : (
                      <div className="flex items-center gap-3">
                         <span>Submit Quiz Performance</span>
                         <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </PageTransition>
        )}

        {currentStep === 'results' && (
          <PageTransition key="results">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="w-24 h-24 rounded-[2rem] bg-brand-primary/20 flex items-center justify-center mx-auto mb-10 shadow-3xl shadow-brand-primary/20"
                >
                  <Trophy size={48} className="text-brand-primary" />
                </motion.div>
                <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tighter">Evaluation <span className="gradient-text">Complete.</span></h1>
                <div className="flex flex-col items-center">
                   <div className="text-9xl font-black tracking-tighter mb-4">{result.accuracy}%</div>
                   <div className="h-1.5 w-40 bg-white/5 rounded-full overflow-hidden mb-4">
                      <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${result.accuracy}%` }}
                         className="h-full bg-brand-primary shadow-[0_0_15px_#818cf8]"
                      />
                   </div>
                   <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Accuracy Quotient</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
                <div className="glass-card-premium p-8 text-center border-emerald-500/20">
                   <div className="text-4xl font-black text-emerald-500 mb-2">
                     {result.results.filter(r => r.score === 1).length}
                   </div>
                   <div className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Correct Response</div>
                </div>
                <div className="glass-card-premium p-8 text-center border-red-500/20">
                   <div className="text-4xl font-black text-red-500 mb-2">
                     {result.results.filter(r => r.score === 0).length}
                   </div>
                   <div className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Incorrect Response</div>
                </div>
                <div className="glass-card-premium p-8 text-center border-brand-secondary/20">
                   <div className="text-4xl font-black text-brand-secondary mb-2">{result.total_score || 0}</div>
                   <div className="text-slate-500 font-black uppercase text-[10px] tracking-widest">XP Gained</div>
                </div>
              </div>

              <div className="space-y-8 mb-16">
                 <h3 className="text-3xl font-black flex items-center gap-4 px-2">
                   <History className="text-slate-600" size={32} /> Performance Review
                 </h3>
                 {result.results.map((ev, i) => (
                   <motion.div 
                     key={i} 
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className={`glass-card-premium p-8 sm:p-10 border-l-[6px] ${ev.score === 1 ? 'border-l-emerald-500' : 'border-l-red-500'}`}
                   >
                     <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
                       <h4 className="text-xl font-bold leading-relaxed text-slate-100">{ev.question}</h4>
                       {ev.score === 1 ? (
                         <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                            <CheckCircle2 size={16} /> Perfect
                         </div>
                       ) : (
                         <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 font-black text-[10px] uppercase tracking-widest">
                            <XCircle size={16} /> Improved
                         </div>
                       )}
                     </div>
                     
                     <div className="grid gap-6">
                       <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Your Answer</div>
                          <div className={`text-lg font-bold ${ev.score === 1 ? 'text-emerald-400' : 'text-red-400'}`}>{ev.user_answer}</div>
                       </div>
                       
                       {ev.score === 0 && (
                          <div className="p-6 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10">
                            <div className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mb-3">Optimal Solution</div>
                            <div className="text-emerald-400 text-lg font-bold">{ev.correct_answer}</div>
                          </div>
                       )}
                       
                       <div className="p-6 rounded-2xl bg-brand-primary/[0.03] border border-brand-primary/10 relative overflow-hidden">
                          <div className="text-[10px] font-black text-brand-primary/60 uppercase tracking-widest mb-3">AI Deep Analysis</div>
                          <div className="text-slate-400 text-base leading-relaxed italic">
                             {ev.explanation}
                          </div>
                          <Sparkles className="absolute -right-4 -bottom-4 w-24 h-24 text-brand-primary/[0.03]" />
                       </div>
                     </div>
                   </motion.div>
                 ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={() => setCurrentStep('setup')}
                  className="flex-1 btn-primary py-6 text-xl font-black"
                >
                  New Session
                </button>
                <Link to="/dashboard" className="flex-1 btn-secondary py-6 text-xl font-black text-center flex items-center justify-center">
                  Exit to Dashboard
                </Link>
              </div>
            </div>
          </PageTransition>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
