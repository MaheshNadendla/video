// 1. React Router Imports (This was missing!)
import { Routes, Route, Navigate } from 'react-router-dom';

// 2. Context & Protection Imports
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// 3. Page Components Imports (Make sure these paths match your folders)
import Login from './pages/Login';
import AllCourses from './pages/AllCourses';
import CoursePlayer from './pages/CoursePlayer';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/courses" />} />
      
      {/* 🔒 Protected Routes */}
      <Route path="/courses" element={
        <ProtectedRoute>
          <AllCourses />
        </ProtectedRoute>
      } />
      
      <Route path="/course/:courseId/:lessonId?" element={
        <ProtectedRoute>
          <CoursePlayer />
        </ProtectedRoute>
      } />

      {/* Optional: Add a catch-all route to redirect unknown URLs to login or courses */}
      <Route path="*" element={<Navigate to={user ? "/courses" : "/login"} />} />
    </Routes>
  );
}