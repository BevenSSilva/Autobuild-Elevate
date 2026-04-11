import { useState } from 'react';
import axios from 'axios';
import { Upload, DollarSign, Users, CloudRain, AlertTriangle } from 'lucide-react';

const ReportForm = ({ projectId, onReportAdded, onCancel }) => {
    const [formData, setFormData] = useState({ labor_count: '', weather_condition: 'Sunny', work_description: '', material_status: 'SUFFICIENT', cost_today: '', site_image: null });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setFormData({ ...formData, site_image: e.target.files[0] });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('project', projectId);
        data.append('delay_hours', 0); 
        
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://127.0.0.1:8000/api/reports/add/', data, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Token ${token}` }
            });
            alert('Report Submitted! 🚀');
            onReportAdded(); 
        } catch (error) {
            alert("SERVER ERROR: Check permissions or assignments.");
        }
        setLoading(false);
    };

    return (
        <div className="card shadow-lg border-info border-opacity-50 rounded-4 overflow-hidden mb-5" style={{ backgroundColor: 'rgba(61, 73, 84, 0.9)', backdropFilter: 'blur(12px)' }}>
            <div className="card-body p-4 p-md-5 bg-dark text-white">
                <h3 className="card-title fw-bolder mb-4 d-flex align-items-center text-info">📝 New Daily Report</h3>
                <form onSubmit={handleSubmit} className="row g-4">
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Labor Count</label>
                        <input type="number" name="labor_count" required min="0" className="form-control bg-dark text-white border-secondary" onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Cost Today ($)</label>
                        <input type="number" name="cost_today" required min="0" className="form-control bg-dark text-white border-secondary" onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Weather</label>
                        <select name="weather_condition" className="form-select bg-dark text-white border-secondary" onChange={handleChange}>
                            <option value="Sunny">Sunny ☀️</option><option value="Rain">Rain 🌧️</option><option value="Storm">Storm ⛈️</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Materials</label>
                        <select name="material_status" className="form-select bg-dark text-white border-secondary" onChange={handleChange}>
                            <option value="SUFFICIENT">Sufficient ✅</option><option value="LOW">Low ⚠️</option><option value="CRITICAL">Critical ❌</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <label className="form-label fw-semibold">Work Description</label>
                        <textarea name="work_description" required className="form-control bg-dark text-white border-secondary" rows="3" onChange={handleChange}></textarea>
                    </div>
                    <div className="col-12">
                        <label className="form-label fw-semibold">Site Photo</label>
                        <input type="file" accept="image/*" className="form-control bg-dark text-white border-secondary" onChange={handleFileChange} />
                    </div>
                    <div className="col-12 d-flex justify-content-end gap-3 mt-4">
                        <button type="button" onClick={onCancel} className="btn btn-secondary px-4 rounded-pill">Cancel</button>
                        <button type="submit" disabled={loading} className="btn btn-info px-5 rounded-pill shadow fw-bold">{loading ? 'Analyzing...' : 'Submit 🚀'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default ReportForm;