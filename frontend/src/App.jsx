
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProjectDetails from './components/ProjectDetails'; // <--- Added this!
import { HardHat, Activity } from 'lucide-react';
import AddProject from './components/AddProject';



function App() {
  return (
    <Router>
      {/* Colorful Gradient Background using inline styles combined with Bootstrap */}
      <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)' }}>
        
        {/* Bootstrap Dark Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg border-bottom border-info border-opacity-25">
          <div className="container">
            <Link to="/" className="navbar-brand d-flex align-items-center fs-3 fw-bolder text-info">
              <HardHat className="me-2 text-info" size={32} />
              ConstructOS
            </Link>
            
            <div className="navbar-nav ms-auto">
              <Link to="/" className="nav-link text-white fw-bold d-flex align-items-center">
                <Activity size={20} className="me-2" /> Dashboard
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="container py-5">
          <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/project/:id" element={<ProjectDetails />} />
    <Route path="/add-project" element={<AddProject />} /> {/* NEW ROUTE */}
</Routes>
        </main>
        
      </div>
    </Router>
  );
}

export default App;