import { useState } from 'react';
import { auth, provider, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
} from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

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

      // Optional: Send verification email
      if (!user.emailVerified) {
        await sendEmailVerification(user);
        alert('Verification email sent. Please check your inbox.');
      }

      const userRef = doc(db, 'accounts', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();

        // ✅ Check if admin or normal user
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }

      } else {
        // ❌ New Google account → store defaults and go to registration
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
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={handleEmailLogin}>Login with Email</button>
      <hr />
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
