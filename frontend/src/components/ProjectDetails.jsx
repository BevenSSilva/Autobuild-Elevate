import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, MapPin, User, HardHat, Calendar, DollarSign, Activity, Cloud, Users, Package } from 'lucide-react';

const ProjectDetails = ({ user }) => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const config = { headers: { 'Authorization': `Token ${localStorage.getItem('token')}` } };
            const [p, r] = await Promise.all([
                axios.get(`http://127.0.0.1:8000/api/projects/${id}/`, config),
                axios.get(`http://127.0.0.1:8000/api/projects/${id}/reports/`, config)
            ]);
            setProject(p.data); 
            setReports(r.data); 
            setLoading(false);
        };
        fetch();
    }, [id]);

    const trajectoryData = [...reports].reverse().map(r => ({
        date: new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        riskScore: r.risk_level === 'High Risk' ? 100 : 20,
        riskLabel: r.risk_level 
    }));

    if (loading) return <div className="text-info text-center mt-5 fw-bold">Loading...</div>;

    return (
        <div className="animate-fade-in-up">
            <Link to="/" className="btn btn-info btn-sm rounded-pill mb-4 px-3 fw-bold"><ArrowLeft size={16} className="me-2"/>Back to Dashboard</Link>
            
            <div className="card bg-white rounded-4 border-0 shadow-sm p-4 p-md-5 mb-5">
                <div className="row align-items-center">
                    <div className="col-lg-7">
                        <div className="text-info d-flex align-items-center mb-3"><MapPin size={22} className="me-2" /> <span className="fs-4 fw-bold">{project.location}</span></div>
                        <div className="bg-secondary bg-opacity-10 p-4 rounded-4 text-dark border border-secondary border-opacity-25">
                            <div className="d-flex justify-content-between mb-3"><span className="text-muted"><User size={16} className="me-2"/>Client:</span><span className="fw-bold">{project.client_name}</span></div>
                            <div className="d-flex justify-content-between mb-3"><span className="text-muted"><HardHat size={16} className="me-2"/>Site Engineer:</span><span className="fw-bold">{project.engineer_name}</span></div>
                            <div className="d-flex justify-content-between"><span className="text-muted"><Calendar size={16} className="me-2"/>Deadline:</span><span className="fw-bold">{project.deadline}</span></div>
                        </div>
                    </div>
                    <div className="col-lg-5 mt-4 mt-lg-0 ps-lg-5">
                        <div className="bg-secondary bg-opacity-10 p-4 rounded-4 mb-3">
                            <div className="text-muted small fw-bold mb-2">CURRENT RISK LEVEL</div>
                            
                            {project.risk_level === 'Pending' ? (
                                <span className="badge rounded-pill px-4 py-2 fs-6 bg-secondary text-light d-inline-flex align-items-center justify-content-center shadow-sm">
                                    Awaiting Reports
                                </span>
                            ) : (
                                <span className={`badge rounded-pill px-4 py-2 fs-5 d-inline-flex align-items-center justify-content-center shadow-sm ${project.risk_level === 'High Risk' ? 'bg-danger' : 'bg-success'}`}>
                                    {project.risk_level}
                                </span>
                            )}

                        </div>
                        <div className="bg-secondary bg-opacity-10 p-4 rounded-4">
                            <div className="text-info small fw-bold mb-2 d-flex align-items-center"><DollarSign size={16} className="me-1"/> REMAINING BUDGET</div>
                            <div className={`display-5 fw-bold ${project.budget < 0 ? 'text-danger' : 'text-success'}`}>${project.budget}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card bg-dark border-secondary border-opacity-25 rounded-4 p-4 mb-5 shadow">
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={trajectoryData}>
                        <XAxis dataKey="date" stroke="#aaa" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#212529', borderColor: '#444', borderRadius: '8px', color: '#fff' }}
                            formatter={(value, name, props) => [props.payload.riskLabel, 'Risk Level']}
                        />
                        <Area type="monotone" dataKey="riskScore" stroke="#0dcaf0" strokeWidth={3} fill="#0dcaf0" fillOpacity={0.1} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <h3 className="text-white fw-bold mb-4">Daily Site Logs</h3>
            <div className="row g-4 pb-5">{reports.map(r => (
                <div key={r.id} className="col-md-6"><div className="card bg-dark text-light border-secondary border-opacity-25 p-4 rounded-4 h-100 shadow-sm">
                    <div className="d-flex justify-content-between mb-4"><span className="text-info fw-bold">{new Date(r.date).toLocaleDateString()}</span><span className={`badge ${r.risk_level === 'High Risk' ? 'bg-danger' : 'bg-success'}`}>AI Risk: {r.risk_level}</span></div>
                    
                    <div className="row g-2 mb-4 text-center">
                        <div className="col-3"><div className="text-info small"><Users size={14}/> Labor</div><div className="fw-bold">{r.labor_count}</div></div>
                        <div className="col-3 border-start border-secondary"><div className="text-info small"><Cloud size={14}/> Weather</div><div className="fw-bold">{r.weather_condition}</div></div>
                        <div className="col-3 border-start border-secondary"><div className="text-info small"><Package size={14}/> Material</div><div className="fw-bold">{r.material_status}</div></div>
                        <div className="col-3 border-start border-secondary"><div className="text-info small"><DollarSign size={14}/> Cost</div><div className="fw-bold text-success">${r.cost_today}</div></div>
                    </div>

                    <div className="bg-black bg-opacity-25 p-3 rounded-3 mb-3">
                        <div className="text-info small fw-bold mb-1"><Activity size={14} className="me-1"/> Work Log:</div>
                        <p className="mb-0 text-white-50 font-monospace small">{r.work_description}</p>
                    </div>
                    {r.site_image && <img src={`http://127.0.0.1:8000${r.site_image}`} className="img-fluid rounded-3" style={{maxHeight:'200px', width:'100%', objectFit:'cover'}} />}
                </div></div>
            ))}</div>
        </div>
    );
};
export default ProjectDetails;