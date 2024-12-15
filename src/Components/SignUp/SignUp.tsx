// src/components/SignUp.tsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore, GoogleAuthProvider } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../Assets/pexels-shotbyrain-3947374.jpg';
import './SignUp.css'

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  role: string;
}

const SignUp: React.FC = () => {
  const [form, setForm] = useState<SignUpForm>({ name: '', email: '', password: '', role: '' });
  const [error, setError] = useState<string | null>(null);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setGoogleUser(user);
      setForm({ ...form, name: user.displayName || '', email: user.email || '', password: '' });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = googleUser
        ? { user: googleUser }
        : await createUserWithEmailAndPassword(auth, form.email, form.password);

      const user = userCredential.user;

      await setDoc(doc(firestore, 'users', user.uid), {
        name: form.name,
        email: form.email,
        role: form.role,
        createdAt: new Date(),
        num_properties: 0,
      });

      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignin = () => {
    navigate('/login');
  };

  return (
    <div className="signup-container" >
      <div className="signup-form">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          {!googleUser && (
            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="input-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select role</option>
              <option value="lister">Property Lister</option>
              <option value="agent">Agent</option>
              <option value="buyer">Buyer</option>
              <option value="renter">Renter</option>
            </select>
          </div>
          <button type="submit" className="submit-button">Sign Up</button>
        </form>
        <button type="button" className="google-signup" onClick={handleGoogleSignUp}>
          Sign Up with Google
        </button>
        <p className="signin-text">Already have an account?</p>
        <button type="button" className="signin-button" onClick={handleSignin}>
          Sign in
        </button>
      </div>
    </div>
  );
};

export default SignUp;