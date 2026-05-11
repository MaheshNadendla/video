import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // 👈 URL nunchi params theskodaniki
import { useAuth } from '../context/AuthContext';

const backendUrl = import.meta.env.VITE_MODE==="development" 
? import.meta.env.VITE_BACKEND_URL : import.meta.env.VITE_GLOBE_BACKEND_URL;

export default function CoursePlayer() {
  // 1. URL nunchi courseId, lessonId rendu theskuntunnam
  const { courseId, lessonId } = useParams(); 
  const navigate = useNavigate();
  const { token } = useAuth();

  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // 2. Fetch Lessons & Set Current Lesson
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/courses/${courseId}/lessons`, {
          headers: { Authorization: token }
        });
        
        const fetchedLessons = res.data;
        setLessons(fetchedLessons);

        if (fetchedLessons.length > 0) {
          // 🚀 LOGIC: URL lo lessonId unte adi vethuku, lekapothe 1st video pettu
          if (lessonId) {
            const selectedVideo = fetchedLessons.find(l => l._id === lessonId);
            setCurrentLesson(selectedVideo || fetchedLessons[0]);
          } else {
            setCurrentLesson(fetchedLessons[0]);
            // Optional: URL ni 1st video id tho update cheyadam
            // navigate(`/course/${courseId}/${fetchedLessons[0]._id}`, { replace: true });
          }
        }
      } catch (err) {
        console.error("Lessons load error!", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && token) {
      fetchLessons();
    }
  }, [courseId, token]); // 👈 Only run on course load


  // 3. URL lo lessonId marina prathi sari video change avvali
  useEffect(() => {
    if (lessons.length > 0 && lessonId) {
      const selectedVideo = lessons.find(l => l._id === lessonId);
      if (selectedVideo && selectedVideo._id !== currentLesson?._id) {
        setCurrentLesson(selectedVideo);
        setIsPlaying(false);
        setProgress(0);
        if (videoRef.current) videoRef.current.currentTime = 0;
        if (audioRef.current) audioRef.current.currentTime = 0;
      }
    }
  }, [lessonId, lessons]); // 👈 Runs when user clicks a different lesson

  // 4. Auto-hide controls logic
  useEffect(() => {
    const handleActivity = () => {
      if (isLocked) return;
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleActivity);
      container.addEventListener('touchstart', handleActivity);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleActivity);
        container.removeEventListener('touchstart', handleActivity);
      }
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, isLocked]);

  // 2. Play/Pause Sync
  const togglePlay = () => {
    if (isLocked) return;
    if (isPlaying) {
      videoRef.current.pause();
      audioRef.current.pause();
    } else {
      videoRef.current.play();
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  const handleSkip = (seconds) => {
    if (isLocked) return;
    const newTime = Math.min(Math.max(videoRef.current.currentTime + seconds, 0), duration);
    videoRef.current.currentTime = newTime;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const toggleLock = (e) => {
    e.stopPropagation();
    setIsLocked(!isLocked);
    if (!isLocked) {
      setShowControls(false); // Hide controls immediately when locking
    } else {
      setShowControls(true); // Show controls when unlocking
    }
  };

  // 3. Main Sync & Progress Update Logic
  const handleTimeUpdate = () => {
    if (Math.abs(videoRef.current.currentTime - audioRef.current.currentTime) > 0.5) {
      audioRef.current.currentTime = videoRef.current.currentTime;
    }
    setProgress(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  // 4. Seek Bar Logic
  const handleSeek = (e) => {
    if (isLocked) return;
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  // 5. Helper: Format Seconds to MM:SS
  const formatTime = (time) => {
    if (!time) return "00:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (loading) return <div className="text-center mt-20 text-blue-500 font-bold">Loading Course Content... 🚀</div>;

  return (
    <div className="max-w-[1400px] mx-auto p-4 lg:p-0">
      {/* Top Header */}
      <div className="flex items-center gap-4 mb-6 mt-4">
        {/* 🔙 6. Replaced onBack with navigate */}
        <button onClick={() => navigate('/courses')} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-blue-400 transition-colors">
          ← Back
        </button>
        <h2 className="text-xl font-bold truncate text-slate-100">{currentLesson?.title || "No lessons found"}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT: PLAYER SECTION */}
        <div className="lg:col-span-3 space-y-4">
          <div ref={containerRef} className="relative bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 aspect-video group">
            {currentLesson ? (
              <>
                <video 
                  ref={videoRef}
                  key={currentLesson.videoDriveId}
                  className="w-full h-full object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onClick={togglePlay}
                  poster={currentLesson.thumbnailUrl || "https://via.placeholder.com/1280x720/0f172a/3b82f6?text=Loading+Video..."}
                >
                  <source src={`${backendUrl}/api/stream/${currentLesson.videoDriveId}?token=${token}`} type="video/mp4" />
                </video>

                <audio ref={audioRef} key={currentLesson.audioDriveId}>
                  <source src={`${backendUrl}/api/stream/${currentLesson.audioDriveId}?token=${token}`} type="audio/mp3" />
                </audio>

                {/* 🔒 LOCK BUTTON */}
                <button 
                  onClick={toggleLock}
                  className={`absolute top-4 left-4 z-50 p-3 rounded-full transition-all duration-300 ${
                    showControls || isLocked ? 'opacity-100' : 'opacity-0'
                  } ${isLocked ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'}`}
                >
                  {isLocked ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
                  )}
                </button>

                {/* 🆕 PROFESSIONAL OVERLAY */}
                <div className={`absolute inset-0 flex flex-col justify-between bg-black/40 transition-opacity duration-300 ${
                  showControls && !isLocked ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}>
                  
                  {/* CENTRAL CONTROLS */}
                  <div className="flex-1 flex items-center justify-center gap-12 sm:gap-20">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSkip(-30); }}
                      className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all active:scale-90 group"
                      title="Rewind 30s"
                    >
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                      </svg>
                      <span className="absolute mt-12 text-xs font-bold text-white opacity-0 group-hover:opacity-100">-30s</span>
                    </button>

                    <button 
                      onClick={togglePlay}
                      className="p-6 rounded-full bg-blue-600 hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/30"
                    >
                      {isPlaying ? (
                        <svg className="w-10 h-10 sm:w-14 sm:h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      ) : (
                        <svg className="w-10 h-10 sm:w-14 sm:h-14 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>

                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSkip(30); }}
                      className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all active:scale-90 group"
                      title="Forward 30s"
                    >
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                      </svg>
                      <span className="absolute mt-12 text-xs font-bold text-white opacity-0 group-hover:opacity-100">+30s</span>
                    </button>
                  </div>

                  {/* BOTTOM TIMELINE OVERLAY */}
                  <div className="p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                    <input 
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={progress}
                      onChange={handleSeek}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-3 hover:h-2 transition-all"
                    />
                    <div className="flex justify-between items-center text-sm text-slate-200 font-mono">
                      <div className="flex items-center gap-4">
                        <span className="bg-black/40 px-2 py-1 rounded">{formatTime(videoRef.current?.currentTime)} / {formatTime(duration)}</span>
                      </div>
                    
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={toggleFullScreen} 
                          className="p-2 hover:bg-white/20 rounded-full transition-colors"
                          title="Toggle Fullscreen"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                No video selected
              </div>
            )}
          </div>

          {/* BOTTOM CONTROLS */}
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-white">{currentLesson?.title || "No Title"}</h1>
              <p className="text-sm text-slate-400">Lesson {currentLesson?.sNo || "-"}</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleSkip(-30)} 
                className={`p-3 bg-slate-700 rounded-xl hover:bg-slate-600 text-white transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLocked}
              >
                ⏪ 30s
              </button>
              <button 
                onClick={togglePlay} 
                className={`bg-blue-600 px-10 py-3 rounded-2xl font-black text-white hover:bg-blue-500 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] active:scale-95 ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLocked}
              >
                {isPlaying ? "PAUSE ||" : "PLAY ▶"}
              </button>
              <button 
                onClick={() => handleSkip(30)} 
                className={`p-3 bg-slate-700 rounded-xl hover:bg-slate-600 text-white transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLocked}
              >
                30s ⏩
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: SIDEBAR PLAYLIST */}
        <div className="lg:col-span-1 bg-slate-800 rounded-3xl border border-slate-700 flex flex-col h-[600px] shadow-xl">
          <div className="p-5 border-b border-slate-700 bg-slate-900/30">
            <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest">Course Content</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {lessons.map((lesson) => (
              <div 
                key={lesson._id}
                onClick={() => {
                  setCurrentLesson(lesson);
                  setIsPlaying(false);
                  setProgress(0);
                  if (videoRef.current) videoRef.current.currentTime = 0;
                  if (audioRef.current) audioRef.current.currentTime = 0;
                  navigate(`/course/${courseId}/${lesson._id}`);
                }}
                className={`group flex items-center gap-4 p-4 mb-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                  currentLesson?._id === lesson._id 
                    ? 'bg-blue-600/20 border border-blue-500/30' 
                    : 'hover:bg-slate-700/50 border border-transparent'
                }`}
              >
                <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-sm ${
                  currentLesson?._id === lesson._id ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-700 text-slate-400'
                }`}>
                  {lesson.sNo}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-semibold truncate ${currentLesson?._id === lesson._id ? 'text-blue-400' : 'text-slate-200'}`}>
                    {lesson.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">High Quality Stream</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}