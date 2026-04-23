import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  Mic2, 
  LayoutDashboard, 
  ArrowRight, 
  Sparkles, 
  ChevronRight,
  Check,
  Plus,
  Minus,
  Globe,
  Zap,
  Shield,
  Users,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';

const Landing = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white selection:bg-brand-primary/30 overflow-x-hidden">
      {/* Sticky Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-dark-900/40 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-secondary to-purple-600 flex items-center justify-center shadow-lg shadow-brand-secondary/20">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter gradient-text">Mentra AI</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <div className="h-4 w-px bg-white/10" />
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/login" className="bg-white text-dark-950 px-6 py-2.5 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2">
              Join Now <ChevronRight size={18} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 bg-dark-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="flex flex-col p-6 gap-6 text-lg font-bold">
                <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
                <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
                <a href="#faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
                <hr className="border-white/5" />
                <Link to="/login" className="text-brand-primary">Login</Link>
                <Link to="/login" className="btn-primary py-3 text-center">Get Started Free</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-brand-primary/10 blur-[150px] -z-10 rounded-full animate-pulse" />
        
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-secondary text-xs font-black mb-8 tracking-widest uppercase">
              <Zap size={14} className="animate-bounce" /> Version 2.0 is Live
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black mb-8 leading-[0.9] tracking-tighter">
              The AI Bridge <br />
              <span className="gradient-text">to Your Future.</span>
            </h1>
            <p className="text-lg sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              Don't just study. Evolve. Our AI ecosystem adapts to your learning pace, 
              simulates technical challenges, and transforms your potential into mastery.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/login" className="btn-primary flex items-center justify-center gap-3 text-xl px-10 py-5">
                Start Free Journey <ArrowRight size={24} />
              </Link>
              <button className="btn-secondary text-xl px-10 py-5">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Features Grid */}
      <section id="features" className="py-32 bg-dark-950">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-6xl font-black mb-6">Engineered for Results</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">Three core pillars of the Mentra experience, designed to take you from beginner to industry-ready.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                title: "Adaptive Logic",
                desc: "Our neural engine identifies your knowledge gaps and generates custom quizzes that focus on what you actually need to learn.",
                icon: BrainCircuit,
                color: "from-blue-600 to-indigo-600",
                feature: "AI Generation"
              },
              {
                title: "Shadow Interview",
                desc: "Face an AI interviewer that analyzes your voice, tone, and technical accuracy to provide a comprehensive behavioral breakdown.",
                icon: Mic2,
                color: "from-purple-600 to-pink-600",
                feature: "Real-time Feedback"
              },
              {
                title: "Knowledge Vault",
                desc: "Access a detailed dashboard that visualizes your growth, tracks points, and offers career-aligned learning suggestions.",
                icon: LayoutDashboard,
                color: "from-emerald-600 to-cyan-600",
                feature: "Data-driven Stats"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-premium p-10 group"
              >
                <div className="text-[10px] font-black text-brand-secondary tracking-widest uppercase mb-6 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" /> {feature.feature}
                </div>
                <div className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-3xl font-black mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-lg mb-8">{feature.desc}</p>
                <div className="w-full h-px bg-white/5 mb-8" />
                <div className="flex items-center text-sm font-bold text-slate-300 group-hover:text-white transition-colors cursor-pointer">
                  Explore Feature <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-dark-900/50">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center gap-20">
             <div className="lg:w-1/2">
                <h2 className="text-4xl sm:text-6xl font-black mb-8 leading-tight">Mastery in <span className="gradient-text">Three Steps.</span></h2>
                <div className="space-y-12">
                   {[
                     { step: "01", title: "Generate Challenge", desc: "Select a topic and difficulty. Our AI creates a unique set of challenges just for you." },
                     { step: "02", title: "Interact & Learn", desc: "Engage with the quiz or interview simulation. Receive real-time pointers as you go." },
                     { step: "03", title: "Analyze Growth", desc: "Review your detailed feedback reports and track your climbing knowledge points." }
                   ].map((s, i) => (
                     <div key={i} className="flex gap-8">
                        <div className="text-4xl font-black text-brand-primary opacity-20">{s.step}</div>
                        <div>
                           <h4 className="text-2xl font-bold mb-3">{s.title}</h4>
                           <p className="text-slate-400 text-lg leading-relaxed">{s.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="lg:w-1/2 relative">
                <div className="glass-card-premium p-8 aspect-square flex items-center justify-center relative z-10">
                   <div className="w-full h-full rounded-3xl bg-dark-950/80 p-8 flex flex-col justify-center border border-white/5">
                      <div className="flex items-center gap-4 mb-10">
                         <div className="w-12 h-12 rounded-full bg-brand-primary/20 flex items-center justify-center"><BrainCircuit className="text-brand-primary" /></div>
                         <div className="h-4 w-40 bg-white/10 rounded-full" />
                      </div>
                      <div className="space-y-4">
                         <div className="h-10 w-full bg-white/5 rounded-2xl border border-white/5" />
                         <div className="h-10 w-full bg-brand-primary/10 rounded-2xl border border-brand-primary/20 flex items-center px-4 text-xs font-bold text-brand-primary">Selected Answer ✅</div>
                         <div className="h-10 w-full bg-white/5 rounded-2xl border border-white/5" />
                      </div>
                   </div>
                </div>
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-secondary/20 blur-[80px] -z-0" />
             </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-dark-950">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-6xl font-black mb-6">Simple, Fair Pricing.</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Choose the plan that fits your learning goals. No hidden fees.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Starter", price: "0", desc: "For curious learners.", features: ["5 AI Quizzes / month", "1 Interview Session", "Basic Analytics"], recommended: false },
              { name: "Professional", price: "29", desc: "For career climbers.", features: ["Unlimited AI Quizzes", "10 Interview Sessions", "Advanced Feedback", "Weakness Analysis"], recommended: true },
              { name: "University", price: "Custom", desc: "For institutions.", features: ["Bulk Accounts", "Instructor Dashboard", "API Access", "Dedicated Support"], recommended: false }
            ].map((plan, i) => (
              <div key={i} className={`glass-card-premium p-10 flex flex-col relative ${plan.recommended ? 'border-brand-primary/50 ring-4 ring-brand-primary/10' : ''}`}>
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">Most Popular</div>
                )}
                <div className="mb-10">
                   <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                   <p className="text-slate-500 text-sm">{plan.desc}</p>
                </div>
                <div className="flex items-baseline gap-1 mb-10">
                   <span className="text-5xl font-black">{plan.price === "Custom" ? "" : "$"}</span>
                   <span className="text-6xl font-black">{plan.price}</span>
                   <span className="text-slate-500 font-bold">{plan.price === "Custom" ? "" : "/mo"}</span>
                </div>
                <div className="space-y-5 flex-1 mb-12">
                   {plan.features.map((f, j) => (
                     <div key={j} className="flex items-center gap-3 text-slate-300 font-medium">
                        <div className="w-5 h-5 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0">
                           <Check size={12} className="text-brand-primary" />
                        </div>
                        {f}
                     </div>
                   ))}
                </div>
                <button className={`w-full py-4 rounded-2xl font-black transition-all ${plan.recommended ? 'btn-primary' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                  {plan.price === "0" ? "Start Free" : "Subscribe Now"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-dark-900/30">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-6xl font-black mb-6">Common Questions</h2>
            <p className="text-slate-400 text-lg">Everything you need to know about Mentra AI.</p>
          </div>

          <div className="space-y-4">
             {[
               { q: "How accurate is the AI evaluation?", a: "Our system uses state-of-the-art LLMs trained on millions of technical interview patterns. For coding and technical answers, the accuracy is over 95%." },
               { q: "Can I use it on my mobile phone?", a: "Yes! Mentra is fully responsive and optimized for mobile browsers, so you can practice your quizzes on the go." },
               { q: "What topics are covered in the quizzes?", a: "Almost anything. From Data Science and Web Development to History and Philosophy. If there is documentation on it, our AI can teach it." },
               { q: "Is there a student discount?", a: "Our Starter plan is free forever. For students needing Pro features, we offer a 50% discount via university email verification." }
             ].map((faq, i) => (
               <div key={i} className="glass-card-premium overflow-hidden">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 sm:p-8 text-left hover:bg-white/[0.01] transition-colors"
                  >
                    <span className="text-xl font-bold">{faq.q}</span>
                    <div className="p-2 rounded-xl bg-white/5 text-slate-400">
                       {activeFaq === i ? <Minus size={20} /> : <Plus size={20} />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 sm:px-8 pb-8 text-slate-400 leading-relaxed text-lg"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary/10 -z-10" />
        <div className="container-custom text-center">
           <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             viewport={{ once: true }}
             className="glass-card-premium p-16 sm:p-24"
           >
              <h2 className="text-5xl sm:text-7xl font-black mb-8 leading-[1.1]">Ready to Evolve?</h2>
              <p className="text-xl text-slate-400 mb-12 max-w-xl mx-auto font-medium">Join 50,000+ students and professionals who are already mastering their craft with Mentra AI.</p>
              <Link to="/login" className="btn-primary inline-flex items-center gap-3 text-xl px-12 py-5">
                 Get Started Free <ChevronRight size={24} />
              </Link>
           </motion.div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="py-24 bg-dark-950 border-t border-white/5">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 text-center sm:text-left">
            <div className="space-y-6">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Sparkles size={24} className="text-brand-primary" />
                <span className="text-2xl font-black tracking-tighter">Mentra AI</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Empowering the next generation of professionals with adaptive AI learning ecosystems.
              </p>
            </div>
            <div>
               <h5 className="font-black mb-6 uppercase tracking-widest text-xs text-slate-100">Product</h5>
               <ul className="space-y-4 text-slate-500 font-bold">
                  <li><a href="#features" className="hover:text-brand-primary transition-colors">Adaptive Quizzes</a></li>
                  <li><a href="#features" className="hover:text-brand-primary transition-colors">Interview Coach</a></li>
                  <li><a href="#pricing" className="hover:text-brand-primary transition-colors">Pricing</a></li>
               </ul>
            </div>
            <div>
               <h5 className="font-black mb-6 uppercase tracking-widest text-xs text-slate-100">Company</h5>
               <ul className="space-y-4 text-slate-500 font-bold">
                  <li><a href="#" className="hover:text-brand-primary transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-brand-primary transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-brand-primary transition-colors">Blog</a></li>
               </ul>
            </div>
            <div>
               <h5 className="font-black mb-6 uppercase tracking-widest text-xs text-slate-100">Connect</h5>
               <ul className="space-y-4 text-slate-500 font-bold">
                  <li><a href="#" className="hover:text-brand-primary transition-colors">Twitter</a></li>
                  <li><a href="#" className="hover:text-brand-primary transition-colors">Discord</a></li>
                  <li><a href="#" className="hover:text-brand-primary transition-colors">Contact Support</a></li>
               </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-600 text-sm font-bold">
            <p>© 2024 Mentra AI. All rights reserved.</p>
            <div className="flex gap-8">
               <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
