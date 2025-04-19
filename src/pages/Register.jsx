import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Link added
import '../styles/Register.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  const isGoogleSignIn = currentUser?.providerData.some(
    (provider) => provider.providerId === 'google.com'
  );

  useEffect(() => {
    if (isGoogleSignIn && currentUser) {
      setEmail(currentUser.email);
    }
  }, [currentUser, isGoogleSignIn]);

  const handleRegister = async () => {
    if (!username.trim()) {
      alert('Please enter a username.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      if (isGoogleSignIn && currentUser) {
        await updatePassword(currentUser, password);

        await setDoc(doc(db, 'accounts', currentUser.uid), {
          uid: currentUser.uid,
          email: currentUser.email,
          username,
          role: 'user',
          customPasswordSet: true
        });

        alert('Google registration completed!');
        navigate('/');
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        await setDoc(doc(db, 'accounts', user.uid), {
          uid: user.uid,
          email: user.email,
          username,
          role: 'user',
          customPasswordSet: true
        });

        alert('Registration successful!');
        navigate('/');
      }
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('This email is already registered. Please log in or use Google sign-in.');
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-box">
        <h2 className="register-title">
          {isGoogleSignIn ? 'Complete Google Registration' : 'Register'}
        </h2>

        {/* ✅ Labels + Inputs */}
        <label className="register-label">Username</label>
        <input
          className="register-input"
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        {!isGoogleSignIn && (
          <>
            <label className="register-label">Email</label>
            <input
              className="register-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        )}

        <label className="register-label">Password</label>
        <input
          className="register-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="register-label">Confirm Password</label>
        <input
          className="register-input"
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="register-button" onClick={handleRegister}>
          {isGoogleSignIn ? 'Set Password' : 'Register'}
        </button>

        {/* ✅ Link to Login */}
        <p className="register-login-link">
          Already have an account? <Link className="login-link" to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

