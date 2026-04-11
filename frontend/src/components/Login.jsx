import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HardHat, AlertCircle } from 'lucide-react';

const Login = ({ setAuthUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Send credentials to your secure Django endpoint
            const response = await axios.post('http://localhost:8000/api/login/', {
                username: username,
                password: password
            });

            // 1. Extract the data Django sends back (INCLUDING THE TOKEN!)
            const { id, username: fetchedUser, role, token } = response.data;

            // 2. Format the user profile object
            const userProfile = { id, username: fetchedUser, role };

            // 3. Save the Token AND the User Profile to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userProfile));

            // 4. Update the main App.jsx state to trigger the Navbar and routing
            setAuthUser(userProfile);

            // 5. Send them instantly to the Dashboard
            navigate('/');

        } catch (err) {
            console.error("Login failed:", err);
            // If Django throws a 400 Bad Request, show this error
            setError('Invalid username or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
            <div className="card shadow-lg border-0 rounded-4" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#1a2e38' }}>
                <div className="card-body p-5 text-light">
                    
                    <div className="text-center mb-4">
                        <HardHat size={48} className="text-info mb-3" />
                        <h3 className="fw-bolder">AutoBuild Elevate</h3>
                        <p className="text-muted">Enter your credentials to continue</p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="alert alert-danger d-flex align-items-center py-2" role="alert">
                            <AlertCircle size={18} className="me-2" />
                            <small>{error}</small>
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label text-info fw-bold small">Username</label>
                            <input 
                                type="text" 
                                className="form-control bg-dark text-light border-secondary" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required 
                                autoFocus
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-info fw-bold small">Password</label>
                            <input 
                                type="password" 
                                className="form-control bg-dark text-light border-secondary" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-info w-100 fw-bold rounded-pill text-dark"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default Login;