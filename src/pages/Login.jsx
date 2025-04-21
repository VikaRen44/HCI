import { useState } from 'react';
import { auth, provider, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
} from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';
import logo from '../assets/mylsb_logo.png';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      const userRef = doc(db, 'accounts', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();

        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        alert('User account not found in database.');
      }

    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        const confirm = window.confirm('No account found. Register instead?');
        if (confirm) navigate('/register');
      } else {
        alert(error.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        alert('Verification email sent. Please check your inbox.');
      }

      const userRef = doc(db, 'accounts', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();

        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }

      } else {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          username: '',
          role: 'user',
          customPasswordSet: false,
        });

        alert('Please complete your registration.');
        navigate('/register');
      }

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
      <img src={logo} alt="Logo" className="login-logo" />
        <h2 className="login-title">Login</h2>

        {/* ✅ Email Label + Input */}
        <label className="login-email-label">Email</label>
        <input
          className="login-input login-email"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* ✅ Password Label + Input */}
        <label className="login-password-label">Password</label>
        <input
          className="login-input login-password"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button email-login-button" onClick={handleEmailLogin}>
          Login with Email
        </button>

        <hr className="login-divider" />

        <button className="login-button google-login-button" onClick={handleGoogleLogin}>
          Sign in with Google
        </button>

        <p className="login-register-link">
          Don't have an account? <Link className="register-link" to="/register">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}
