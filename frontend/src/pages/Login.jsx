// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from "jwt-decode";
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // 👈 1. Import Context

// const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// // 🛑 2. Props లోపల { setUser, setToken } తీసేసాం
// export default function Login() {
//   const navigate = useNavigate();
//   const { login } = useAuth(); // 👈 3. Context నుండి login ఫంక్షన్ తెచ్చుకున్నాం

//   const handleLoginSuccess = async (res) => {
//     const userToken = res.credential;

//     try {
//       // 1. 🛡️ BACKEND AUTH CHECK
//       const response = await axios.get(`${backendUrl}/api/courses`, {
//         headers: { Authorization: userToken }
//       });

//       console.log("res : ", response);

//       // 2. Access Granted
//       const decoded = jwtDecode(userToken);
      
//       // 🚀 4. Context ఫంక్షన్ ని కాల్ చేసాం
//       // ఇది ఆటోమేటిక్ గా localStorage ని అప్డేట్ చేసి, యాప్ స్టేట్ ని మారుస్తుంది
//       login(decoded, userToken);

//       // Redirect to Courses Dashboard
//       navigate('/courses');

//     } catch (err) {
//       console.error("Login Error:", err);
//       alert("Access Denied: Nee email ki permission ledu bro! Contact Admin.");
//     }
//   };

//   const handleLoginError = () => {
//     alert("Google Login Failed! Try again.");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6">
//       {/* Design Part */}
//       <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center">
//         <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
//           <span className="text-4xl">🎓</span>
//         </div>
        
//         <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Coders LMS</h1>
//         <p className="text-slate-400 mb-8 text-sm">Full Stack Development Masterclass</p>

//         <div className="flex justify-center">
//           <GoogleOAuthProvider clientId={clientId}>
//             <GoogleLogin 
//               onSuccess={handleLoginSuccess} 
//               onError={handleLoginError}
//               theme="filled_blue"
//               shape="pill"
//               text="continue_with"
//             />
//           </GoogleOAuthProvider>
//         </div>

//         <p className="mt-8 text-[10px] text-slate-500 uppercase tracking-widest">
//           Secure Access • Restricted to Enrolled Students
//         </p>
//       </div>
//     </div>
//   );
// }



import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const backendUrl = import.meta.env.VITE_MODE==="development" 
? import.meta.env.VITE_BACKEND_URL : import.meta.env.VITE_GLOBE_BACKEND_URL;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleLoginSuccess = async (res) => {
    const userToken = res.credential;

    try {
      const response = await axios.get(`${backendUrl}/api/courses`, {
        headers: { Authorization: userToken }
      });

      console.log("res : ", response);

      const decoded = jwtDecode(userToken);
      login(decoded, userToken);
      navigate('/courses');

    } catch (err) {
      console.error("Login Error:", err);
      alert("Access Denied: Nee email ki permission ledu bro! Contact Admin.");
    }
  };

  const handleLoginError = () => {
    alert("Google Login Failed! Try again.");
  };

  return (
    // 1. Full Screen Background with strict dark theme
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#050B14] p-4 sm:p-6 overflow-hidden w-full">
      
      {/* 2. Premium Background Glow (Center) - Scales for mobile/desktop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-blue-600/20 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none"></div>

      {/* 3. Main Login Card - Responsive Width and Glassmorphism */}
      <div className="relative w-full max-w-[90%] sm:max-w-md bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl p-8 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl text-center z-10">
        
        {/* 4. Animated Premium Icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-blue-600/20 to-cyan-400/10 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.15)] overflow-hidden hover:scale-105 transition-transform duration-500">
          <img src="/logo.png" alt="Nexus Stream Logo" className="w-full h-full object-cover" />
        </div>
        
        {/* 5. Typography - Gradient Text */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-3">
          Nexus Stream
        </h1>
        <p className="text-slate-400 mb-10 text-sm sm:text-base font-medium">
          Premium Full Stack Masterclass
        </p>

        {/* 6. Google Login Button Wrapper */}
        <div className="flex justify-center hover:scale-[1.02] active:scale-95 transition-all duration-300">
          <div className="p-1 rounded-full bg-white/[0.05] border border-white/10 hover:border-blue-500/30 transition-colors">
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLogin 
                onSuccess={handleLoginSuccess} 
                onError={handleLoginError}
                theme="filled_black" // Changed to black to match dark theme better
                shape="pill"
                text="continue_with"
                size="large" // Ensures it looks good on all screens
              />
            </GoogleOAuthProvider>
          </div>
        </div>

        {/* 7. Footer Text */}
        <div className="mt-10 flex items-center justify-center gap-2 text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500/50 border border-emerald-500 animate-pulse"></span>
          Restricted Access Only
        </div>
      </div>
      
    </div>
  );
}