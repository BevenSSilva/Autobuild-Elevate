import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, DollarSign, Users, CloudRain, AlertTriangle, Image as ImageIcon, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProjectDetails = ({ user }) => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projRes = await axios.get(`http://127.0.0.1:8000/api/projects/${id}/`);
                const repRes = await axios.get(`http://127.0.0.1:8000/api/projects/${id}/reports/`);
                setProject(projRes.data);
                setReports(repRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching details:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="text-center mt-5 text-info fs-3 fw-bold spinner-border" role="status"></div>;
    if (!project) return <div className="text-center mt-5 text-white display-6">Project not found !</div>;

    // Transform report data for the Admin Trajectory Chart
    const chartData = [...reports].reverse().map(report => ({
        date: report.date,
        riskScore: report.risk_level === 'High Risk' ? 100 : report.risk_level === 'Halted by Client' ? 90 : 20,
        riskLabel: report.risk_level
    }));

    return (
        <div className="container py-4">
            {/* Back Button */}
            <Link to="/" className="btn btn-outline-info mb-4 fw-bold rounded-pill d-inline-flex align-items-center">
                <ArrowLeft size={18} className="me-2" /> Back to Dashboard
            </Link>

            {/* Project Header */}
            <div className="card shadow-lg border-0 bg-dark text-white rounded-4 mb-5" style={{ backgroundColor: 'rgba(60, 72, 84, 0.8) !important', backdropFilter: 'blur(10px)' }}>
                <div className="card-body p-5 d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h1 className="display-4 fw-bolder mb-2 text-info" style={{ textShadow: '2px 2px 4px rgba(50, 47, 47, 0.5)' }}>{project.name}</h1>
                        <p className="fs-5 text-light mb-0">📍 {project.location} | 👷 Engineer: {project.engineer_name || "Unassigned"} | 🤝 Client: {project.client_name || "Unassigned"}</p>
                    </div>
                    
                    {/* DYNAMIC BUDGET STATUS */}
                    <div className="text-end">
                        <h3 className={`fw-bold mb-2 ${project.budget < 0 ? 'text-danger' : project.budget < 100000 ? 'text-warning' : 'text-success'}`}>
                            Remaining Budget: ${project.budget}
                        </h3>
                        {project.budget < 0 ? (
                            <span className="badge bg-danger shadow-sm fs-5 px-3 py-2 rounded-pill">Budget Overrun 🚨</span>
                        ) : project.budget < 100000 ? (
                            <span className="badge bg-warning text-dark shadow-sm fs-5 px-3 py-2 rounded-pill">Low Budget ⚠️</span>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* ADMIN ONLY: PROJECT RISKTRAJECTORY CHART */}
            {user?.role === 'ADMIN' && reports.length > 0 && (
                <div className="card bg-dark border-info border-opacity-25 shadow-lg rounded-4 mb-5 p-4">
                    <h3 className="text-white mb-4 fw-bold">📈 Project Risk Trajectory</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="date" stroke="#aaa" />
                                <YAxis stroke="#aaa" domain={[0, 100]} ticks={[20, 100]} tickFormatter={(val) => val === 100 ? 'High' : 'Low'} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#222', borderColor: '#0dcaf0', borderRadius: '10px', color: '#fff' }}
                                    formatter={(value, name, props) => [props.payload.riskLabel, "Risk Status"]}
                                />
                                <Line type="monotone" dataKey="riskScore" stroke="#0dcaf0" strokeWidth={3} dot={{ r: 6, fill: '#0dcaf0' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            <h2 className="text-white fw-bold border-bottom border-secondary pb-2 mb-4">
                📋 Daily Report History
            </h2>

            {/* Reports Grid */}
            {reports.length === 0 ? (
                <div className="alert alert-secondary bg-dark text-light border-secondary text-center py-5 rounded-4 fs-5">
                    No daily reports submitted yet. Go back to the dashboard to add one!
                </div>
            ) : (
                <div className="row g-4">
                    {reports.map((report) => (
                        <div key={report.id} className="col-12 col-md-6 col-lg-4">
                            <div className="card h-100 bg-dark text-white border-info border-opacity-25 shadow rounded-4 overflow-hidden">
                                
                                {/* Image Section */}
                                {report.site_image ? (
                                    <img 
                                        src={`http://127.0.0.1:8000${report.site_image}`} 
                                        className="card-img-top" 
                                        alt="Site Progress" 
                                        style={{ height: '220px', objectFit: 'cover' }} 
                                    />
                                ) : (
                                    <div className="bg-secondary bg-opacity-25 d-flex justify-content-center align-items-center" style={{ height: '220px' }}>
                                        <ImageIcon size={48} className="text-secondary opacity-50" />
                                        <span className="ms-2 text-secondary opacity-50 fw-bold">No Image Uploaded</span>
                                    </div>
                                )}

                                {/* Report Details Section */}
                                <div className="card-body d-flex flex-column p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                                        <div className="d-flex gap-2">
                                            <span className="badge bg-primary rounded-pill py-2 px-3 fw-bold fs-6">
                                                <Calendar size={14} className="me-1" /> {report.date}
                                            </span>
                                            
                                            {/* Report Risk Badge */}
                                            <span className={`badge rounded-pill py-2 px-3 fw-bold fs-6 shadow-sm
                                                ${report.risk_level === 'High Risk' || report.risk_level === 'Halted by Client' ? 'bg-danger text-white' : 
                                                  report.risk_level === 'Low Risk' ? 'bg-success text-white' : 'bg-secondary text-white'}`}>
                                                <Activity size={14} className="me-1" /> {report.risk_level || 'Assessed'}
                                            </span>
                                        </div>

                                        <span className={`badge rounded-pill py-2 px-3 fw-bold
                                            ${report.weather_condition === 'Storm' ? 'bg-danger' : 
                                              report.weather_condition === 'Rain' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
                                            <CloudRain size={14} className="me-1" /> {report.weather_condition}
                                        </span>
                                    </div>

                                    <p className="card-text text-light bg-black bg-opacity-25 p-3 rounded-3 border border-secondary border-opacity-25 fst-italic flex-grow-1">
                                        "{report.work_description}"
                                    </p>

                                    <div className="d-flex flex-wrap gap-2 mt-3 text-sm">
                                        <div className="bg-secondary bg-opacity-50 px-3 py-1 rounded-pill d-flex align-items-center">
                                            <Users size={14} className="me-1 text-info"/> {report.labor_count} Labor
                                        </div>
                                        <div className="bg-secondary bg-opacity-50 px-3 py-1 rounded-pill d-flex align-items-center">
                                            <DollarSign size={14} className="me-1 text-success"/> ${report.cost_today} Spent
                                        </div>
                                        <div className="bg-secondary bg-opacity-50 px-3 py-1 rounded-pill d-flex align-items-center">
                                            <AlertTriangle size={14} className={`me-1 ${report.material_status === 'CRITICAL' ? 'text-danger' : 'text-warning'}`}/> 
                                            Mat: {report.material_status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;