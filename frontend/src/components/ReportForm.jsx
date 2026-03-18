import { useState } from 'react';
import axios from 'axios';
import { Upload, DollarSign, Users, CloudRain, AlertTriangle } from 'lucide-react';

const ReportForm = ({ projectId, onReportAdded, onCancel }) => {
    const [formData, setFormData] = useState({
        labor_count: '',
        weather_condition: 'Sunny',
        work_description: '',
        material_status: 'SUFFICIENT',
        cost_today: '',
        site_image: null
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, site_image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('project', projectId);
        data.append('labor_count', formData.labor_count);
        data.append('weather_condition', formData.weather_condition);
        data.append('work_description', formData.work_description);
        data.append('material_status', formData.material_status);
        data.append('cost_today', formData.cost_today);
        
        // 👇 THE CRITICAL FIX: Sending a default delay_hours value so Django is happy
        data.append('delay_hours', 0); 

        if (formData.site_image) {
            data.append('site_image', formData.site_image);
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/reports/add/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Report Submitted! AI is calculating risk... 🚀');
            onReportAdded(); 
        }  catch (error) {
            // 👇 CHANGE THIS ALERT 👇
            const errorMessage = error.response?.data 
                ? JSON.stringify(error.response.data) 
                : "Unknown error";
            
            alert("DJANGO SAYS: " + errorMessage);
            console.error("Full error:", error.response?.data);
        }
        setLoading(false);
    };

    return (
        <div className="card shadow-lg border-info border-opacity-50 rounded-4 overflow-hidden" style={{ backgroundColor: 'rgba(33, 37, 41, 0.9) !important', backdropFilter: 'blur(12px)' }}>
            <div className="card-body p-4 p-md-5 bg-dark text-white">
                
                <h3 className="card-title fw-bolder mb-4 d-flex align-items-center text-info">
                    <span className="me-2 fs-2">📝</span> New Daily Report
                </h3>
                
                <form onSubmit={handleSubmit} className="row g-4">
                    
                    {/* Labor Count */}
                    <div className="col-12 col-md-6">
                        <label className="form-label text-light fw-semibold">Labor Count</label>
                        <div className="input-group shadow-sm">
                            <span className="input-group-text bg-secondary border-secondary text-white">
                                <Users size={18} />
                            </span>
                            <input type="number" name="labor_count" required
                                className="form-control bg-dark text-light border-secondary focus-ring focus-ring-info"
                                placeholder="e.g., 15"
                                onChange={handleChange} />
                        </div>
                    </div>

                    {/* Cost Today */}
                    <div className="col-12 col-md-6">
                        <label className="form-label text-light fw-semibold">Cost Today ($)</label>
                        <div className="input-group shadow-sm">
                            <span className="input-group-text bg-secondary border-secondary text-white">
                                <DollarSign size={18} />
                            </span>
                            <input type="number" name="cost_today" required
                                className="form-control bg-dark text-light border-secondary focus-ring focus-ring-info"
                                placeholder="e.g., 5000"
                                onChange={handleChange} />
                        </div>
                    </div>

                    {/* Weather */}
                    <div className="col-12 col-md-6">
                        <label className="form-label text-light fw-semibold">Weather</label>
                        <div className="input-group shadow-sm">
                            <span className="input-group-text bg-secondary border-secondary text-white">
                                <CloudRain size={18} />
                            </span>
                            <select name="weather_condition" className="form-select bg-dark text-light border-secondary" onChange={handleChange}>
                                <option value="Sunny">Sunny ☀️</option>
                                <option value="Cloudy">Cloudy ☁️</option>
                                <option value="Rain">Rain 🌧️</option>
                                <option value="Storm">Storm ⛈️ (Danger)</option>
                            </select>
                        </div>
                    </div>

                    {/* Material Status */}
                    <div className="col-12 col-md-6">
                        <label className="form-label text-light fw-semibold">Material Status</label>
                        <div className="input-group shadow-sm">
                            <span className="input-group-text bg-secondary border-secondary text-white">
                                <AlertTriangle size={18} />
                            </span>
                            <select name="material_status" className="form-select bg-dark text-light border-secondary" onChange={handleChange}>
                                <option value="SUFFICIENT">Sufficient ✅</option>
                                <option value="LOW">Running Low ⚠️</option>
                                <option value="CRITICAL">Critical Shortage ❌</option>
                            </select>
                        </div>
                    </div>

                    {/* Work Description */}
                    <div className="col-12">
                        <label className="form-label text-light fw-semibold">Work Description</label>
                        <textarea name="work_description" required 
                            className="form-control bg-dark text-light border-secondary focus-ring focus-ring-info" 
                            rows="3" 
                            placeholder="What did the team accomplish today?"
                            onChange={handleChange}></textarea>
                    </div>

                    {/* Image Upload */}
                    <div className="col-12">
                        <label className="form-label text-light fw-semibold">Site Photo</label>
                        <div className="input-group shadow-sm">
                            <span className="input-group-text bg-secondary border-secondary text-white">
                                <Upload size={18} />
                            </span>
                            {/* 👇 ADD accept="image/*" HERE 👇 */}
                            <input type="file" accept="image/*" className="form-control bg-dark text-light border-secondary" onChange={handleFileChange} />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="col-12 d-flex justify-content-end gap-3 mt-4 pt-3 border-top border-secondary border-opacity-50">
                        <button type="button" onClick={onCancel} className="btn btn-outline-light fw-bold px-4 rounded-pill transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} 
                            className="btn btn-info fw-bold px-5 rounded-pill shadow-lg d-flex align-items-center transition">
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Analyzing Risk...
                                </>
                            ) : (
                                'Submit Report 🚀'
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ReportForm;