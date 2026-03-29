import { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertTriangle, CheckCircle, Plus, Eye, Ban } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReportForm from './ReportForm';

const Dashboard = ({ user }) => {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    const fetchProjects = () => {
        axios.get('http://127.0.0.1:8000/api/projects/')
            .then(response => setProjects(response.data))
            .catch(error => console.error("Error:", error));
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCallOffWork = async (projectId) => {
        if(window.confirm("🚨 Are you sure you want to HALT all work for today? This will notify the team and mark the project as High Risk.")) {
            try {
                await axios.post(`http://127.0.0.1:8000/api/projects/${projectId}/call-off/`);
                alert("Work has been officially called off for today.");
                fetchProjects(); // Refresh dashboard to show new status
            } catch (error) {
                console.error(error);
                alert("Failed to call off work. Please check the console.");
            }
        }
    };

    return (
        <div className="animate-fade-in-up">
            {/* TITLE SECTION WITH ROLE-BASED NEW PROJECT BUTTON */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1 className="display-4 fw-black text-white mb-0" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    Active Projects 🚀
                </h1>
                {/* ONLY ADMIN CAN SEE 'NEW PROJECT' */}
                {user?.role === 'ADMIN' && (
                    <Link to="/add-project" className="btn btn-info btn-lg fw-bold rounded-pill shadow d-flex align-items-center">
                        <Plus size={24} className="me-2" /> New Project
                    </Link>
                )}
            </div>
            
            {/* Show Report Form if a project is selected */}
            {selectedProjectId && (
                <div className="mb-5 animate-bounce-in">
                    <ReportForm 
                        projectId={selectedProjectId} 
                        onReportAdded={() => {
                            setSelectedProjectId(null);
                            fetchProjects();
                        }}
                        onCancel={() => setSelectedProjectId(null)}
                    />
                </div>
            )}

            {/* Bootstrap Grid System */}
            <div className="row g-4">
                {projects
                    .filter(project => selectedProjectId === null || project.id === selectedProjectId)
                    .map((project) => (
                    <div key={project.id} className="col-12 col-md-6 col-lg-4">
                        
                        <div className="card h-100 shadow-lg border-0 bg-dark text-white rounded-4 overflow-hidden" style={{ backgroundColor: 'rgba(33, 37, 41, 0.8) !important', backdropFilter: 'blur(10px)' }}>
                            <div className="card-body d-flex flex-column p-4">
                                
                                {/* Header & Risk Badge */}
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <div>
                                        <h3 className="card-title fw-bold mb-1">{project.name}</h3>
                                        <p className="text-info mb-0 fw-semibold">{project.location}</p>
                                    </div>
                                    
                                    <span className={`badge rounded-pill py-2 px-3 d-flex align-items-center shadow
                                        ${project.risk_level === 'High Risk' ? 'bg-danger' : 'bg-success'}`}>
                                        {project.risk_level === 'High Risk' ? <AlertTriangle size={16} className="me-1"/> : <CheckCircle size={16} className="me-1"/>}
                                        {project.risk_level}
                                    </span>
                                </div>

                                {/* Project Details */}
                                <div className="bg-black bg-opacity-25 p-3 rounded-3 mb-4 mt-auto border border-secondary border-opacity-25">
                                    
                                    {/* BUDGET SECTION WITH WARNINGS */}
                                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-50">
                                        <span className="text-light">💰 Budget Left:</span>
                                        <div className="text-end">
                                            <span className={`fw-bold fs-5 d-block
                                                ${project.budget < 0 ? 'text-danger' : project.budget < 100000 ? 'text-warning' : 'text-success'}`}>
                                                ${project.budget}
                                            </span>
                                            {project.budget < 0 ? (
                                                <span className="badge bg-danger shadow-sm mt-1">Budget Overrun 🚨</span>
                                            ) : project.budget < 100000 ? (
                                                <span className="badge bg-warning text-dark shadow-sm mt-1">Low Budget ⚠️</span>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-light">📅 Deadline:</span>
                                        <span className="fw-semibold">{project.deadline}</span>
                                    </div>
                                    
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-light">🤝 Client:</span>
                                        <span className="fw-semibold text-info">{project.client_name || "Unassigned"}</span>
                                    </div>

                                    <div className="d-flex justify-content-between">
                                        <span className="text-light">👷 Engineer:</span>
                                        <span className="fw-semibold text-light">{project.engineer_name || "Unassigned"}</span>
                                    </div>
                                </div>

                                {/* ROLE-BASED BUTTONS */}
                                <div className="d-flex gap-2 mt-auto">
                                    
                                    {/* ADMIN AND ENGINEER CAN REPORT */}
                                    {(user?.role === 'ADMIN' || user?.role === 'SITE_ENGINEER') && (
                                        <button 
                                            onClick={() => setSelectedProjectId(project.id)}
                                            className="btn btn-primary flex-grow-1 fw-bold rounded-3 shadow d-flex justify-content-center align-items-center">
                                            <Plus size={18} className="me-1" /> Report
                                        </button>
                                    )}

                                    {/* CLIENT CAN CALL OFF WORK */}
                                    {user?.role === 'CLIENT' && (
                                        <button 
                                            onClick={() => handleCallOffWork(project.id)}
                                            className="btn btn-danger flex-grow-1 fw-bold rounded-3 shadow d-flex justify-content-center align-items-center">
                                            <Ban size={18} className="me-1" /> Halt Work
                                        </button>
                                    )}
                                    
                                    {/* EVERYONE CAN SEE DETAILS */}
                                    <Link to={`/project/${project.id}`}
                                        className="btn btn-outline-info flex-grow-1 fw-bold rounded-3 shadow d-flex justify-content-center align-items-center">
                                        <Eye size={18} className="me-1" /> Details
                                    </Link>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;