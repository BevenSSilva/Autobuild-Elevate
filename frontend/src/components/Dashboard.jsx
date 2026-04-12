import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Ban, MapPin, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReportForm from './ReportForm';

const Dashboard = ({ user }) => {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [alertMsg, setAlertMsg] = useState(null);
    const userRole = user?.role?.toUpperCase() || '';

    const fetchProjects = (initial = false) => {
        const token = localStorage.getItem('token'); 
        axios.get('http://127.0.0.1:8000/api/projects/', { headers: { 'Authorization': `Token ${token}` } })
            .then(res => {
                if (!initial) {
                    res.data.forEach(proj => {
                        const old = projects.find(p => p.id === proj.id);
                        if (old?.status === 'Halted' && proj.status === 'Active') {
                            let msg = "";
                            if (proj.last_action_by === 'ADMIN' && userRole === 'CLIENT') msg = "Admin has resumed the work";
                            if (proj.last_action_by === 'CLIENT' && userRole === 'ADMIN') msg = "Client has resumed the work";
                            if (msg) { setAlertMsg(msg); setTimeout(() => setAlertMsg(null), 5000); }
                        }
                    });
                }
                setProjects(res.data);
            }).catch(err => console.error(err));
    };

    useEffect(() => { fetchProjects(true); }, []);

    const handleHalt = async (id) => {
        if(window.confirm("🚨 Halt work?")) {
            try {
                await axios.post(`http://127.0.0.1:8000/api/projects/${id}/call-off/`, {}, { 
                    headers: { 'Authorization': `Token ${localStorage.getItem('token')}` } 
                });
                setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'Halted' } : p));
            } catch (err) {
                console.error(err);
                alert("❌ Backend Error: Could not halt work.");
            }
        }
    };

    const handleResume = async (id) => {
        if(window.confirm("✅ Resume work?")) {
            try {
                await axios.post(`http://127.0.0.1:8000/api/projects/${id}/resume/`, {}, { 
                    headers: { 'Authorization': `Token ${localStorage.getItem('token')}` } 
                });
                setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'Active' } : p));
            } catch (err) {
                console.error(err);
                alert("❌ Backend Error: Could not resume work.");
            }
        }
    };

    // 👇 NEW LOGIC: Determine which projects to show based on "Reporting Mode" 👇
    const projectsToShow = selectedProjectId 
        ? projects.filter(project => project.id === selectedProjectId) 
        : projects;

    return (
        <div className="animate-fade-in-up">
            {alertMsg && <div className="alert alert-info position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg z-3 rounded-pill fw-bold"><Bell size={18} className="me-2"/>{alertMsg}</div>}
            
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1 className="display-4 fw-black text-white d-flex align-items-center">Active Projects : </h1>
                {/* Hide the "New Project" button if we are in reporting mode to keep the screen clean */}
                {userRole === 'ADMIN' && !selectedProjectId && (
                    <Link to="/add-project" className="btn btn-info rounded-pill fw-bold px-4 py-2 shadow-sm">
                        New Project
                    </Link>
                )}
            </div>

            {selectedProjectId && (
                <ReportForm projectId={selectedProjectId} onCancel={() => setSelectedProjectId(null)} onReportAdded={() => { setSelectedProjectId(null); fetchProjects(); }} />
            )}

            {/* 👇 Map over the filtered list instead of all projects 👇 */}
            <div className={`row g-4 ${selectedProjectId ? 'justify-content-center' : ''}`}>
                {projectsToShow.map((project) => {
                    const budgetValue = Number(project.budget);
                    const isOverrun = budgetValue < 0;
                    const isLow = budgetValue >= 0 && budgetValue < 100000;
                    
                    return (
                    // If reporting, center the single card and make it slightly wider. Otherwise, standard grid.
                    <div key={project.id} className={selectedProjectId ? "col-12 col-md-8 col-lg-6" : "col-12 col-md-6 col-lg-4"}>
                        <div className="card h-100 shadow-lg border-0 bg-dark text-white rounded-4 overflow-hidden position-relative">
                            
                            {project.status === 'Halted' && (
                                <div className="bg-danger text-white w-100 text-center py-2 fw-bolder shadow-sm">
                                    <Ban size={18} className="me-2" /> WORK HALTED
                                </div>
                            )}

                            <div className="card-body p-4 d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <h3 className="fw-bold mb-0">{project.name}</h3>
                                    {project.risk_level !== 'Pending' && (
                                        <span 
                                            className={`badge rounded-pill d-flex align-items-center justify-content-center px-3 shadow-sm ${project.risk_level === 'High Risk' ? 'bg-danger' : 'bg-success'}`}
                                            style={{ minHeight: '30px', letterSpacing: '0.5px' }}
                                        >
                                            {project.risk_level}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="bg-black bg-opacity-25 p-3 rounded-3 mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-light">💰 Budget:</span>
                                        <div className="text-end">
                                            <span className={`fw-bold ${isOverrun ? 'text-danger' : isLow ? 'text-warning' : 'text-success'}`}>
                                                ${project.budget}
                                            </span>
                                            {isOverrun && <div className="badge bg-danger ms-2 shadow-sm">Overrun ‼️</div>}
                                            {isLow && <div className="badge bg-warning text-dark ms-2 shadow-sm">Low ⚠️</div>}
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-light">👷 Engineer:</span>
                                        <span className="text-info">{project.engineer_name}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-light">📅 Deadline:</span>
                                        <span>{project.deadline}</span>
                                    </div>
                                </div>

                                <div className="d-flex gap-2 mt-auto">
                                    {project.status !== 'Halted' ? (
                                        <>
                                            {(userRole === 'ADMIN' || userRole === 'SITE_ENGINEER') && !selectedProjectId && (
                                                <button onClick={() => setSelectedProjectId(project.id)} className="btn btn-primary flex-grow-1 fw-bold rounded-3">Report</button>
                                            )}
                                            {(userRole === 'ADMIN' || userRole === 'CLIENT') && !selectedProjectId && (
                                                <button onClick={() => handleHalt(project.id)} className="btn btn-danger flex-grow-1 fw-bold rounded-3">Halt Work</button>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {(userRole === 'ADMIN' || userRole === 'CLIENT') && !selectedProjectId && (
                                                <button onClick={() => handleResume(project.id)} className="btn btn-success flex-grow-1 fw-bold rounded-3">Resume</button>
                                            )}
                                        </>
                                    )}
                                    <Link to={`/project/${project.id}`} className="btn btn-outline-info flex-grow-1 fw-bold rounded-3">Details</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )})}
            </div>
        </div>
    );
};

export default Dashboard;