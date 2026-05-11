import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 👈 1. Import useAuth

const backendUrl = import.meta.env.VITE_MODE==="development" 
? import.meta.env.VITE_BACKEND_URL : import.meta.env.VITE_GLOBE_BACKEND_URL;

// 🛑 2. Remove all props here
export default function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🚀 3. Destructure what you need from Context
  const { token, user, logout } = useAuth();

  // Fetch all courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/courses`, {
          headers: { Authorization: token }
        });
        setCourses(response.data);
      } catch (err) {
        console.error("Courses fetch error:", err);
        // If the token is invalid or expired, log the user out
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout(); 
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if token exists
    if (token) {
      fetchCourses();
    } else {
      // Fallback: If no token exists, stop loading and logout
      setLoading(false);
      logout();
    }
  }, [token, logout]);

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* --- Sticky Navbar --- */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm shadow-lg shadow-blue-500/20 overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold tracking-tight">Nexus <span className="text-blue-500 text-sm">Stream</span></span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right mr-2">
              <p className="text-xs font-bold text-white">{user?.name}</p>
              <p className="text-[10px] text-slate-500">{user?.email}</p>
            </div>
            {/* Display profile picture from Google payload */}
            <img src={user?.picture} className="w-9 h-9 rounded-full border border-slate-700" alt="profile" />
            <button 
              onClick={logout} // 👈 4. Call the logout function from Context
              className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-6 mt-12">
        <header className="mb-10">
          <h2 className="text-3xl font-black mb-2">My Enrolled Courses 📚</h2>
          <p className="text-slate-500 text-sm">Pick a course and continue your learning journey.</p>
        </header>

        {/* --- Course Grid --- */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div 
                key={course._id}
                onClick={() => navigate(`/course/${course._id}`)}
                className="group relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden cursor-pointer hover:border-blue-500/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300"
              >
                {/* Thumbnail Wrapper */}
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={course.thumbnailUrl} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={course.courseTitle} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-3 left-3 bg-blue-600 text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter shadow-lg">
                    Premium Course
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors mb-2 leading-snug">
                    {course.courseTitle}
                  </h3>
                  <div className="flex items-center justify-between mt-6">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Self-Paced</span>
                    <button className="text-xs font-black text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      VIEW CONTENT <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
            <p className="text-slate-400">No courses allocated yet. Contact the admin!</p>
          </div>
        )}
      </main>
    </div>
  );
}