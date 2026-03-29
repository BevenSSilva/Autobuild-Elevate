import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HardHat } from 'lucide-react';

const Login = ({ setAuthUser }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/login/', credentials);
            // Save user to local storage and update app state
            localStorage.setItem('user', JSON.stringify(res.data));
            setAuthUser(res.data);
            navigate('/'); // Go to dashboard
        } catch (err) {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg border-info border-opacity-50 rounded-4 p-5 bg-dark text-white" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="text-center mb-4">
                    <HardHat size={48} className="text-info mb-2" />
                    <h2 className="fw-bolder">ConstructOS</h2>
                    <p className="text-secondary">Sign in to your account</p>
                </div>
                
                {error && <div className="alert alert-danger py-2">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-light">Username</label>
                        <input type="text" name="username" className="form-control bg-dark text-light border-secondary" onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-light">Password</label>
                        <input type="password" name="password" className="form-control bg-dark text-light border-secondary" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-info w-100 fw-bold rounded-pill shadow-lg py-2">
                        Login 🚀
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;