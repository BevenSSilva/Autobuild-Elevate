import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ProjectDetails from './components/ProjectDetails';
import AddProject from './components/AddProject';
import Login from './components/Login'; // <--- NEW IMPORT
import { HardHat, Activity, LogOut } from 'lucide-react';

function App() {
  const [authUser, setAuthUser] = useState(null);

  // Check if user is already logged in when app loads
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
        setAuthUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
      localStorage.removeItem('user');
      setAuthUser(null);
  };

  return (
    <Router>
      <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)' }}>
        
        {/* Only show Navbar if logged in */}
        {authUser && (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg border-bottom border-info border-opacity-25 sticky-top">
              <div className="container">
                <Link to="/" className="navbar-brand d-flex align-items-center fs-3 fw-bolder text-info">
                  <HardHat className="me-2 text-info" size={32} /> ConstructOS
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
            {/* If NOT logged in, force them to Login Page */}
            {!authUser ? (
                <>
                    <Route path="/login" element={<Login setAuthUser={setAuthUser} />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </>
            ) : (
                /* If LOGGED IN, show the app */
                <>
                    <Route path="/" element={<Dashboard user={authUser} />} />
                    <Route path="/project/:id" element={<ProjectDetails user={authUser} />} />
                    {authUser.role === 'ADMIN' && <Route path="/add-project" element={<AddProject />} />}
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