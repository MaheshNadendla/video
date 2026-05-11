import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      {/* 1. Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-bold tracking-tight">Nexus <span className="text-blue-500">Stream</span></span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 bg-white text-black font-bold rounded-full hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-lg"
        >
          Student Login
        </button>
      </nav>

      {/* 2. Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-[0.2em]">
          Master Full Stack Development 🚀
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
          Learn Coding Like a <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Professional Engineer.</span>
        </h1>

        <p className="max-w-2xl text-slate-400 text-lg mb-12 leading-relaxed">
          MERN Stack, System Design, and Real-world Projects. High-quality recorded sessions with synced audio-video experience. Join the community and start building.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-10 py-4 bg-blue-600 rounded-2xl font-black text-lg hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all active:scale-95"
          >
            Start Learning Now
          </button>
          <button className="px-10 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all text-slate-300">
            View Syllabus
          </button>
        </div>

        {/* 3. Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full">
          <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl text-left hover:border-blue-500/50 transition-colors group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">🎥</div>
            <h3 className="text-xl font-bold mb-2">Synced Streaming</h3>
            <p className="text-slate-500 text-sm">Experience lag-free video and audio synchronization for better focus.</p>
          </div>
          <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl text-left hover:border-blue-500/50 transition-colors group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">🔒</div>
            <h3 className="text-xl font-bold mb-2">Private Access</h3>
            <p className="text-slate-500 text-sm">Secure Google OAuth integration. Only enrolled students can access the content.</p>
          </div>
          <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl text-left hover:border-blue-500/50 transition-colors group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">🛠️</div>
            <h3 className="text-xl font-bold mb-2">Hands-on Projects</h3>
            <p className="text-slate-500 text-sm">Build real apps like this LMS platform from scratch using the MERN stack.</p>
          </div>
        </div>
      </main>

      {/* 4. Footer */}
      <footer className="border-t border-slate-900 py-12 text-center text-slate-600 text-sm">
        © 2026 Nexus Stream. Developed with ❤️ for Developers.
      </footer>
    </div>
  );
}