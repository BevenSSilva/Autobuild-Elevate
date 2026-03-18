import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Building, MapPin, DollarSign, Calendar, Users, ArrowLeft } from 'lucide-react';

const AddProject = () => {
    const navigate = useNavigate(); // Used to redirect back to dashboard after saving
    const [clients, setClients] = useState([]);
    const [engineers, setEngineers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        client: '',
        site_engineer: '',
        start_date: '',
        deadline: '',
        budget: ''
    });

    // Fetch users when the page loads to fill the dropdowns
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/users/')
            .then(response => {
                const allUsers = response.data;
                setClients(allUsers.filter(u => u.role === 'CLIENT'));
                setEngineers(allUsers.filter(u => u.role === 'SITE_ENGINEER'));
            })
            .catch(error => console.error("Error fetching users:", error));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://127.0.0.1:8000/api/projects/add/', formData);
            alert("Project Created Successfully! 🎉");
            navigate('/'); // Send user back to dashboard
        } catch (error) {
            console.error("Error creating project:", error.response?.data);
            alert("Failed to create project. Check the console.");
        }
        setLoading(false);
    };

    return (
        <div className="container py-4">
            <Link to="/" className="btn btn-outline-info mb-4 fw-bold rounded-pill d-inline-flex align-items-center">
                <ArrowLeft size={18} className="me-2" /> Back to Dashboard
            </Link>

            <div className="card shadow-lg border-info border-opacity-50 rounded-4 overflow-hidden max-w-2xl mx-auto" style={{ backgroundColor: 'rgba(33, 37, 41, 0.9) !important', backdropFilter: 'blur(12px)' }}>
                <div className="card-body p-4 p-md-5 bg-dark text-white">
                    <h2 className="card-title fw-bolder mb-4 text-info d-flex align-items-center">
                        <Building size={32} className="me-3" /> Create New Project
                    </h2>

                    <form onSubmit={handleSubmit} className="row g-4">
                        {/* Project Name */}
                        <div className="col-md-6">
                            <label className="form-label text-light fw-semibold">Project Name</label>
                            <input type="text" name="name" required className="form-control bg-dark text-light border-secondary focus-ring focus-ring-info" onChange={handleChange} />
                        </div>

                        {/* Location */}
                        <div className="col-md-6">
                            <label className="form-label text-light fw-semibold">Location</label>
                            <div className="input-group">
                                <span className="input-group-text bg-secondary border-secondary text-white"><MapPin size={18} /></span>
                                <input type="text" name="location" required className="form-control bg-dark text-light border-secondary" onChange={handleChange} />
                            </div>
                        </div>

                        {/* Client Dropdown */}
                        <div className="col-md-6">
                            <label className="form-label text-light fw-semibold">Assign Client</label>
                            <div className="input-group">
                                <span className="input-group-text bg-secondary border-secondary text-white"><Users size={18} /></span>
                                <select name="client" required className="form-select bg-dark text-light border-secondary" onChange={handleChange} defaultValue="">
                                    <option value="" disabled>Select a Client...</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.username}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Engineer Dropdown */}
                        <div className="col-md-6">
                            <label className="form-label text-light fw-semibold">Assign Engineer</label>
                            <div className="input-group">
                                <span className="input-group-text bg-secondary border-secondary text-white"><Users size={18} /></span>
                                <select name="site_engineer" required className="form-select bg-dark text-light border-secondary" onChange={handleChange} defaultValue="">
                                    <option value="" disabled>Select an Engineer...</option>
                                    {engineers.map(e => <option key={e.id} value={e.id}>{e.username}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Start Date */}
                        <div className="col-md-6">
                            <label className="form-label text-light fw-semibold">Start Date</label>
                            <div className="input-group">
                                <span className="input-group-text bg-secondary border-secondary text-white"><Calendar size={18} /></span>
                                <input type="date" name="start_date" required className="form-control bg-dark text-light border-secondary" onChange={handleChange} />
                            </div>
                        </div>

                        {/* Deadline */}
                        <div className="col-md-6">
                            <label className="form-label text-light fw-semibold">Deadline</label>
                            <div className="input-group">
                                <span className="input-group-text bg-secondary border-secondary text-white"><Calendar size={18} /></span>
                                <input type="date" name="deadline" required className="form-control bg-dark text-light border-secondary" onChange={handleChange} />
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="col-12">
                            <label className="form-label text-light fw-semibold">Total Budget ($)</label>
                            <div className="input-group">
                                <span className="input-group-text bg-secondary border-secondary text-white"><DollarSign size={18} /></span>
                                <input type="number" name="budget" required className="form-control bg-dark text-light border-secondary" onChange={handleChange} />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="col-12 mt-5">
                            <button type="submit" disabled={loading} className="btn btn-info w-100 fw-bold py-3 fs-5 rounded-pill shadow-lg transition">
                                {loading ? 'Saving Project...' : 'Launch Project 🚀'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProject;