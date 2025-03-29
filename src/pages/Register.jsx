import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  // ✅ Check if current user signed in with Google
  const isGoogleSignIn = currentUser?.providerData.some(
    (provider) => provider.providerId === 'google.com'
  );

  // 📨 Auto-fill email if coming from Google sign-in
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
        // Google user setting password
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
        // Normal email/password registration
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
    <div>
      <h2>{isGoogleSignIn ? 'Complete Google Registration' : 'Register'}</h2>

      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      /><br />

      {/* ✅ Show email input ONLY if not signed in with Google */}
      {!isGoogleSignIn && (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /><br />
        </>
      )}

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Confirm Password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      /><br />

      <button onClick={handleRegister}>
        {isGoogleSignIn ? 'Set Password' : 'Sign Up'}
      </button>
    </div>
  );
}
