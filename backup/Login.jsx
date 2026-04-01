import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden',
    },
    backgroundShapes: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
    },
    shape1: {
      position: 'absolute',
      top: '10%',
      left: '-10%',
      width: '500px',
      height: '500px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '50%',
      animation: 'float 20s infinite ease-in-out',
    },
    shape2: {
      position: 'absolute',
      bottom: '-10%',
      right: '-10%',
      width: '600px',
      height: '600px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '50%',
      animation: 'float 25s infinite ease-in-out reverse',
    },
    shape3: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '400px',
      height: '400px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      animation: 'pulse 15s infinite ease-in-out',
    },
    card: {
      position: 'relative',
      zIndex: 10,
      width: '100%',
      maxWidth: '450px',
      margin: '0 20px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '40px',
      transition: 'transform 0.3s ease',
    },
    logo: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '30px',
    },
    logoBox: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '15px',
      borderRadius: '20px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    },
    title: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    h2: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1a202c',
      marginBottom: '8px',
    },
    p: {
      color: '#4a5568',
      fontSize: '14px',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#2d3748',
      marginBottom: '8px',
    },
    inputWrapper: {
      position: 'relative',
    },
    inputIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#a0aec0',
    },
    input: {
      width: '100%',
      padding: '10px 12px 10px 40px',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      outline: 'none',
    },
    button: {
      width: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '12px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    divider: {
      position: 'relative',
      margin: '25px 0',
      textAlign: 'center',
    },
    dividerLine: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: '1px',
      background: '#e2e8f0',
    },
    dividerText: {
      position: 'relative',
      display: 'inline-block',
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '0 15px',
      color: '#718096',
      fontSize: '14px',
    },
    link: {
      textAlign: 'center',
    },
    anchor: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '14px',
    },
  };

  // Add keyframes to document
  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-30px) rotate(180deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
        50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.2); }
      }
      input:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }
      button:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px -5px rgba(102, 126, 234, 0.4);
      }
    `;
    document.head.appendChild(styleSheet);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.backgroundShapes}>
        <div style={styles.shape1}></div>
        <div style={styles.shape2}></div>
        <div style={styles.shape3}></div>
      </div>
      
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoBox}>
            <Briefcase size={40} color="white" />
          </div>
        </div>
        
        <div style={styles.title}>
          <h2 style={styles.h2}>Welcome Back!</h2>
          <p style={styles.p}>Sign in to your account to continue</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}>
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                placeholder="you@example.com"
              />
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}>
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={styles.button}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <div style={styles.dividerText}>Don't have an account?</div>
        </div>
        
        <div style={styles.link}>
          <Link to="/register" style={styles.anchor}>
            Create a new account →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;