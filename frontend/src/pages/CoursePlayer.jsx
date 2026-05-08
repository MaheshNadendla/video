import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // 👈 URL nunchi params theskodaniki
import { useAuth } from '../context/AuthContext';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const containerRef = useRef(null);

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

  // 2. Play/Pause Sync
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
      audioRef.current.pause();
    } else {
      videoRef.current.play();
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 3. Main Sync & Progress Update Logic
  const handleTimeUpdate = () => {
    if (Math.abs(videoRef.current.currentTime - audioRef.current.currentTime) > 0.5) {
      audioRef.current.currentTime = videoRef.current.currentTime;
    }
    setProgress(videoRef.current.currentTime);
  };

  // 4. Seek Bar Logic
  const handleSeek = (e) => {
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
                  onClick={togglePlay}
                  poster={currentLesson.thumbnailUrl || "https://via.placeholder.com/1280x720/0f172a/3b82f6?text=Loading+Video..."}
                >
                  <source src={`${backendUrl}/api/stream/${currentLesson.videoDriveId}?token=${token}`} type="video/mp4" />
                </video>

                <audio ref={audioRef} key={currentLesson.audioDriveId}>
                  <source src={`${backendUrl}/api/stream/${currentLesson.audioDriveId}?token=${token}`} type="audio/mp3" />
                </audio>

                {/* 🆕 CUSTOM TIMELINE OVERLAY */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <input 
                    type="range"
                    min="0"
                    max={videoRef.current?.duration || 0}
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-2"
                  />
                  <div className="flex justify-between text-xs text-slate-300 font-mono">
                    <div className="flex items-center gap-3">
                      <span>{formatTime(videoRef.current?.currentTime)} / {formatTime(videoRef.current?.duration)}</span>
                    </div>
                   
                    {/* 🔳 THE FULL SCREEN BUTTON */}
                    <button 
                      onClick={toggleFullScreen} 
                      className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
                      title="Toggle Fullscreen"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                      </svg>
                    </button>
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
              <button onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)} className="p-3 bg-slate-700 rounded-xl hover:bg-slate-600 text-white">⏪ 10s</button>
              <button 
                onClick={togglePlay} 
                className="bg-blue-600 px-10 py-3 rounded-2xl font-black text-white hover:bg-blue-500 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] active:scale-95"
              >
                {isPlaying ? "PAUSE ||" : "PLAY ▶"}
              </button>
              <button onClick={() => videoRef.current && (videoRef.current.currentTime += 10)} className="p-3 bg-slate-700 rounded-xl hover:bg-slate-600 text-white">10s ⏩</button>
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