import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ProjectDetails from './components/ProjectDetails';
import AddProject from './components/AddProject';
import Login from './components/Login'; 
import { HardHat, LogOut } from 'lucide-react';

function App() {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    const token = localStorage.getItem('token'); 
    if (loggedInUser && token) {
        setAuthUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token'); 
      setAuthUser(null);
  };

  return (
    <Router>
      <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #0d2029ff, #294b57ff, #295568ff)' }}>
        {authUser && (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg border-bottom border-info border-opacity-25 sticky-top">
              <div className="container">
                <Link to="/" className="navbar-brand d-flex align-items-center fs-3 fw-bolder text-info">
                  <HardHat className="me-2 text-info" size={32} /> AutoBuild Elevate
                </Link>
                <div className="navbar-nav ms-auto d-flex flex-row align-items-center gap-3">
                  <span className="badge bg-secondary text-light fs-6">Role: {authUser.role}</span>
                  <button onClick={handleLogout} className="btn btn-sm btn-outline-danger d-flex align-items-center rounded-pill">
                    <LogOut size={16} className="me-1"/> Logout
                  </button>
                </div>
              </div>
            </nav>
        )}
        <main className="container py-5">
          <Routes>
            {!authUser ? (
                <>
                    <Route path="/login" element={<Login setAuthUser={setAuthUser} />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </>
            ) : (
                <>
                    <Route path="/" element={<Dashboard user={authUser} />} />
                    <Route path="/project/:id" element={<ProjectDetails user={authUser} />} />
                    {/* 👇 ROLE CASING FIX 👇 */}
                    {authUser.role.toUpperCase() === 'ADMIN' && <Route path="/add-project" element={<AddProject />} />}
                    <Route path="*" element={<Navigate to="/" />} />
                </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;