import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import CourseRegistration from './pages/CourseRegistration';
import AdminCourseSections from './pages/AdminCourseSections';
import AdminManagement from './pages/AdminManagement';
import StudyPlan from './pages/StudyPlan';
import AcademicResult from './pages/AcademicResult';
import WaitlistStatus from './pages/WaitlistStatus';
import TuitionPayment from './pages/TuitionPayment';
import AdminStats from './pages/AdminStats';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {user && <Navbar user={user} onLogout={handleLogout} />}
        
        <div style={{ flex: 1 }}>
          <Routes>
            {/* Public route */}
            <Route 
              path="/login" 
              element={
                user ? (
                  user.vaiTro === 'GIAO_VU' ? (
                    <Navigate to="/admin/course-sections" replace />
                  ) : (
                    <Navigate to="/student/dashboard" replace />
                  )
                ) : (
                  <Login onLoginSuccess={handleLoginSuccess} />
                )
              } 
            />

            {/* Student routes */}
            <Route 
              path="/student/dashboard" 
              element={
                user && user.vaiTro === 'SINH_VIEN' ? (
                  <StudentDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />

            <Route 
              path="/student/registration" 
              element={
                user && user.vaiTro === 'SINH_VIEN' ? (
                  <CourseRegistration />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />

            <Route 
              path="/student/study-plan" 
              element={
                user && user.vaiTro === 'SINH_VIEN' ? (
                  <StudyPlan />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />

            <Route 
              path="/student/results" 
              element={
                user && user.vaiTro === 'SINH_VIEN' ? (
                  <AcademicResult />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />

            <Route 
              path="/student/waitlist" 
              element={
                user && user.vaiTro === 'SINH_VIEN' ? (
                  <WaitlistStatus />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />

            <Route 
              path="/student/tuition" 
              element={
                user && user.vaiTro === 'SINH_VIEN' ? (
                  <TuitionPayment />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />

            {/* Admin routes */}
            <Route 
              path="/admin/course-sections" 
              element={
                user && user.vaiTro === 'GIAO_VU' ? (
                  <AdminCourseSections />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />

            <Route 
              path="/admin/management" 
              element={
                user && user.vaiTro === 'GIAO_VU' ? (
                  <AdminManagement />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />

            <Route 
              path="/admin/stats" 
              element={
                user && user.vaiTro === 'GIAO_VU' ? (
                  <AdminStats />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />

            {/* Default redirect */}
            <Route 
              path="*" 
              element={
                user ? (
                  user.vaiTro === 'GIAO_VU' ? (
                    <Navigate to="/admin/course-sections" replace />
                  ) : (
                    <Navigate to="/student/dashboard" replace />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
